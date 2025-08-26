import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { prisma } from '../index';

export async function tenantMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Tenant isolation is already handled through auth middleware
    // This middleware adds additional tenant-specific context
    
    if (!req.organization) {
      return res.status(403).json({ error: 'Organization context required' });
    }

    // Check if organization is active
    const org = await prisma.organization.findUnique({
      where: { id: req.organization.id },
      select: { isActive: true }
    });

    if (!org?.isActive) {
      return res.status(403).json({ error: 'Organization suspended' });
    }

    // Add tenant context to Prisma queries (for row-level security)
    // This would be used with Prisma middleware for automatic filtering
    (req as any).prismaContext = {
      organizationId: req.organization.id
    };

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(500).json({ error: 'Tenant validation failed' });
  }
}

export function extractSubdomain(hostname: string): string | null {
  // Extract subdomain from hostname
  // e.g., "dealer1.autolens.io" -> "dealer1"
  
  const parts = hostname.split('.');
  
  // Local development
  if (hostname.includes('localhost')) {
    return null;
  }
  
  // Production with subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}