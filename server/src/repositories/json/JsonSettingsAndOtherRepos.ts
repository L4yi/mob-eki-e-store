import { IAddressRepository, IAuditLogRepository, ISettingsRepository } from '../interfaces';
import { SavedAddress, AdminAuditLog, BusinessSettings, TeamMember, DeliveryZoneConfig } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonAddressRepository implements IAddressRepository {
  private store = JsonStore.getInstance();

  async findByUserId(userId: string): Promise<SavedAddress[]> {
    const addresses = await this.store.get('addresses');
    return addresses.filter((a) => a.userId === userId);
  }

  async findById(id: string): Promise<SavedAddress | null> {
    const addresses = await this.store.get('addresses');
    return addresses.find((a) => a.id === id) || null;
  }

  async create(address: SavedAddress): Promise<SavedAddress> {
    return this.store.mutate((data) => {
      if (address.isDefault) {
        data.addresses.forEach((a) => {
          if (a.userId === address.userId) a.isDefault = false;
        });
      }
      data.addresses.push(address);
      return address;
    });
  }

  async update(id: string, updates: Partial<SavedAddress>): Promise<SavedAddress | null> {
    return this.store.mutate((data) => {
      const idx = data.addresses.findIndex((a) => a.id === id);
      if (idx === -1) return null;
      if (updates.isDefault) {
        const userId = data.addresses[idx].userId;
        data.addresses.forEach((a) => {
          if (a.userId === userId) a.isDefault = false;
        });
      }
      data.addresses[idx] = {
        ...data.addresses[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.addresses[idx];
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.mutate((data) => {
      const idx = data.addresses.findIndex((a) => a.id === id);
      if (idx === -1) return false;
      data.addresses.splice(idx, 1);
      return true;
    });
  }
}

export class JsonAuditLogRepository implements IAuditLogRepository {
  private store = JsonStore.getInstance();

  async record(log: AdminAuditLog): Promise<void> {
    await this.store.mutate((data) => {
      data.auditLogs.unshift(log);
    });
  }

  async findAll(page = 1, limit = 50): Promise<{ logs: AdminAuditLog[]; total: number }> {
    const logs = await this.store.get('auditLogs');
    const total = logs.length;
    const start = (page - 1) * limit;
    return { logs: logs.slice(start, start + limit), total };
  }
}

export class JsonSettingsRepository implements ISettingsRepository {
  private store = JsonStore.getInstance();

  async getSettings(): Promise<BusinessSettings> {
    return this.store.get('settings');
  }

  async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    return this.store.mutate((data) => {
      data.settings = {
        ...data.settings,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.settings;
    });
  }

  async getTeam(): Promise<TeamMember[]> {
    const team = await this.store.get('team');
    return team.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember | null> {
    return this.store.mutate((data) => {
      const idx = data.team.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      data.team[idx] = { ...data.team[idx], ...member };
      return data.team[idx];
    });
  }

  async createTeamMember(member: TeamMember): Promise<TeamMember> {
    return this.store.mutate((data) => {
      data.team.push(member);
      return member;
    });
  }

  async getDeliveryZones(): Promise<DeliveryZoneConfig[]> {
    return this.store.get('deliveryZones');
  }

  async updateDeliveryZone(id: string, config: Partial<DeliveryZoneConfig>): Promise<DeliveryZoneConfig | null> {
    return this.store.mutate((data) => {
      const idx = data.deliveryZones.findIndex((z) => z.id === id);
      if (idx === -1) return null;
      data.deliveryZones[idx] = { ...data.deliveryZones[idx], ...config };
      return data.deliveryZones[idx];
    });
  }
}
