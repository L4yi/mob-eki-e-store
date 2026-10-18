const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../server/data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const bulletproofDoors = [
  {
    id: 'prd-door-10',
    slug: 'royal-armored-bulletproof-staggered-block-hardwood-entrance-door',
    name: 'Royal Armored Bulletproof Staggered-Block Hardwood Entrance Door',
    sku: 'BLT-TEK-BLK10',
    categoryId: 'cat-doors',
    categoryName: 'Doors & Security Doors',
    categorySlug: 'doors',
    description: 'High-security armored bulletproof luxury entrance door featuring an interior ballistic steel core clad with staggered horizontal brick-motif solid natural teak hardwood. Fitted with multi-point anti-drill deadbolt locking system, heavy-gauge stainless steel vertical pull bar, and reinforced structural steel-reinforced door frame. Available in all standard and high-ceiling sizes.',
    priceKobo: 32000000,
    wholesalePriceKobo: 28500000,
    wholesaleMinQty: 2,
    wholesaleEnabled: true,
    retailEnabled: true,
    images: ['/products/solid-teak-block-panel-entrance-door.jpg'],
    stockQuantity: 15,
    reservedQuantity: 0,
    lowStockThreshold: 3,
    specs: [
      { label: 'Security Rating', value: 'Armored Ballistic Steel Core (Bulletproof Grade)' },
      { label: 'Available Sizes', value: '800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm' },
      { label: 'Wood Facade', value: 'Natural Solid African Teak Hardwood with UV Polyurethane Finish' },
      { label: 'Locking Mechanism', value: 'Multi-Point Anti-Drill Security Mortise Deadbolts with Computer Keys' },
      { label: 'Hardware', value: '600mm Solid Stainless Steel Pull Bar & Lever Lockset Included' },
      { label: 'Frame & Casing', value: 'Matching Heavy-Duty Steel-Reinforced Hardwood Jamb & Architrave Set' },
      { label: 'Application', value: 'Main Luxury Entrance, VIP Residence, Executive Villa' }
    ],
    active: true,
    featured: true,
    createdAt: '2026-10-18T20:00:00.000Z',
    updatedAt: '2026-10-18T20:00:00.000Z'
  },
  {
    id: 'prd-door-11',
    slug: 'executive-armored-bulletproof-7-plank-hardwood-door',
    name: 'Executive Armored Bulletproof 7-Plank Hardwood Security Door',
    sku: 'BLT-HRD-7PLK11',
    categoryId: 'cat-doors',
    categoryName: 'Doors & Security Doors',
    categorySlug: 'doors',
    description: 'Architectural bulletproof security door built with a hardened steel armor plate core concealed beneath 7 wide horizontal solid hardwood planks. Offers maximum forced-entry protection and acoustic insulation, complemented with sleek matte black architectural hardware and full matching architrave casing. Available in all standard and high-ceiling sizes.',
    priceKobo: 28000000,
    wholesalePriceKobo: 24500000,
    wholesaleMinQty: 2,
    wholesaleEnabled: true,
    retailEnabled: true,
    images: ['/products/contemporary-7-plank-hardwood-door.jpg'],
    stockQuantity: 18,
    reservedQuantity: 0,
    lowStockThreshold: 3,
    specs: [
      { label: 'Security Rating', value: 'Reinforced Anti-Ballistic Steel Plate Core (Bulletproof)' },
      { label: 'Available Sizes', value: '800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm' },
      { label: 'Wood Construction', value: '7 Horizontal Solid Hardwood Timber Planks with Arched Grain' },
      { label: 'Locking System', value: 'High-Security Concealed Multi-Bolt Deadbolt System' },
      { label: 'Hardware', value: 'Matte Black Architectural Lever Handle & Security Escutcheon Included' },
      { label: 'Frame Package', value: 'Full Anti-Pry Structural Door Jamb & Matching Casing Trim' },
      { label: 'Application', value: 'Master Suite, Luxury Bedroom, Private Office' }
    ],
    active: true,
    featured: true,
    createdAt: '2026-10-18T20:00:00.000Z',
    updatedAt: '2026-10-18T20:00:00.000Z'
  },
  {
    id: 'prd-door-12',
    slug: 'grand-luxury-armored-bulletproof-vertical-groove-teak-door',
    name: 'Grand Luxury Armored Bulletproof Vertical-Groove Teak Entrance Door',
    sku: 'BLT-GLD-VRT12',
    categoryId: 'cat-doors',
    categoryName: 'Doors & Security Doors',
    categorySlug: 'doors',
    description: 'Premier bulletproof armored entrance door featuring a high-impact ballistic core encased in seasoned vertical fluted golden teak timber. Outfitted with an oversized square stainless steel architectural pull handle, security optical viewer, multi-point lock cylinder, and high-strength reinforced sub-frame. Available in all standard and high-ceiling sizes.',
    priceKobo: 35000000,
    wholesalePriceKobo: 31000000,
    wholesaleMinQty: 2,
    wholesaleEnabled: true,
    retailEnabled: true,
    images: ['/products/architectural-golden-teak-vertical-door.jpg'],
    stockQuantity: 12,
    reservedQuantity: 0,
    lowStockThreshold: 3,
    specs: [
      { label: 'Security Rating', value: 'Heavy-Duty Armored Ballistic Steel Core (Bulletproof Grade)' },
      { label: 'Available Sizes', value: '800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm' },
      { label: 'Timber Facing', value: 'Seasoned Golden Teak Hardwood with Protective Clear Coat' },
      { label: 'Locking System', value: 'Heavy-Duty Multi-Directional Security Deadbolts with Master Keys' },
      { label: 'Hardware', value: 'Square-Profile Stainless Steel Pull Bar & Security Viewer Included' },
      { label: 'Frame & Casing', value: 'Reinforced Anti-Intrusion Door Frame with Integrated Rubber Gasket' },
      { label: 'Application', value: 'Grand Villa Entrance, Corporate Headquarters, Luxury Residence' }
    ],
    active: true,
    featured: true,
    createdAt: '2026-10-18T20:00:00.000Z',
    updatedAt: '2026-10-18T20:00:00.000Z'
  }
];

// Remove any existing door 10, 11, 12 if re-running
store.products = store.products.filter(p => !['prd-door-10', 'prd-door-11', 'prd-door-12'].includes(p.id));
store.products.push(...bulletproofDoors);

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log(`Successfully added 3 Bulletproof Doors! Total products: ${store.products.length}`);
