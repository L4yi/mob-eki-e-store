-- =========================================================================
-- M.O.B EKI VENTURES - Bulletproof Armored Doors SQL Insert
-- Showroom: Shop 8, Alhaja Abibatu Mogaji Modern Market, 2, Amu Street, Mushin, Lagos
-- =========================================================================

INSERT INTO products (
    id, slug, name, sku, category_id, category_name, category_slug, 
    description, price_kobo, wholesale_price_kobo, wholesale_min_qty, 
    wholesale_enabled, retail_enabled, images, stock_quantity, 
    reserved_quantity, low_stock_threshold, specs, active, featured
) VALUES
(
    'prd-door-10', 
    'royal-armored-bulletproof-staggered-block-hardwood-entrance-door', 
    'Royal Armored Bulletproof Staggered-Block Hardwood Entrance Door', 
    'BLT-TEK-BLK10', 
    'cat-doors', 
    'Doors & Security Doors', 
    'doors', 
    'High-security armored bulletproof luxury entrance door featuring an interior ballistic steel core clad with staggered horizontal brick-motif solid natural teak hardwood. Fitted with multi-point anti-drill deadbolt locking system, heavy-gauge stainless steel vertical pull bar, and reinforced structural steel-reinforced door frame. Available in all standard and high-ceiling sizes.', 
    32000000, 
    28500000, 
    2, 
    true, 
    true, 
    '["/products/solid-teak-block-panel-entrance-door.jpg"]'::jsonb, 
    15, 
    0, 
    3, 
    '[{"label":"Security Rating","value":"Armored Ballistic Steel Core (Bulletproof Grade)"},{"label":"Available Sizes","value":"800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"},{"label":"Wood Facade","value":"Natural Solid African Teak Hardwood with UV Polyurethane Finish"},{"label":"Locking Mechanism","value":"Multi-Point Anti-Drill Security Mortise Deadbolts with Computer Keys"},{"label":"Hardware","value":"600mm Solid Stainless Steel Pull Bar & Lever Lockset Included"},{"label":"Frame & Casing","value":"Matching Heavy-Duty Steel-Reinforced Hardwood Jamb & Architrave Set"},{"label":"Application","value":"Main Luxury Entrance, VIP Residence, Executive Villa"}]'::jsonb, 
    true, 
    true
),
(
    'prd-door-11', 
    'executive-armored-bulletproof-7-plank-hardwood-door', 
    'Executive Armored Bulletproof 7-Plank Hardwood Security Door', 
    'BLT-HRD-7PLK11', 
    'cat-doors', 
    'Doors & Security Doors', 
    'doors', 
    'Architectural bulletproof security door built with a hardened steel armor plate core concealed beneath 7 wide horizontal solid hardwood planks. Offers maximum forced-entry protection and acoustic insulation, complemented with sleek matte black architectural hardware and full matching architrave casing. Available in all standard and high-ceiling sizes.', 
    28000000, 
    24500000, 
    2, 
    true, 
    true, 
    '["/products/contemporary-7-plank-hardwood-door.jpg"]'::jsonb, 
    18, 
    0, 
    3, 
    '[{"label":"Security Rating","value":"Reinforced Anti-Ballistic Steel Plate Core (Bulletproof)"},{"label":"Available Sizes","value":"800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"},{"label":"Wood Construction","value":"7 Horizontal Solid Hardwood Timber Planks with Arched Grain"},{"label":"Locking System","value":"High-Security Concealed Multi-Bolt Deadbolt System"},{"label":"Hardware","value":"Matte Black Architectural Lever Handle & Security Escutcheon Included"},{"label":"Frame Package","value":"Full Anti-Pry Structural Door Jamb & Matching Casing Trim"},{"label":"Application","value":"Master Suite, Luxury Bedroom, Private Office"}]'::jsonb, 
    true, 
    true
),
(
    'prd-door-12', 
    'grand-luxury-armored-bulletproof-vertical-groove-teak-door', 
    'Grand Luxury Armored Bulletproof Vertical-Groove Teak Entrance Door', 
    'BLT-GLD-VRT12', 
    'cat-doors', 
    'Doors & Security Doors', 
    'doors', 
    'Premier bulletproof armored entrance door featuring a high-impact ballistic core encased in seasoned vertical fluted golden teak timber. Outfitted with an oversized square stainless steel architectural pull handle, security optical viewer, multi-point lock cylinder, and high-strength reinforced sub-frame. Available in all standard and high-ceiling sizes.', 
    35000000, 
    31000000, 
    2, 
    true, 
    true, 
    '["/products/architectural-golden-teak-vertical-door.jpg"]'::jsonb, 
    12, 
    0, 
    3, 
    '[{"label":"Security Rating","value":"Heavy-Duty Armored Ballistic Steel Core (Bulletproof Grade)"},{"label":"Available Sizes","value":"800 x 2100mm, 800 x 2300mm, 900 x 2100mm, 900 x 2300mm, 1200 x 2100mm, 1200 x 2300mm"},{"label":"Timber Facing","value":"Seasoned Golden Teak Hardwood with Protective Clear Coat"},{"label":"Locking System","value":"Heavy-Duty Multi-Directional Security Deadbolts with Master Keys"},{"label":"Hardware","value":"Square-Profile Stainless Steel Pull Bar & Security Viewer Included"},{"label":"Frame & Casing","value":"Reinforced Anti-Intrusion Door Frame with Integrated Rubber Gasket"},{"label":"Application","value":"Grand Villa Entrance, Corporate Headquarters, Luxury Residence"}]'::jsonb, 
    true, 
    true
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    sku = EXCLUDED.sku, 
    price_kobo = EXCLUDED.price_kobo, 
    wholesale_price_kobo = EXCLUDED.wholesale_price_kobo, 
    images = EXCLUDED.images, 
    specs = EXCLUDED.specs, 
    stock_quantity = EXCLUDED.stock_quantity;
