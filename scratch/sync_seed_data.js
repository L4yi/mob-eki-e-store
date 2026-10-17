const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../server/data/store.json');
const seedPath = path.join(__dirname, '../server/src/lib/seedData.ts');

const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const seedCode = `import {
  Category,
  Product,
  BusinessSettings,
  TeamMember,
  User,
  DeliveryZoneConfig,
} from '../types';
import bcrypt from 'bcryptjs';

export const initialCategories: Category[] = ${JSON.stringify(store.categories, null, 2)};

export const initialProducts: Product[] = ${JSON.stringify(store.products, null, 2)};

export const initialSettings: BusinessSettings = ${JSON.stringify(store.settings, null, 2)};

export const initialDeliveryZones: DeliveryZoneConfig[] = ${JSON.stringify(store.deliveryZones, null, 2)};

export const initialTeamMembers: TeamMember[] = ${JSON.stringify(store.team, null, 2)};

export const getInitialAdminUsers = async (): Promise<User[]> => {
  const hash1 = await bcrypt.hash('adminpassword123', 10);
  const hash2 = await bcrypt.hash('Awenimi90', 10);
  const now = new Date().toISOString();
  return [
    {
      id: 'usr-admin-01',
      name: 'M.O.B Admin',
      email: 'admin@mobekiventures.com',
      phone: '08108725967',
      passwordHash: hash1,
      role: 'SUPER_ADMIN',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usr-admin-02',
      name: 'Oladejo Muhaz',
      email: 'muhazoladejo@gmail.com',
      phone: '08108725967',
      passwordHash: hash2,
      role: 'SUPER_ADMIN',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'usr-admin-03',
      name: 'Oladejo Muhaz Olayiwola',
      email: 'muhazoladejo48@gmail.com',
      phone: '08108725967',
      passwordHash: hash2,
      role: 'SUPER_ADMIN',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const getInitialAdminUser = async (): Promise<User> => {
  const users = await getInitialAdminUsers();
  return users[1]; // default to muhazoladejo@gmail.com
};
`;

fs.writeFileSync(seedPath, seedCode, 'utf8');
console.log('Synchronized seedData.ts with store.json successfully!');
