const fs = require('fs');
const path = require('path');

const doorCategory = {
  id: "cat-doors",
  slug: "doors",
  name: "Doors & Security Doors",
  image: "/products/luxury-mahogany-flush-door-silver-inlays.jpg",
  description: "Architectural interior flush doors, security doors, and double entrance doors with complete matching frames and architraves.",
  displayOrder: 3,
  active: true,
  createdAt: "2026-10-11T13:00:00.000Z",
  updatedAt: "2026-10-11T13:00:00.000Z"
};

const commonSizes = "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm";

const newDoorProducts = [
  {
    id: "prd-door-01",
    name: "Luxury Mahogany Flush Door with Dual Silver Inlays & Full Frame",
    slug: "luxury-mahogany-flush-door-dual-silver-inlays",
    sku: "DOR-MHG-SLV2",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "High-density solid-core mahogany wood-grain interior security door featuring precision horizontal brushed silver accent inlays, full matching architrave jamb casing, and mortise lever lockset compatibility. All standard and luxury height sizes available.",
    priceKobo: 10500000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 9200000,
    images: [
      "/products/luxury-mahogany-flush-door-silver-inlays.jpg"
    ],
    stockQuantity: 24,
    reservedQuantity: 0,
    lowStockThreshold: 4,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Finish", value: "Natural Mahogany Grain with Clear UV Protective Coat" },
      { label: "Inlay Design", value: "Dual Brushed Silver Aluminium Horizontal Inlays" },
      { label: "Frame & Architrave", value: "Full Matching Engineered Wood Frame & Casing Included" },
      { label: "Core Type", value: "Solid Acoustic & Sound-Dampening Engineered Core" },
      { label: "Application", value: "Master Bedroom, Office Suite, Luxury Apartment" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-02",
    name: "Executive White Paneled Double Entrance Door with Frosted Glass",
    slug: "executive-white-paneled-double-entrance-door-frosted-glass",
    sku: "DOR-WHT-DBL-GLS",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Architectural 1.5-leaf mother-and-child double entrance door in pure satin white. Features tempered frosted glass grid lites for gentle natural illumination with full privacy, classic raised bottom panels, and wide ornamental corniced architraves.",
    priceKobo: 21500000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 2,
    wholesalePriceKobo: 19000000,
    images: [
      "/products/executive-white-paneled-double-door-frosted-glass.jpg"
    ],
    stockQuantity: 15,
    reservedQuantity: 0,
    lowStockThreshold: 3,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Door Style", value: "Unequal Double Leaf (Mother & Child) / Glazed Entrance" },
      { label: "Glazing", value: "Dual-Layer Tempered Frosted Privacy Glass" },
      { label: "Finish", value: "Waterproof Satin White Polyurethane Coat" },
      { label: "Frame & Architrave", value: "Heavy-Duty Reinforced Door Jamb with Moulded Cornice Casing" },
      { label: "Hardware Support", value: "Compatible with T-Bar Handles, Deadbolts & Pulls" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-03",
    name: "Contemporary Natural Oak Flush Door with Geometric Black Inlays",
    slug: "contemporary-natural-oak-flush-door-geometric-black-inlays",
    sku: "DOR-OAK-BLK-GEO",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Modern Scandinavian-inspired interior flush door crafted with warm natural oak vertical grain veneer and CNC-machined geometric black groove lines. Includes matching seamless box-profile architrave casing.",
    priceKobo: 9800000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 8500000,
    images: [
      "/products/contemporary-natural-oak-interior-door-grooves.jpg"
    ],
    stockQuantity: 28,
    reservedQuantity: 0,
    lowStockThreshold: 5,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Veneer Finish", value: "Natural European White Oak Grain Finish" },
      { label: "Inlay Design", value: "Precision Asymmetrical Black Grooved Architectural Lines" },
      { label: "Frame Profile", value: "Full Concealed-Joint Architrave Frame System Included" },
      { label: "Thickness", value: "45mm Heavy-Duty Solid Door Leaf" },
      { label: "Recommended For", value: "Modern Living Rooms, Bedrooms, Commercial Executive Offices" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-04",
    name: "Architectural Matte Anthracite Flush Door with 4 Brushed Chrome Inlays",
    slug: "architectural-matte-anthracite-flush-door-4-brushed-chrome-inlays",
    sku: "DOR-ANT-CHR4",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Ultra-modern luxury interior door in deep matte anthracite charcoal grey finish. Accented with 4 equidistant brushed chrome horizontal metal strips embedded flush into the door leaf, framed with matching charcoal architrave casing.",
    priceKobo: 11500000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 9800000,
    images: [
      "/products/architectural-matte-anthracite-flush-door-chrome-strips.jpg"
    ],
    stockQuantity: 20,
    reservedQuantity: 0,
    lowStockThreshold: 4,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Finish", value: "Anti-Fingerprint Matte Anthracite Charcoal Texture" },
      { label: "Inlay Design", value: "4 Quad-Spaced Brushed Chrome Stainless Steel Horizontal Strips" },
      { label: "Jamb & Architrave", value: "Complete Matching Casing with Sound-Dampening Rubber Gasket" },
      { label: "Hardware Support", value: "Standard Mortise Magnetic Latch & Euro Profile Cylinder" },
      { label: "Application", value: "Contemporary Luxury Residences, Hotels, Executive Boardrooms" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-05",
    name: "Classic Deep Walnut Flush Door with 4 Horizontal Silver Inlays",
    slug: "classic-deep-walnut-flush-door-4-horizontal-silver-inlays",
    sku: "DOR-MHG-SLV4",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Timeless deep reddish-brown mahogany and walnut wood flush door with rich vertical grain figuring. Decorated with 4 clean horizontal silver aluminium strip accents and full matching mahogany wood casing.",
    priceKobo: 11000000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 9500000,
    images: [
      "/products/classic-deep-walnut-flush-door-4-silver-inlays.jpg"
    ],
    stockQuantity: 26,
    reservedQuantity: 0,
    lowStockThreshold: 4,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Finish", value: "High-Lustre Deep Walnut / Mahogany Wood Polish" },
      { label: "Accents", value: "4 Horizontal Flush-Embedded Aluminium Inlays" },
      { label: "Casing & Frame", value: "120mm - 150mm Adjustable Wall Thickness Door Jamb & Architraves" },
      { label: "Core Construction", value: "Multi-Ply Engineered Wood Core for Anti-Warping Durability" },
      { label: "Usage", value: "Luxury Residential Bedrooms, Bathrooms, Executive Suites" }
    ],
    active: true,
    featured: false,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-06",
    name: "Golden Honey Beech Flush Door with 4 Silver Chrome Inlays",
    slug: "golden-honey-beech-flush-door-4-silver-chrome-inlays",
    sku: "DOR-BCH-SLV4",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Bright and welcoming golden honey beech interior door featuring natural wood warmth and 4 reflective silver chrome horizontal inlays. Supplied complete with matching honey beech architrave frame.",
    priceKobo: 10000000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 8800000,
    images: [
      "/products/golden-honey-beech-flush-door-silver-inlays.jpg"
    ],
    stockQuantity: 22,
    reservedQuantity: 0,
    lowStockThreshold: 4,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Tone & Finish", value: "Golden Honey Beech / Warm Teak Fine Grain" },
      { label: "Inlays", value: "4 Stainless Chrome Horizontal Metallic Accent Strips" },
      { label: "Architrave Frame", value: "Solid Timber Frame with Adjustable Architrave Lip Included" },
      { label: "Moisture Resistance", value: "Treated Against Swelling, Termites, and Humid Environments" },
      { label: "Recommended For", value: "Bedrooms, Hotel Guest Rooms, Corridors, Luxury Apartments" }
    ],
    active: true,
    featured: false,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-07",
    name: "Deep Walnut Architectural Door with 3 Stainless Steel Inlays & Frame",
    slug: "deep-walnut-architectural-door-3-stainless-steel-inlays-frame",
    sku: "DOR-WLN-SS3",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Heavyweight dark American walnut finished door showing robust jamb construction. Features an architectural 3-strip inlay motif (2 upper header strips and 1 lower base strip) for a balanced modern look.",
    priceKobo: 12000000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 10500000,
    images: [
      "/products/deep-walnut-rosewood-door-with-casing-frame.jpg"
    ],
    stockQuantity: 18,
    reservedQuantity: 0,
    lowStockThreshold: 3,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Wood Figuring", value: "Rich Dark American Walnut with Straight & Swirl Grain Patterns" },
      { label: "Inlay Pattern", value: "3 Stainless Steel Strips (2 Header Inlays, 1 Kickplate Inlay)" },
      { label: "Door Frame", value: "Heavy-Duty Solid Engineered Wood Casing with Rebated Gasket" },
      { label: "Leaf Thickness", value: "45mm Solid Security Standard Leaf" },
      { label: "Application", value: "Apartment Entrance, Office Chambers, Master Bedroom" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-08",
    name: "Modern Warm Teak Flush Door with Dual Silver Section Inlays",
    slug: "modern-warm-teak-flush-door-dual-silver-section-inlays",
    sku: "DOR-TEK-SLV2",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "Natural warm teak interior door designed with two horizontal silver inlay lines that frame the handle and lock cylinder sector. Features full-height matching teak door frame and architraves.",
    priceKobo: 10200000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 8900000,
    images: [
      "/products/modern-warm-teak-flush-door-dual-silver-inlays.jpg"
    ],
    stockQuantity: 30,
    reservedQuantity: 0,
    lowStockThreshold: 5,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Finish", value: "Warm African Teak Semi-Gloss Wood Grain" },
      { label: "Inlays", value: "Dual Horizontal Brushed Silver Strips Framing Lock Zone" },
      { label: "Casing Package", value: "Includes 3-Piece Architrave Trim & Matching Rebated Jamb" },
      { label: "Acoustic Rating", value: "Sound-Insulated Composite Core" },
      { label: "Compatibility", value: "Standard Nigerian Mortise Locks and Ball-Bearing Hinges" }
    ],
    active: true,
    featured: false,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  },
  {
    id: "prd-door-09",
    name: "Modern Ebony Black Flush Door with Dual Silver Accent Inlays",
    slug: "modern-ebony-black-flush-door-dual-silver-accent-inlays",
    sku: "DOR-EBN-SLV2",
    categoryId: "cat-doors",
    categoryName: "Doors & Security Doors",
    categorySlug: "doors",
    description: "High-contrast architectural interior flush door in rich ebony black grain finish. Accented by two horizontal silver inlays framing the chrome lockset zone, with matching black architrave frame casing.",
    priceKobo: 11000000,
    wholesaleEnabled: true,
    retailEnabled: true,
    wholesaleMinQty: 3,
    wholesalePriceKobo: 9600000,
    images: [
      "/products/modern-ebony-black-flush-door-dual-silver-inlays.jpg"
    ],
    stockQuantity: 25,
    reservedQuantity: 0,
    lowStockThreshold: 4,
    specs: [
      { label: "Available Sizes", value: commonSizes },
      { label: "Finish", value: "Deep Ebony Black Matte Grain Finish" },
      { label: "Accents", value: "Two Precision Horizontal Silver Metallic Strips" },
      { label: "Casing System", value: "Full Ebony Black Architrave Jamb Set Included" },
      { label: "Core Quality", value: "Solid Heavyweight Acoustic Core (45mm thickness)" },
      { label: "Usage", value: "Luxury Minimalist Interiors, Master Suites, Studio Apartments" }
    ],
    active: true,
    featured: true,
    createdAt: "2026-10-11T13:00:00.000Z",
    updatedAt: "2026-10-11T13:00:00.000Z"
  }
];

// Update server/data/store.json
const storePath = path.join(__dirname, '../server/data/store.json');
if (fs.existsSync(storePath)) {
  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
  
  // Add or update category
  const existingCatIdx = store.categories.findIndex(c => c.id === 'cat-doors');
  if (existingCatIdx >= 0) {
    store.categories[existingCatIdx] = doorCategory;
  } else {
    store.categories.splice(2, 0, doorCategory);
  }
  // Re-number display orders
  store.categories.forEach((c, idx) => { c.displayOrder = idx + 1; });

  // Add new door products (remove existing if re-running)
  store.products = store.products.filter(p => !p.id.startsWith('prd-door-'));
  store.products.push(...newDoorProducts);

  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log(`Updated store.json: ${store.categories.length} categories, ${store.products.length} products.`);
}

console.log('Done preparing seed data.');
