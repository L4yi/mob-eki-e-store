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
    "id": "cat-handles",
    "slug": "handles",
    "name": "Handles",
    "image": "/products/matte-black-gold-banded-tbar-handle.jpg",
    "description": "Modern cabinet bar handles, profile pulls, T-bars, and luxury wardrobe handles.",
    "displayOrder": 1,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-knobs",
    "slug": "knobs",
    "name": "Knobs",
    "image": "/products/solid-polished-ball-knob.jpg",
    "description": "Brass, matte black, crystal, and stainless steel drawer and dresser knobs.",
    "displayOrder": 2,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-doors",
    "slug": "doors",
    "name": "Doors & Security Doors",
    "image": "/products/luxury-mahogany-flush-door-silver-inlays.jpg",
    "description": "Architectural interior flush doors, security doors, and double entrance doors with complete matching frames and architraves.",
    "displayOrder": 3,
    "active": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "cat-hinges",
    "slug": "hinges",
    "name": "Hinges",
    "image": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80",
    "description": "Hydraulic soft-close cabinet hinges, concealed 3D hinges, and heavy-duty pivot hinges.",
    "displayOrder": 4,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-locks",
    "slug": "locks",
    "name": "Locks",
    "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80",
    "description": "Drawer locks, wardrobe cam locks, digital keypad locks, and central locking bars.",
    "displayOrder": 5,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-fittings",
    "slug": "furniture-fittings",
    "name": "Furniture Fittings",
    "image": "/products/magic-corner-kitchen-basket.jpg",
    "description": "Telescopic drawer slides, soft-close pantry larder units, corner pullouts, and spice racks.",
    "displayOrder": 6,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-accessories",
    "slug": "other-accessories",
    "name": "Other Accessories",
    "image": "/products/luxury-wardrobe-jewelry-tray.jpg",
    "description": "Luxury wardrobe jewelry trays, laundry pull-out baskets, cutlery dividers, and caster wheels.",
    "displayOrder": 7,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "cat-appliances",
    "slug": "kitchen-appliances",
    "name": "Kitchen Appliances",
    "image": "/products/hippont-90cm-flat-heat-extractor.jpg",
    "description": "Built-in gas hobs, electric cooktops, digital heat extractors, range hoods, and built-in microwaves.",
    "displayOrder": 8,
    "active": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  }
];

