import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { requireRole, requirePermission } from '../middleware/auth';

const router = Router();

// Validation schemas
const createVehicleSchema = z.object({
  vin: z.string().length(17),
  stockNumber: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
  bodyStyle: z.string().optional(),
  mileage: z.number().min(0).optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  drivetrain: z.string().optional(),
  fuelType: z.string().optional(),
  mpgCity: z.number().optional(),
  mpgHighway: z.number().optional(),
  msrp: z.number().optional(),
  invoicePrice: z.number().optional(),
  askingPrice: z.number().optional(),
  internetPrice: z.number().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  condition: z.enum(['NEW', 'USED', 'CPO']).optional(),
  certified: z.boolean().optional(),
  locationName: z.string().optional(),
  locationCode: z.string().optional(),
  row: z.string().optional(),
  spot: z.string().optional()
});

const updateVehicleSchema = createVehicleSchema.partial();

// Get all vehicles for organization
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      status,
      condition,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const where: any = {
      organizationId: req.organization!.id,
      isDeleted: false
    };

    if (status) {
      where.status = status;
    }

    if (condition) {
      where.condition = condition;
    }

    if (search) {
      where.OR = [
        { vin: { contains: search as string, mode: 'insensitive' } },
        { stockNumber: { contains: search as string, mode: 'insensitive' } },
        { make: { contains: search as string, mode: 'insensitive' } },
        { model: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          media: {
            where: { type: 'PHOTO_EXTERIOR' },
            take: 1,
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              media: true,
              leads: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder }
      }),
      prisma.vehicle.count({ where })
    ]);

    res.json({
      vehicles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single vehicle
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.organization!.id,
        isDeleted: false
      },
      include: {
        media: {
          orderBy: { order: 'asc' }
        },
        history: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        assignments: {
          include: { photographer: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
});

// Create new vehicle
router.post('/', requirePermission('vehicles:create'), async (req: AuthRequest, res, next) => {
  try {
    const data = createVehicleSchema.parse(req.body);

    // Check for duplicate VIN or stock number
    const existing = await prisma.vehicle.findFirst({
      where: {
        organizationId: req.organization!.id,
        OR: [
          { vin: data.vin },
          { stockNumber: data.stockNumber }
        ]
      }
    });

    if (existing) {
      throw new AppError(
        existing.vin === data.vin 
          ? 'Vehicle with this VIN already exists' 
          : 'Stock number already in use',
        409
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        organizationId: req.organization!.id,
        status: 'PENDING',
        sourceType: 'MANUAL',
        dateInStock: new Date()
      }
    });

    // Log history
    await prisma.vehicleHistory.create({
      data: {
        vehicleId: vehicle.id,
        userId: req.user!.id,
        action: 'CREATED',
        details: { source: 'manual', user: req.user!.email }
      }
    });

    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
});

// Update vehicle
router.put('/:id', requirePermission('vehicles:update'), async (req: AuthRequest, res, next) => {
  try {
    const data = updateVehicleSchema.parse(req.body);

    // Get current vehicle
    const current = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.organization!.id,
        isDeleted: false
      }
    });

    if (!current) {
      throw new AppError('Vehicle not found', 404);
    }

    // Track price changes
    const priceFields = ['askingPrice', 'internetPrice', 'salePrice'];
    const priceChanges: any[] = [];

    for (const field of priceFields) {
      if (data[field as keyof typeof data] !== undefined && 
          data[field as keyof typeof data] !== current[field as keyof typeof current]) {
        priceChanges.push({
          vehicleId: current.id,
          priceType: field,
          oldPrice: current[field as keyof typeof current] || 0,
          newPrice: data[field as keyof typeof data],
          changedBy: req.user!.email
        });
      }
    }

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    // Create price history records
    if (priceChanges.length > 0) {
      await prisma.priceHistory.createMany({
        data: priceChanges
      });
    }

    // Log history
    await prisma.vehicleHistory.create({
      data: {
        vehicleId: vehicle.id,
        userId: req.user!.id,
        action: 'UPDATED',
        details: { changes: data }
      }
    });

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
});

// Delete vehicle (soft delete)
router.delete('/:id', requirePermission('vehicles:delete'), async (req: AuthRequest, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.organization!.id,
        isDeleted: false
      }
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    await prisma.vehicle.update({
      where: { id: req.params.id },
      data: {
        isDeleted: true,
        status: 'DELETED'
      }
    });

    // Log history
    await prisma.vehicleHistory.create({
      data: {
        vehicleId: vehicle.id,
        userId: req.user!.id,
        action: 'DELETED',
        details: { deletedBy: req.user!.email }
      }
    });

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Bulk import vehicles
router.post('/import', requireRole('OWNER', 'ADMIN', 'MANAGER'), async (req: AuthRequest, res, next) => {
  try {
    const { vehicles } = req.body;

    if (!Array.isArray(vehicles)) {
      throw new AppError('Invalid import data', 400);
    }

    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as any[]
    };

    for (const vehicleData of vehicles) {
      try {
        const validated = createVehicleSchema.parse(vehicleData);

        // Check if exists
        const existing = await prisma.vehicle.findFirst({
          where: {
            organizationId: req.organization!.id,
            vin: validated.vin
          }
        });

        if (existing) {
          // Update existing
          await prisma.vehicle.update({
            where: { id: existing.id },
            data: validated
          });
          results.updated++;
        } else {
          // Create new
          await prisma.vehicle.create({
            data: {
              ...validated,
              organizationId: req.organization!.id,
              sourceType: 'API',
              dateInStock: new Date()
            }
          });
          results.created++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          vin: vehicleData.vin,
          error: error.message
        });
      }
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;