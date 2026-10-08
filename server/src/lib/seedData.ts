import {
  Category,
  Product,
  BusinessSettings,
  TeamMember,
  User,
  DeliveryZoneConfig,
} from '../types';
import bcrypt from 'bcryptjs';

export const initialCategories: Category[] = [
  {
    id: 'cat-handles',
    slug: 'handles',
    name: 'Handles',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80',
    description: 'Modern cabinet bar handles, profile pulls, T-bars, and luxury wardrobe handles.',
    displayOrder: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-knobs',
    slug: 'knobs',
    name: 'Knobs',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80',
    description: 'Brass, matte black, crystal, and stainless steel drawer and dresser knobs.',
    displayOrder: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-hinges',
    slug: 'hinges',
    name: 'Hinges',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80',
    description: 'Hydraulic soft-close cabinet hinges, concealed 3D hinges, and heavy-duty pivot hinges.',
    displayOrder: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-locks',
    slug: 'locks',
    name: 'Locks',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80',
    description: 'Drawer locks, wardrobe cam locks, digital keypad locks, and central locking bars.',
    displayOrder: 4,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-fittings',
    slug: 'fittings',
    name: 'Furniture Fittings',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop&q=80',
    description: 'Telescopic drawer slides, soft-close undermount runners, gas springs, and shelf pins.',
    displayOrder: 5,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'Other Accessories',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&h=300&fit=crop&q=80',
    description: 'Heavy duty caster wheels, adjustable sofa legs, cable grommets, and wardrobe accessories.',
    displayOrder: 6,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialProducts: Product[] = [];

export const initialDeliveryZones: DeliveryZoneConfig[] = [
  {
    id: 'LAGOS',
    name: 'Lagos State (Standard)',
    states: ['Lagos'],
    feeKobo: 200000, // ₦2,000
    estimatedDays: '1–2 business days',
    active: true,
  },
  {
    id: 'SOUTH_WEST',
    name: 'South West Nigeria (Ogun, Oyo, Osun, Ondo, Ekiti)',
    states: ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'],
    feeKobo: 350000, // ₦3,500
    estimatedDays: '2–3 business days',
    active: true,
  },
  {
    id: 'NATIONWIDE',
    name: 'Nationwide Courier (Other 30 States + FCT Abuja)',
    states: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo',
      'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa',
      'Niger', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ],
    feeKobo: 500000, // ₦5,000
    estimatedDays: '3–5 business days',
    active: true,
  },
  {
    id: 'PICKUP',
    name: 'Direct Store Pickup (Mushin Showroom)',
    states: ['Lagos'],
    feeKobo: 0, // Free
    estimatedDays: 'Available same-day during opening hours',
    active: true,
  },
];

export const initialSettings: BusinessSettings = {
  id: 'default',
  storeName: 'M.O.B EKI VENTURES',
  tagline: 'Quality Furniture Accessories & Architectural Hardware',
  address: '2, Amu Street, Mushin Market, Lagos, Nigeria',
  openingHours: 'Mon - Sat: 8:00 AM - 5:00 PM (Closed Sundays)',
  phone1: '08108725967',
  phone2: '08025262598',
  phone3: '08028077200',
  whatsapp: '+2348108725967',
  email: 'muhazoladejo48@gmail.com',
  deliveryLagosKobo: 200000,
  deliverySouthWestKobo: 350000,
  deliveryNationwideKobo: 500000,
  bankName: 'Guaranty Trust Bank (GTBank)',
  bankAccountName: 'M.O.B EKI VENTURES',
  bankAccountNumber: '0123456789',
  aboutText: 'M.O.B EKI VENTURES is an established physical enterprise situated at 2, Amu Street in the commercial hub of Mushin Market, Lagos. Founded by Mulikat & Mutiu Oladejo and managed alongside Oladejo Muhaz Olayiwola, we specialize in the direct importation, wholesale distribution, and retail supply of premium furniture hardware, cabinet handles, hydraulic soft-close hinges, drawer runners, and security fittings across all 36 states of Nigeria.',
  announcementText: 'Nationwide delivery available · Retail & wholesale orders welcome',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Mulikat & Mutiu Oladejo',
    position: 'Founders & Managing Directors / CEOs',
    bio: 'Pioneered M.O.B EKI VENTURES in Mushin Market with decades of hardware expertise, establishing trusted partnerships with international manufacturers.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'team-2',
    name: 'Oladejo Muhaz Olayiwola',
    position: 'General Manager & Operations Lead',
    bio: 'Oversees showroom inventory operations, corporate bulk order deliveries across Nigeria, customer relations, and digital sales inquiries.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    displayOrder: 2,
    active: true,
  }
];

export const getInitialAdminUser = async (): Promise<User> => {
  const hash = await bcrypt.hash('adminpassword123', 10);
  return {
    id: 'usr-admin-01',
    name: 'M.O.B Admin',
    email: 'admin@mobekiventures.com',
    phone: '08108725967',
    passwordHash: hash,
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