export const initialProducts: Product[] = [
  {
    "id": "prd-hdl-01",
    "name": "Luxury Black & Gold Geometric Cabinet Pull Handle",
    "slug": "luxury-black-gold-geometric-cabinet-pull-handle",
    "sku": "HDL-BLK-GLD-GEO",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Contemporary dual-tone cabinet pull handle with lustrous gold accents and matte black inlay. Built for luxury wardrobes and bespoke modern kitchen cabinetry.",
    "priceKobo": 450000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 20,
    "wholesalePriceKobo": 350000,
    "images": [
      "/products/luxury-gold-black-geometric-handle.jpg"
    ],
    "stockQuantity": 150,
    "reservedQuantity": 0,
    "lowStockThreshold": 15,
    "specs": [
      {
        "label": "Material",
        "value": "Solid Zinc Alloy"
      },
      {
        "label": "Finish",
        "value": "Electroplated Gold & Matte Black"
      },
      {
        "label": "Hole Spacing",
        "value": "128mm / 160mm / 192mm"
      },
      {
        "label": "Application",
        "value": "Kitchen Cabinets, Wardrobes, Drawers"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-17T19:40:10.221Z"
  },
  {
    "id": "prd-hdl-02",
    "name": "Matte Black & Gold Banded T-Bar Cabinet Handle",
    "slug": "matte-black-gold-banded-tbar-cabinet-handle",
    "sku": "HDL-BLK-GLD-TBR",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Refined cylindrical T-bar handle featuring gold ring accents on a rich matte black bar. Available in multiple lengths and matching single knobs.",
    "priceKobo": 420000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 20,
    "wholesalePriceKobo": 320000,
    "images": [
      "/products/matte-black-gold-banded-tbar-handle.jpg"
    ],
    "stockQuantity": 180,
    "reservedQuantity": 0,
    "lowStockThreshold": 20,
    "specs": [
      {
        "label": "Material",
        "value": "Stainless Steel & Solid Brass Rings"
      },
      {
        "label": "Finish",
        "value": "Matte Black with Polished Gold Rings"
      },
      {
        "label": "Hole Spacing",
        "value": "96mm, 128mm, 192mm, 256mm"
      },
      {
        "label": "Application",
        "value": "Cabinetry, Cupboards, Wardrobes"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-hdl-03",
    "name": "Matte Black Modern Bow Bridge Cabinet Handle",
    "slug": "matte-black-modern-bow-bridge-cabinet-handle",
    "sku": "HDL-BLK-BOW01",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Ergonomic bridge-style arched cabinet handle with flared mounting feet. Clean minimalist design suitable for contemporary kitchens and furniture.",
    "priceKobo": 380000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 25,
    "wholesalePriceKobo": 290000,
    "images": [
      "/products/matte-black-bow-bridge-handle.jpg"
    ],
    "stockQuantity": 200,
    "reservedQuantity": 0,
    "lowStockThreshold": 25,
    "specs": [
      {
        "label": "Material",
        "value": "Die-cast Aluminum Alloy"
      },
      {
        "label": "Finish",
        "value": "Anodized Matte Black"
      },
      {
        "label": "Hole Spacing",
        "value": "128mm, 160mm, 224mm"
      },
      {
        "label": "Application",
        "value": "Kitchen drawers, Wardrobes"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-hdl-04",
    "name": "Brushed Stainless Steel Heavy-Duty Modern Bar Handle",
    "slug": "brushed-stainless-steel-heavy-duty-modern-bar-handle",
    "sku": "HDL-SS-BAR01",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Corrosion-resistant brushed stainless steel round bar pull handles with solid square standoffs. High durability for heavy traffic cabinets.",
    "priceKobo": 350000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 25,
    "wholesalePriceKobo": 260000,
    "images": [
      "/products/brushed-stainless-steel-bar-handle.jpg"
    ],
    "stockQuantity": 220,
    "reservedQuantity": 0,
    "lowStockThreshold": 20,
    "specs": [
      {
        "label": "Material",
        "value": "Grade 304 Stainless Steel"
      },
      {
        "label": "Finish",
        "value": "Satin Brushed Chrome"
      },
      {
        "label": "Hole Spacing",
        "value": "128mm, 160mm, 192mm, 320mm"
      },
      {
        "label": "Durability",
        "value": "Rustproof, Commercial Grade"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-hdl-05",
    "name": "Minimalist Aluminum Edge Profile Pull Handle",
    "slug": "minimalist-aluminum-edge-profile-pull-handle",
    "sku": "HDL-EDG-PRF01",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Modern edge-mounted profile pull handle available in Brushed Gold and Matte Black. Mounts seamlessly on the top or side edge of doors for a sleek handleless look.",
    "priceKobo": 390000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 20,
    "wholesalePriceKobo": 295000,
    "images": [
      "/products/minimalist-edge-profile-pull-handle.jpg"
    ],
    "stockQuantity": 160,
    "reservedQuantity": 0,
    "lowStockThreshold": 20,
    "specs": [
      {
        "label": "Material",
        "value": "Extruded Aluminum"
      },
      {
        "label": "Colors",
        "value": "Brushed Champagne Gold & Matte Black"
      },
      {
        "label": "Lengths",
        "value": "150mm, 200mm, 300mm, 400mm"
      },
      {
        "label": "Mounting",
        "value": "Rear Screw Edge Fix"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-hdl-06",
    "name": "Matte Black Architectural T-Bar Cabinet Pull & Knob",
    "slug": "matte-black-architectural-tbar-cabinet-pull-knob",
    "sku": "HDL-BLK-TBR02",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Bold square-profile matte black T-bar handle with solid square posts. Engineered for heavy kitchen pantry doors and vanity drawers.",
    "priceKobo": 320000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 25,
    "wholesalePriceKobo": 240000,
    "images": [
      "/products/matte-black-architectural-tbar-handle.jpg"
    ],
    "stockQuantity": 240,
    "reservedQuantity": 0,
    "lowStockThreshold": 25,
    "specs": [
      {
        "label": "Material",
        "value": "Solid Aluminum Alloy"
      },
      {
        "label": "Finish",
        "value": "Anodized Black Matte"
      },
      {
        "label": "Hole Spacing",
        "value": "96mm, 128mm, 160mm, 192mm"
      },
      {
        "label": "Includes",
        "value": "M4 Mounting Screws"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-hdl-07",
    "name": "Matte Black Concealed Lip Edge Finger Pull Handle",
    "slug": "matte-black-concealed-lip-edge-finger-pull-handle",
    "sku": "HDL-BLK-LIP01",
    "categoryId": "cat-handles",
    "categoryName": "Handles",
    "categorySlug": "handles",
    "description": "Low-profile continuous lip finger pull that slots neatly over cabinet door edges. Provides a clean seamless aesthetic without visible screw heads.",
    "priceKobo": 360000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 25,
    "wholesalePriceKobo": 270000,
    "images": [
      "/products/matte-black-concealed-lip-edge-pull.jpg"
    ],
    "stockQuantity": 190,
    "reservedQuantity": 0,
    "lowStockThreshold": 20,
    "specs": [
      {
        "label": "Material",
        "value": "Precision Aluminum Extrusion"
      },
      {
        "label": "Finish",
        "value": "Matte Black Powder Coat"
      },
      {
        "label": "Door Thickness",
        "value": "Fits 18mm to 20mm panels"
      },
      {
        "label": "Application",
        "value": "Modern Handleless Kitchens"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-knb-01",
    "name": "Modern Oval Paperclip Drop Ring Drawer Knob",
    "slug": "modern-oval-paperclip-drop-ring-drawer-knob",
    "sku": "KNB-OVL-PPC01",
    "categoryId": "cat-knobs",
    "categoryName": "Knobs",
    "categorySlug": "knobs",
    "description": "Creative dual-tone designer oval ring knob with gold frame and vibrant matte insert plates (Black, White, Orange, Silver). Perfect accent for luxury dressers.",
    "priceKobo": 220000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 30,
    "wholesalePriceKobo": 170000,
    "images": [
      "/products/modern-oval-paperclip-drawer-knob.jpg"
    ],
    "stockQuantity": 250,
    "reservedQuantity": 0,
    "lowStockThreshold": 30,
    "specs": [
      {
        "label": "Material",
        "value": "Solid Brass & Zinc Inlay"
      },
      {
        "label": "Color Options",
        "value": "Gold/Black, Gold/White, Gold/Orange, Chrome/Black"
      },
      {
        "label": "Mounting",
        "value": "Single Hole Bolt"
      },
      {
        "label": "Application",
        "value": "Wardrobes, Nightstands, Vanity Drawers"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-knb-02",
    "name": "Solid Polished Spherical Ball Cabinet Knob",
    "slug": "solid-polished-spherical-ball-cabinet-knob",
    "sku": "KNB-BAL-SLD01",
    "categoryId": "cat-knobs",
    "categoryName": "Knobs",
    "categorySlug": "knobs",
    "description": "Heavy solid spherical ball knob with mirror-polished reflective finish. Available in French Gold, Rose Gold, and Mirror Chrome.",
    "priceKobo": 180000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 30,
    "wholesalePriceKobo": 135000,
    "images": [
      "/products/solid-polished-ball-knob.jpg"
    ],
    "stockQuantity": 300,
    "reservedQuantity": 0,
    "lowStockThreshold": 30,
    "specs": [
      {
        "label": "Material",
        "value": "Solid Brass Alloy"
      },
      {
        "label": "Diameter",
        "value": "25mm / 30mm"
      },
      {
        "label": "Finish",
        "value": "High Gloss Mirror Gold & Chrome"
      },
      {
        "label": "Application",
        "value": "Cabinets, Bathroom Vanities, Sideboards"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-01",
    "name": "Magic Corner Kitchen Pull-Out Blind Corner Organizer Basket",
    "slug": "magic-corner-kitchen-pull-out-blind-corner-organizer-basket",
    "sku": "FIT-CRN-001",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Heavy-duty 2-tier magic corner mechanism with smooth soft-close sliding tracks. Pulls blind corner kitchen contents forward for effortless access.",
    "priceKobo": 14500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 12500000,
    "images": [
      "/products/magic-corner-kitchen-basket.jpg"
    ],
    "stockQuantity": 12,
    "reservedQuantity": 0,
    "lowStockThreshold": 2,
    "specs": [
      {
        "label": "Mechanism",
        "value": "Synchronized Soft-Close Runner"
      },
      {
        "label": "Tray Material",
        "value": "Tempered Smoked Glass & Carbon Steel"
      },
      {
        "label": "Cabinet Width",
        "value": "Fits 900mm - 1000mm blind corner units"
      },
      {
        "label": "Load Capacity",
        "value": "Up to 35kg total"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-02",
    "name": "Multi-Tier Kitchen Tall Larder / Tandem Pantry Pull-Out Unit",
    "slug": "multi-tier-kitchen-tall-larder-tandem-pantry-pull-out-unit",
    "sku": "FIT-LDR-001",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Tall pantry larder storage system with dual-action door trays and internal pull-out shelves. Maximizes vertical kitchen storage space.",
    "priceKobo": 22000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 19500000,
    "images": [
      "/products/tall-larder-pantry-unit.jpg"
    ],
    "stockQuantity": 10,
    "reservedQuantity": 0,
    "lowStockThreshold": 2,
    "specs": [
      {
        "label": "Height Range",
        "value": "1850mm - 2150mm (Adjustable Frame)"
      },
      {
        "label": "Baskets",
        "value": "6 Main Trays + 6 Door Baskets"
      },
      {
        "label": "Motion",
        "value": "Heavy Duty Soft Close Damper"
      },
      {
        "label": "Load Rating",
        "value": "70kg Total"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-03",
    "name": "Premium Glass-Side Tall Pantry Pull-Out Larder Unit",
    "slug": "premium-glass-side-tall-pantry-pull-out-larder-unit",
    "sku": "FIT-LDR-002",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "High-end tall larder unit with transparent smoked glass side guards and non-slip mats. Full extension soft close slide mechanism.",
    "priceKobo": 24000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 21500000,
    "images": [
      "/products/tall-pantry-glass-pullout.jpg"
    ],
    "stockQuantity": 8,
    "reservedQuantity": 0,
    "lowStockThreshold": 2,
    "specs": [
      {
        "label": "Basket Sides",
        "value": "Smoked Toughened Safety Glass"
      },
      {
        "label": "Slides",
        "value": "Under-mount Heavy Duty Hydraulic Runners"
      },
      {
        "label": "Cabinet Width",
        "value": "450mm / 600mm"
      },
      {
        "label": "Load Capacity",
        "value": "80kg"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-04",
    "name": "Soft-Close Tall Larder Swing-Out Pantry Unit",
    "slug": "soft-close-tall-larder-swing-out-pantry-unit",
    "sku": "FIT-LDR-003",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Swing-out 180° revolving tall pantry system. When opened, inner baskets glide forward while door baskets pivot outward for full panoramic visibility.",
    "priceKobo": 26000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 23000000,
    "images": [
      "/products/tall-larder-swingout-pantry.jpg"
    ],
    "stockQuantity": 6,
    "reservedQuantity": 0,
    "lowStockThreshold": 2,
    "specs": [
      {
        "label": "Structure",
        "value": "Anodized Grey Steel & Glass Baskets"
      },
      {
        "label": "Capacity",
        "value": "12 Tier Storage (6 Door + 6 Inner)"
      },
      {
        "label": "Opening Angle",
        "value": "110° to 180° swing"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-05",
    "name": "Heavy-Duty Pull-Down Elevator Upper Cabinet Spice Rack",
    "slug": "heavy-duty-pull-down-elevator-upper-cabinet-spice-rack",
    "sku": "FIT-PLD-SPC01",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Hydraulic counterbalanced pull-down storage basket for overhead wall cabinets. Lowers jars and spices directly into comfortable reaching height.",
    "priceKobo": 8500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 7200000,
    "images": [
      "/products/pulldown-elevator-spice-rack.jpg"
    ],
    "stockQuantity": 20,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Cabinet Width",
        "value": "600mm / 800mm / 900mm wall cabinets"
      },
      {
        "label": "Mechanism",
        "value": "Dual Gas-Spring Balanced Lift"
      },
      {
        "label": "Tiers",
        "value": "2-Tier Stainless Steel with Front Guard"
      },
      {
        "label": "Weight Capacity",
        "value": "15kg"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-06",
    "name": "Kitchen Under-Counter Dish & Plate Organizer Drawer Rack",
    "slug": "kitchen-under-counter-dish-plate-organizer-drawer-rack",
    "sku": "FIT-KTC-DSH01",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Pull-out base cabinet drawer basket designed with dedicated vertical slots for dinner plates, bowls, and cookware with drip drainage base.",
    "priceKobo": 6800000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 5800000,
    "images": [
      "/products/kitchen-dish-plate-drawer-rack.jpg"
    ],
    "stockQuantity": 22,
    "reservedQuantity": 0,
    "lowStockThreshold": 5,
    "specs": [
      {
        "label": "Material",
        "value": "Stainless Steel & Solid Polymer"
      },
      {
        "label": "Drawer Size",
        "value": "Fits 800mm - 900mm wide drawers"
      },
      {
        "label": "Runner Type",
        "value": "Undermount Soft-Close Slides"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-fit-07",
    "name": "Heavy-Duty 90° Corner Cabinet Suspension Hanging Bracket Fittings",
    "slug": "heavy-duty-90-corner-cabinet-suspension-hanging-bracket-fittings",
    "sku": "FIT-BRK-90DEG",
    "categoryId": "cat-fittings",
    "categoryName": "Furniture Fittings",
    "categorySlug": "furniture-fittings",
    "description": "Concealed steel corner brackets with snap-on decorative cover caps. Used for structural assembly and wall hanging of heavy kitchen and wardrobe cabinets.",
    "priceKobo": 120000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 50,
    "wholesalePriceKobo": 85000,
    "images": [
      "/products/corner-cabinet-suspension-bracket-fittings.jpg"
    ],
    "stockQuantity": 500,
    "reservedQuantity": 0,
    "lowStockThreshold": 50,
    "specs": [
      {
        "label": "Material",
        "value": "Zinc Plated Steel with ABS Cover"
      },
      {
        "label": "Cap Colors",
        "value": "Black, White, Grey, Brown"
      },
      {
        "label": "Angle",
        "value": "90 Degree Precision"
      },
      {
        "label": "Application",
        "value": "Cabinet Wall Hanging & Joint Support"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-acc-01",
    "name": "Luxury Wardrobe Leather Jewelry & Watch Organizer Drawer Tray",
    "slug": "luxury-wardrobe-leather-jewelry-watch-organizer-drawer-tray",
    "sku": "ACC-WRD-JWL01",
    "categoryId": "cat-accessories",
    "categoryName": "Other Accessories",
    "categorySlug": "other-accessories",
    "description": "Master closet organizer tray wrapped in premium grey micro-suede leather with custom compartments for watches, rings, sunglasses, and precious jewelry.",
    "priceKobo": 4500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 5,
    "wholesalePriceKobo": 3800000,
    "images": [
      "/products/luxury-wardrobe-jewelry-tray.jpg"
    ],
    "stockQuantity": 25,
    "reservedQuantity": 0,
    "lowStockThreshold": 5,
    "specs": [
      {
        "label": "Exterior",
        "value": "Hand-stitched Grey PU Leather"
      },
      {
        "label": "Interior",
        "value": "Velvet Soft Cushion Dividers"
      },
      {
        "label": "Dimensions",
        "value": "864mm x 450mm x 60mm (Customizable)"
      },
      {
        "label": "Application",
        "value": "Wardrobe Island, Master Bedroom Dresser"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-acc-02",
    "name": "Wardrobe Pull-Out Woven Rattan Laundry & Storage Basket",
    "slug": "wardrobe-pull-out-woven-rattan-laundry-storage-basket",
    "sku": "ACC-WRD-BSK01",
    "categoryId": "cat-accessories",
    "categoryName": "Other Accessories",
    "categorySlug": "other-accessories",
    "description": "Breathable hand-woven rattan storage basket set into an aluminum pullout frame with concealed soft-close slide runners.",
    "priceKobo": 5500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 4,
    "wholesalePriceKobo": 4600000,
    "images": [
      "/products/wardrobe-woven-rattan-basket.jpg"
    ],
    "stockQuantity": 30,
    "reservedQuantity": 0,
    "lowStockThreshold": 5,
    "specs": [
      {
        "label": "Basket",
        "value": "Synthetic Breathable Rattan Weave"
      },
      {
        "label": "Frame",
        "value": "Anodized Charcoal Aluminum"
      },
      {
        "label": "Cabinet Width",
        "value": "600mm / 800mm / 900mm"
      },
      {
        "label": "Runners",
        "value": "Full Extension Soft Close"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-acc-03",
    "name": "Kitchen Cutlery & Utensil Organizer Grey ABS Drawer Tray",
    "slug": "kitchen-cutlery-utensil-organizer-grey-abs-drawer-tray",
    "sku": "ACC-KTC-CTL01",
    "categoryId": "cat-accessories",
    "categoryName": "Other Accessories",
    "categorySlug": "other-accessories",
    "description": "Durable food-grade ABS cutlery organizer tray with molded compartments for spoons, knives, forks, and long cooking utensils.",
    "priceKobo": 1850000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 10,
    "wholesalePriceKobo": 1450000,
    "images": [
      "/products/kitchen-cutlery-tray-grey.jpg"
    ],
    "stockQuantity": 45,
    "reservedQuantity": 0,
    "lowStockThreshold": 10,
    "specs": [
      {
        "label": "Material",
        "value": "High-Impact Food Grade ABS"
      },
      {
        "label": "Color",
        "value": "Anthracite Metallic Grey"
      },
      {
        "label": "Size",
        "value": "Fits 600mm - 900mm wide kitchen drawers"
      },
      {
        "label": "Maintenance",
        "value": "Wipe Clean / Dishwasher Safe"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-app-01",
    "name": "HIPPONT 90cm Slim Flat Kitchen Heat Extractor",
    "slug": "hippont-90cm-slim-flat-kitchen-heat-extractor",
    "sku": "APP-HIP-EXT90",
    "categoryId": "cat-appliances",
    "categoryName": "Kitchen Appliances",
    "categorySlug": "kitchen-appliances",
    "description": "High suction 90cm flat kitchen heat extractor hood with digital touch control panel, multi-layer aluminum grease filters, and ultra-bright LED work lighting.",
    "priceKobo": 12500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 11500000,
    "images": [
      "/products/hippont-90cm-flat-heat-extractor.jpg"
    ],
    "stockQuantity": 15,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Brand",
        "value": "HIPPONT"
      },
      {
        "label": "Size",
        "value": "90cm Slim Profile"
      },
      {
        "label": "Control",
        "value": "Digital Touch & Motion Sensor"
      },
      {
        "label": "Filter",
        "value": "3x Washable Baffle Filters"
      },
      {
        "label": "Lighting",
        "value": "High-efficiency LED Strip"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-app-02",
    "name": "HIPPONT 5-Burner Tempered Glass Built-In Cooktop Hob",
    "slug": "hippont-5-burner-tempered-glass-built-in-cooktop-hob",
    "sku": "APP-HIP-HOB05",
    "categoryId": "cat-appliances",
    "categoryName": "Kitchen Appliances",
    "categorySlug": "kitchen-appliances",
    "description": "Premium 5-burner gas cooktop with 8mm explosion-proof tempered black glass, heavy-duty cast iron pan supports, and automatic electric pulse ignition.",
    "priceKobo": 13000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 11800000,
    "images": [
      "/products/hippont-5-burner-glass-cooktop.jpg"
    ],
    "stockQuantity": 18,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Brand",
        "value": "HIPPONT"
      },
      {
        "label": "Burners",
        "value": "5 High-Efficiency Gas Burners (Triple Ring Wok)"
      },
      {
        "label": "Surface",
        "value": "8mm Tempered Black Safety Glass"
      },
      {
        "label": "Supports",
        "value": "Heavy Duty Cast Iron"
      },
      {
        "label": "Ignition",
        "value": "Automatic Under-knob Electric Pulse"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-app-03",
    "name": "POLYSTAR 20L Built-In Microwave with Frame Kit (PV-BD20BBL)",
    "slug": "polystar-20l-built-in-microwave-pv-bd20bbl",
    "sku": "APP-PLY-MCW20",
    "categoryId": "cat-appliances",
    "categoryName": "Kitchen Appliances",
    "categorySlug": "kitchen-appliances",
    "description": "Polystar 20-Litre built-in microwave oven with integrated grill function, seamless trim frame kit, 700W microwave output, and 900W grill power input.",
    "priceKobo": 18500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 16500000,
    "images": [
      "/products/polystar-20l-builtin-microwave.jpg"
    ],
    "stockQuantity": 14,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Brand",
        "value": "POLYSTAR (PV-BD20BBL)"
      },
      {
        "label": "Capacity",
        "value": "20 Litres"
      },
      {
        "label": "Microwave Power",
        "value": "700 Watts"
      },
      {
        "label": "Grill Power",
        "value": "900 Watts"
      },
      {
        "label": "Control",
        "value": "Digital Control with LED Display"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-app-04",
    "name": "POLYSTAR 4-Burner & 1 Electric Built-In Gas Hob (PV-JYPS4G1EB)",
    "slug": "polystar-4-burner-1-electric-built-in-gas-hob-pv-jyps4g1eb",
    "sku": "APP-PLY-HOB41",
    "categoryId": "cat-appliances",
    "categoryName": "Kitchen Appliances",
    "categorySlug": "kitchen-appliances",
    "description": "Dual-fuel hybrid built-in hob featuring 4 rapid gas burners and 1 rapid electric hotplate on an 8mm black stainless steel chassis with metal control knobs.",
    "priceKobo": 17500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 15500000,
    "images": [
      "/products/polystar-4b-1e-gas-hob.jpg"
    ],
    "stockQuantity": 16,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Brand",
        "value": "POLYSTAR (PV-JYPS4G1EB)"
      },
      {
        "label": "Configuration",
        "value": "4 Gas Burners + 1 Electric Hotplate"
      },
      {
        "label": "Material",
        "value": "8mm Real Stainless Steel Black Finish"
      },
      {
        "label": "Knobs",
        "value": "Heat-resistant Metal Knobs with BS Plug"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-app-05",
    "name": "POLYSTAR 90cm Digital Rangehood with Voice Control (PV-TD9110BVC)",
    "slug": "polystar-90cm-digital-rangehood-voice-control-pv-td9110bvc",
    "sku": "APP-PLY-RNG90",
    "categoryId": "cat-appliances",
    "categoryName": "Kitchen Appliances",
    "categorySlug": "kitchen-appliances",
    "description": "Smart kitchen rangehood with intelligent voice commands, infrared hand gesture control, pure copper motor, metal blower, and aluminum charcoal filters.",
    "priceKobo": 19500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 17500000,
    "images": [
      "/products/polystar-90cm-digital-rangehood.jpg"
    ],
    "stockQuantity": 12,
    "reservedQuantity": 0,
    "lowStockThreshold": 2,
    "specs": [
      {
        "label": "Brand",
        "value": "POLYSTAR (PV-TD9110BVC)"
      },
      {
        "label": "Smart Tech",
        "value": "Voice Control & Hand Wave Motion Sensor"
      },
      {
        "label": "Motor",
        "value": "Heavy Duty 100% Pure Copper Motor"
      },
      {
        "label": "Filter",
        "value": "Aluminum Charcoal Filter with Metal Blower"
      },
      {
        "label": "Lighting",
        "value": "Tempered Glass with Energy-Saving LED"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-08T12:38:23.257Z",
    "updatedAt": "2026-10-08T12:38:23.257Z"
  },
  {
    "id": "prd-door-01",
    "name": "Luxury Mahogany Flush Door with Dual Silver Inlays & Full Frame",
    "slug": "luxury-mahogany-flush-door-dual-silver-inlays",
    "sku": "DOR-MHG-SLV2",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "High-density solid-core mahogany wood-grain interior security door featuring precision horizontal brushed silver accent inlays, full matching architrave jamb casing, and mortise lever lockset compatibility. All standard and luxury height sizes available.",
    "priceKobo": 10500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 9200000,
    "images": [
      "/products/luxury-mahogany-flush-door-silver-inlays.jpg"
    ],
    "stockQuantity": 24,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Finish",
        "value": "Natural Mahogany Grain with Clear UV Protective Coat"
      },
      {
        "label": "Inlay Design",
        "value": "Dual Brushed Silver Aluminium Horizontal Inlays"
      },
      {
        "label": "Frame & Architrave",
        "value": "Full Matching Engineered Wood Frame & Casing Included"
      },
      {
        "label": "Core Type",
        "value": "Solid Acoustic & Sound-Dampening Engineered Core"
      },
      {
        "label": "Application",
        "value": "Master Bedroom, Office Suite, Luxury Apartment"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-02",
    "name": "Executive White Paneled Double Entrance Door with Frosted Glass",
    "slug": "executive-white-paneled-double-entrance-door-frosted-glass",
    "sku": "DOR-WHT-DBL-GLS",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Architectural 1.5-leaf mother-and-child double entrance door in pure satin white. Features tempered frosted glass grid lites for gentle natural illumination with full privacy, classic raised bottom panels, and wide ornamental corniced architraves.",
    "priceKobo": 21500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 2,
    "wholesalePriceKobo": 19000000,
    "images": [
      "/products/executive-white-paneled-double-door-frosted-glass.jpg"
    ],
    "stockQuantity": 15,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Door Style",
        "value": "Unequal Double Leaf (Mother & Child) / Glazed Entrance"
      },
      {
        "label": "Glazing",
        "value": "Dual-Layer Tempered Frosted Privacy Glass"
      },
      {
        "label": "Finish",
        "value": "Waterproof Satin White Polyurethane Coat"
      },
      {
        "label": "Frame & Architrave",
        "value": "Heavy-Duty Reinforced Door Jamb with Moulded Cornice Casing"
      },
      {
        "label": "Hardware Support",
        "value": "Compatible with T-Bar Handles, Deadbolts & Pulls"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-03",
    "name": "Contemporary Natural Oak Flush Door with Geometric Black Inlays",
    "slug": "contemporary-natural-oak-flush-door-geometric-black-inlays",
    "sku": "DOR-OAK-BLK-GEO",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Modern Scandinavian-inspired interior flush door crafted with warm natural oak vertical grain veneer and CNC-machined geometric black groove lines. Includes matching seamless box-profile architrave casing.",
    "priceKobo": 9800000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 8500000,
    "images": [
      "/products/contemporary-natural-oak-interior-door-grooves.jpg"
    ],
    "stockQuantity": 28,
    "reservedQuantity": 0,
    "lowStockThreshold": 5,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Veneer Finish",
        "value": "Natural European White Oak Grain Finish"
      },
      {
        "label": "Inlay Design",
        "value": "Precision Asymmetrical Black Grooved Architectural Lines"
      },
      {
        "label": "Frame Profile",
        "value": "Full Concealed-Joint Architrave Frame System Included"
      },
      {
        "label": "Thickness",
        "value": "45mm Heavy-Duty Solid Door Leaf"
      },
      {
        "label": "Recommended For",
        "value": "Modern Living Rooms, Bedrooms, Commercial Executive Offices"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-04",
    "name": "Architectural Matte Anthracite Flush Door with 4 Brushed Chrome Inlays",
    "slug": "architectural-matte-anthracite-flush-door-4-brushed-chrome-inlays",
    "sku": "DOR-ANT-CHR4",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Ultra-modern luxury interior door in deep matte anthracite charcoal grey finish. Accented with 4 equidistant brushed chrome horizontal metal strips embedded flush into the door leaf, framed with matching charcoal architrave casing.",
    "priceKobo": 11500000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 9800000,
    "images": [
      "/products/architectural-matte-anthracite-flush-door-chrome-strips.jpg"
    ],
    "stockQuantity": 20,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Finish",
        "value": "Anti-Fingerprint Matte Anthracite Charcoal Texture"
      },
      {
        "label": "Inlay Design",
        "value": "4 Quad-Spaced Brushed Chrome Stainless Steel Horizontal Strips"
      },
      {
        "label": "Jamb & Architrave",
        "value": "Complete Matching Casing with Sound-Dampening Rubber Gasket"
      },
      {
        "label": "Hardware Support",
        "value": "Standard Mortise Magnetic Latch & Euro Profile Cylinder"
      },
      {
        "label": "Application",
        "value": "Contemporary Luxury Residences, Hotels, Executive Boardrooms"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-05",
    "name": "Classic Deep Walnut Flush Door with 4 Horizontal Silver Inlays",
    "slug": "classic-deep-walnut-flush-door-4-horizontal-silver-inlays",
    "sku": "DOR-MHG-SLV4",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Timeless deep reddish-brown mahogany and walnut wood flush door with rich vertical grain figuring. Decorated with 4 clean horizontal silver aluminium strip accents and full matching mahogany wood casing.",
    "priceKobo": 11000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 9500000,
    "images": [
      "/products/classic-deep-walnut-flush-door-4-silver-inlays.jpg"
    ],
    "stockQuantity": 26,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Finish",
        "value": "High-Lustre Deep Walnut / Mahogany Wood Polish"
      },
      {
        "label": "Accents",
        "value": "4 Horizontal Flush-Embedded Aluminium Inlays"
      },
      {
        "label": "Casing & Frame",
        "value": "120mm - 150mm Adjustable Wall Thickness Door Jamb & Architraves"
      },
      {
        "label": "Core Construction",
        "value": "Multi-Ply Engineered Wood Core for Anti-Warping Durability"
      },
      {
        "label": "Usage",
        "value": "Luxury Residential Bedrooms, Bathrooms, Executive Suites"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-06",
    "name": "Golden Honey Beech Flush Door with 4 Silver Chrome Inlays",
    "slug": "golden-honey-beech-flush-door-4-silver-chrome-inlays",
    "sku": "DOR-BCH-SLV4",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Bright and welcoming golden honey beech interior door featuring natural wood warmth and 4 reflective silver chrome horizontal inlays. Supplied complete with matching honey beech architrave frame.",
    "priceKobo": 10000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 8800000,
    "images": [
      "/products/golden-honey-beech-flush-door-silver-inlays.jpg"
    ],
    "stockQuantity": 22,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Tone & Finish",
        "value": "Golden Honey Beech / Warm Teak Fine Grain"
      },
      {
        "label": "Inlays",
        "value": "4 Stainless Chrome Horizontal Metallic Accent Strips"
      },
      {
        "label": "Architrave Frame",
        "value": "Solid Timber Frame with Adjustable Architrave Lip Included"
      },
      {
        "label": "Moisture Resistance",
        "value": "Treated Against Swelling, Termites, and Humid Environments"
      },
      {
        "label": "Recommended For",
        "value": "Bedrooms, Hotel Guest Rooms, Corridors, Luxury Apartments"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-07",
    "name": "Deep Walnut Architectural Door with 3 Stainless Steel Inlays & Frame",
    "slug": "deep-walnut-architectural-door-3-stainless-steel-inlays-frame",
    "sku": "DOR-WLN-SS3",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Heavyweight dark American walnut finished door showing robust jamb construction. Features an architectural 3-strip inlay motif (2 upper header strips and 1 lower base strip) for a balanced modern look.",
    "priceKobo": 12000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 10500000,
    "images": [
      "/products/deep-walnut-rosewood-door-with-casing-frame.jpg"
    ],
    "stockQuantity": 18,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Wood Figuring",
        "value": "Rich Dark American Walnut with Straight & Swirl Grain Patterns"
      },
      {
        "label": "Inlay Pattern",
        "value": "3 Stainless Steel Strips (2 Header Inlays, 1 Kickplate Inlay)"
      },
      {
        "label": "Door Frame",
        "value": "Heavy-Duty Solid Engineered Wood Casing with Rebated Gasket"
      },
      {
        "label": "Leaf Thickness",
        "value": "45mm Solid Security Standard Leaf"
      },
      {
        "label": "Application",
        "value": "Apartment Entrance, Office Chambers, Master Bedroom"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-08",
    "name": "Modern Warm Teak Flush Door with Dual Silver Section Inlays",
    "slug": "modern-warm-teak-flush-door-dual-silver-section-inlays",
    "sku": "DOR-TEK-SLV2",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Natural warm teak interior door designed with two horizontal silver inlay lines that frame the handle and lock cylinder sector. Features full-height matching teak door frame and architraves.",
    "priceKobo": 10200000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 8900000,
    "images": [
      "/products/modern-warm-teak-flush-door-dual-silver-inlays.jpg"
    ],
    "stockQuantity": 30,
    "reservedQuantity": 0,
    "lowStockThreshold": 5,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Finish",
        "value": "Warm African Teak Semi-Gloss Wood Grain"
      },
      {
        "label": "Inlays",
        "value": "Dual Horizontal Brushed Silver Strips Framing Lock Zone"
      },
      {
        "label": "Casing Package",
        "value": "Includes 3-Piece Architrave Trim & Matching Rebated Jamb"
      },
      {
        "label": "Acoustic Rating",
        "value": "Sound-Insulated Composite Core"
      },
      {
        "label": "Compatibility",
        "value": "Standard Nigerian Mortise Locks and Ball-Bearing Hinges"
      }
    ],
    "active": true,
    "featured": false,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-09",
    "name": "Modern Ebony Black Flush Door with Dual Silver Accent Inlays",
    "slug": "modern-ebony-black-flush-door-dual-silver-accent-inlays",
    "sku": "DOR-EBN-SLV2",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "High-contrast architectural interior flush door in rich ebony black grain finish. Accented by two horizontal silver inlays framing the chrome lockset zone, with matching black architrave frame casing.",
    "priceKobo": 11000000,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "wholesaleMinQty": 3,
    "wholesalePriceKobo": 9600000,
    "images": [
      "/products/modern-ebony-black-flush-door-dual-silver-inlays.jpg"
    ],
    "stockQuantity": 25,
    "reservedQuantity": 0,
    "lowStockThreshold": 4,
    "specs": [
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Finish",
        "value": "Deep Ebony Black Matte Grain Finish"
      },
      {
        "label": "Accents",
        "value": "Two Precision Horizontal Silver Metallic Strips"
      },
      {
        "label": "Casing System",
        "value": "Full Ebony Black Architrave Jamb Set Included"
      },
      {
        "label": "Core Quality",
        "value": "Solid Heavyweight Acoustic Core (45mm thickness)"
      },
      {
        "label": "Usage",
        "value": "Luxury Minimalist Interiors, Master Suites, Studio Apartments"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-11T13:00:00.000Z",
    "updatedAt": "2026-10-11T13:00:00.000Z"
  },
  {
    "id": "prd-door-10",
    "slug": "royal-armored-bulletproof-staggered-block-hardwood-entrance-door",
    "name": "Royal Armored Bulletproof Staggered-Block Hardwood Entrance Door",
    "sku": "BLT-TEK-BLK10",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "High-security armored bulletproof luxury entrance door featuring an interior ballistic steel core clad with staggered horizontal brick-motif solid natural teak hardwood. Fitted with multi-point anti-drill deadbolt locking system, heavy-gauge stainless steel vertical pull bar, and reinforced structural steel-reinforced door frame. Available in all standard and high-ceiling sizes.",
    "priceKobo": 32000000,
    "wholesalePriceKobo": 28500000,
    "wholesaleMinQty": 2,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "images": [
      "/products/solid-teak-block-panel-entrance-door.jpg"
    ],
    "stockQuantity": 15,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Security Rating",
        "value": "Armored Ballistic Steel Core (Bulletproof Grade)"
      },
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Wood Facade",
        "value": "Natural Solid African Teak Hardwood with UV Polyurethane Finish"
      },
      {
        "label": "Locking Mechanism",
        "value": "Multi-Point Anti-Drill Security Mortise Deadbolts with Computer Keys"
      },
      {
        "label": "Hardware",
        "value": "600mm Solid Stainless Steel Pull Bar & Lever Lockset Included"
      },
      {
        "label": "Frame & Casing",
        "value": "Matching Heavy-Duty Steel-Reinforced Hardwood Jamb & Architrave Set"
      },
      {
        "label": "Application",
        "value": "Main Luxury Entrance, VIP Residence, Executive Villa"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-18T20:00:00.000Z",
    "updatedAt": "2026-10-18T20:00:00.000Z"
  },
  {
    "id": "prd-door-11",
    "slug": "executive-armored-bulletproof-7-plank-hardwood-door",
    "name": "Executive Armored Bulletproof 7-Plank Hardwood Security Door",
    "sku": "BLT-HRD-7PLK11",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Architectural bulletproof security door built with a hardened steel armor plate core concealed beneath 7 wide horizontal solid hardwood planks. Offers maximum forced-entry protection and acoustic insulation, complemented with sleek matte black architectural hardware and full matching architrave casing. Available in all standard and high-ceiling sizes.",
    "priceKobo": 28000000,
    "wholesalePriceKobo": 24500000,
    "wholesaleMinQty": 2,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "images": [
      "/products/contemporary-7-plank-hardwood-door.jpg"
    ],
    "stockQuantity": 18,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Security Rating",
        "value": "Reinforced Anti-Ballistic Steel Plate Core (Bulletproof)"
      },
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Wood Construction",
        "value": "7 Horizontal Solid Hardwood Timber Planks with Arched Grain"
      },
      {
        "label": "Locking System",
        "value": "High-Security Concealed Multi-Bolt Deadbolt System"
      },
      {
        "label": "Hardware",
        "value": "Matte Black Architectural Lever Handle & Security Escutcheon Included"
      },
      {
        "label": "Frame Package",
        "value": "Full Anti-Pry Structural Door Jamb & Matching Casing Trim"
      },
      {
        "label": "Application",
        "value": "Master Suite, Luxury Bedroom, Private Office"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-18T20:00:00.000Z",
    "updatedAt": "2026-10-18T20:00:00.000Z"
  },
  {
    "id": "prd-door-12",
    "slug": "grand-luxury-armored-bulletproof-vertical-groove-teak-door",
    "name": "Grand Luxury Armored Bulletproof Vertical-Groove Teak Entrance Door",
    "sku": "BLT-GLD-VRT12",
    "categoryId": "cat-doors",
    "categoryName": "Doors & Security Doors",
    "categorySlug": "doors",
    "description": "Premier bulletproof armored entrance door featuring a high-impact ballistic core encased in seasoned vertical fluted golden teak timber. Outfitted with an oversized square stainless steel architectural pull handle, security optical viewer, multi-point lock cylinder, and high-strength reinforced sub-frame. Available in all standard and high-ceiling sizes.",
    "priceKobo": 35000000,
    "wholesalePriceKobo": 31000000,
    "wholesaleMinQty": 2,
    "wholesaleEnabled": true,
    "retailEnabled": true,
    "images": [
      "/products/architectural-golden-teak-vertical-door.jpg"
    ],
    "stockQuantity": 12,
    "reservedQuantity": 0,
    "lowStockThreshold": 3,
    "specs": [
      {
        "label": "Security Rating",
        "value": "Heavy-Duty Armored Ballistic Steel Core (Bulletproof Grade)"
      },
      {
        "label": "Available Sizes",
        "value": "800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"
      },
      {
        "label": "Timber Facing",
        "value": "Seasoned Golden Teak Hardwood with Protective Clear Coat"
      },
      {
        "label": "Locking System",
        "value": "Heavy-Duty Multi-Directional Security Deadbolts with Master Keys"
      },
      {
        "label": "Hardware",
        "value": "Square-Profile Stainless Steel Pull Bar & Security Viewer Included"
      },
      {
        "label": "Frame & Casing",
        "value": "Reinforced Anti-Intrusion Door Frame with Integrated Rubber Gasket"
      },
      {
        "label": "Application",
        "value": "Grand Villa Entrance, Corporate Headquarters, Luxury Residence"
      }
    ],
    "active": true,
    "featured": true,
    "createdAt": "2026-10-18T20:00:00.000Z",
    "updatedAt": "2026-10-18T20:00:00.000Z"
  }
];

export const initialSettings: BusinessSettings = {
  "id": "settings-01",
  "storeName": "M.O.B EKI VENTURES",
  "tagline": "Quality Furniture Accessories & Fittings",
  "address": "2, Amu Street, Mushin Market, Lagos, Nigeria",
  "openingHours": "Mon - Sat: 8:00 AM - 6:00 PM",
  "phone1": "08108725967",
  "phone2": "08023841013",
  "whatsapp": "2348108725967",
  "email": "sales@mobekiventures.com",
  "deliveryLagosKobo": 200000,
  "deliverySouthWestKobo": 350000,
  "deliveryNationwideKobo": 500000,
  "bankName": "Access Bank",
  "bankAccountName": "M.O.B EKI VENTURES",
  "bankAccountNumber": "1234567890",
  "aboutText": "M.O.B EKI VENTURES is a premier hardware supplier based in Mushin, Lagos, Nigeria. We specialize in luxury architectural handles, knobs, hydraulic hinges, precision locks, wardrobe accessories, and modern kitchen fittings.",
  "announcementText": "Showroom open Mon-Sat at 2, Amu Street, Mushin Market, Lagos. Same-day dispatch across Lagos & nationwide haulage available.",
  "createdAt": "2026-10-08T12:38:23.257Z",
  "updatedAt": "2026-10-08T12:38:23.257Z"
};

export const initialDeliveryZones: DeliveryZoneConfig[] = [
  {
    "id": "LAGOS",
    "name": "Lagos State (Same / Next Day Delivery)",
    "states": [
      "Lagos"
    ],
    "feeKobo": 200000,
    "estimatedDays": "1-2 business days",
    "active": true
  },
  {
    "id": "SOUTH_WEST",
    "name": "South-West Nigeria (Interstate Courier)",
    "states": [
      "Ogun",
      "Oyo",
      "Osun",
      "Ondo",
      "Ekiti"
    ],
    "feeKobo": 350000,
    "estimatedDays": "2-3 business days",
    "active": true
  },
  {
    "id": "NATIONWIDE",
    "name": "Nationwide Haulage / Park Delivery",
    "states": [
      "Abia",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Enugu",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Nasarawa",
      "Niger",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
      "FCT - Abuja"
    ],
    "feeKobo": 500000,
    "estimatedDays": "3-5 business days",
    "active": true
  },
  {
    "id": "PICKUP",
    "name": "Store Pickup (2, Amu Street, Mushin Market)",
    "states": [
      "Lagos"
    ],
    "feeKobo": 0,
    "estimatedDays": "Ready same day",
    "active": true
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    "id": "team-01",
    "name": "M.O.B Store Manager",
    "position": "Operations & Inventory Lead",
    "bio": "Oversees inventory quality control and trade fulfillment at Mushin showroom.",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
    "displayOrder": 1,
    "active": true
  }
];

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
