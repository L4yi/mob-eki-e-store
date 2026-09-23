import { repositories } from '../repositories';
import { AdminAuditLog, BusinessSettings, TeamMember, User, UserRole } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'mob_eki_jwt_secret_key_production_2026';

export class AuditLogService {
  private auditRepo = repositories.auditLogRepo;

  public async log(params: {
    adminId: string;
    adminEmail: string;
    action: string;
    entityType: 'PRODUCT' | 'CATEGORY' | 'ORDER' | 'INVENTORY' | 'PAYMENT' | 'SETTINGS';
    entityId: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    ipAddress?: string;
  }): Promise<void> {
    await this.auditRepo.record({
      id: `log-${crypto.randomUUID()}`,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      beforeState: params.beforeState,
      afterState: params.afterState,
      ipAddress: params.ipAddress,
      createdAt: new Date().toISOString(),
    });
  }

  public async getLogs(page = 1, limit = 50) {
    return this.auditRepo.findAll(page, limit);
  }
}

export class AuthService {
  private userRepo = repositories.userRepo;

  public async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser: User = {
      id: `usr-${crypto.randomUUID()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: data.role || 'CUSTOMER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await this.userRepo.create(newUser);
    const token = this.generateToken(created);

    const { passwordHash: _, ...safeUser } = created;
    return { user: safeUser, token };
  }

  public async login(
    email: string,
    pass: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(pass, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public async getProfile(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public async updateProfile(userId: string, updates: { name?: string; phone?: string }): Promise<Omit<User, 'passwordHash'> | null> {
    const updated = await this.userRepo.update(userId, updates);
    if (!updated) return null;
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  public async changePassword(userId: string, currentPass: string, newPass: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.passwordHash) throw new Error('User not found');

    const valid = await bcrypt.compare(currentPass, user.passwordHash);
    if (!valid) throw new Error('Incorrect current password');

    const newHash = await bcrypt.hash(newPass, 10);
    await this.userRepo.update(userId, { passwordHash: newHash });
    return true;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

export class SettingsService {
  private settingsRepo = repositories.settingsRepo;

  public async getSettings(): Promise<{ settings: BusinessSettings; team: TeamMember[] }> {
    const settings = await this.settingsRepo.getSettings();
    const team = await this.settingsRepo.getTeam();
    return { settings, team };
  }

  public async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    return this.settingsRepo.updateSettings(updates);
  }

  public async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    return this.settingsRepo.updateTeamMember(id, updates);
  }

  public async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    return this.settingsRepo.createTeamMember({
      id: `team-${crypto.randomUUID()}`,
      ...member,
    });
  }
}

export const auditLogService = new AuditLogService();
export const authService = new AuthService();
export const settingsService = new SettingsService();
