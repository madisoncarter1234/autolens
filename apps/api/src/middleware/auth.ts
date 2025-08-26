import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    organizationId: string;
    email: string;
    role: string;
    permissions: string[];
  };
  organization?: {
    id: string;
    subdomain: string;
  };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Check for token in different places
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    if (!session.user.isActive) {
      return res.status(403).json({ error: 'Account deactivated' });
    }

    // Attach user and organization to request
    req.user = {
      id: session.user.id,
      organizationId: session.user.organizationId,
      email: session.user.email,
      role: session.user.role,
      permissions: session.user.permissions
    };

    req.organization = {
      id: session.user.organization.id,
      subdomain: session.user.organization.subdomain
    };

    // Update last login
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastLoginAt: new Date() }
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid authentication' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasPermission = permissions.some(p => req.user!.permissions.includes(p));
    
    if (!hasPermission && req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}