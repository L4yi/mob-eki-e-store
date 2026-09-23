import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'mob_eki_jwt_secret_key_production_2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch {}
  }
  return next();
};

export const requireRole = (roles: (UserRole | string)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const userRole = req.user.role.toUpperCase();
    const normalizedRoles = roles.map((r) => r.toUpperCase());
    const isAllowed =
      normalizedRoles.includes(userRole) ||
      (userRole === 'SUPERADMIN' && normalizedRoles.includes('SUPER_ADMIN')) ||
      (userRole === 'SUPER_ADMIN' && normalizedRoles.includes('SUPERADMIN'));

    if (!isAllowed) {
      return res.status(403).json({ error: 'Insufficient permissions for this operation' });
    }
    return next();
  };
};

export const requireAdmin = requireRole(['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'ORDER_MANAGER', 'INVENTORY_MANAGER']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN', 'SUPERADMIN']);
