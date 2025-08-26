import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  organizationName: z.string().min(2),
  subdomain: z.string().min(3).regex(/^[a-z0-9-]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register new organization and owner
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if subdomain is taken
    const existingOrg = await prisma.organization.findUnique({
      where: { subdomain: data.subdomain }
    });

    if (existingOrg) {
      throw new AppError('Subdomain already taken', 409);
    }

    // Check if email is taken
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create organization and owner user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const org = await tx.organization.create({
        data: {
          name: data.organizationName,
          subdomain: data.subdomain,
          settings: {
            onboardingCompleted: false,
            trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
          }
        }
      });

      // Create owner user
      const user = await tx.user.create({
        data: {
          organizationId: org.id,
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: 'OWNER',
          permissions: ['*'], // Full permissions
          emailVerified: false
        }
      });

      // Create default media settings
      await tx.mediaSettings.create({
        data: {
          organizationId: org.id
        }
      });

      return { org, user };
    });

    // Create session token
    const token = jwt.sign(
      { 
        userId: result.user.id,
        organizationId: result.org.id,
        email: result.user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Store session
    await prisma.session.create({
      data: {
        userId: result.user.id,
        token,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role
      },
      organization: {
        id: result.org.id,
        name: result.org.name,
        subdomain: result.org.subdomain
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account deactivated', 403);
    }

    if (!user.organization.isActive) {
      throw new AppError('Organization suspended', 403);
    }

    // Create session token
    const token = jwt.sign(
      { 
        userId: user.id,
        organizationId: user.organizationId,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        subdomain: user.organization.subdomain
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

    if (token) {
      // Delete session
      await prisma.session.delete({
        where: { token }
      }).catch(() => {}); // Ignore if session doesn't exist
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Check session
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: { organization: true }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Invalid or expired session', 401);
    }

    res.json({
      valid: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        permissions: session.user.permissions
      },
      organization: {
        id: session.user.organization.id,
        name: session.user.organization.name,
        subdomain: session.user.organization.subdomain
      }
    });
  } catch (error) {
    next(error);
  }
});

// Request password reset
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    // Find user (don't reveal if exists)
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // TODO: Generate reset token and send email
      // For now, just log it
      console.log(`Password reset requested for ${email}`);
    }

    res.json({ 
      message: 'If an account exists with that email, a password reset link has been sent.' 
    });
  } catch (error) {
    next(error);
  }
});

export default router;