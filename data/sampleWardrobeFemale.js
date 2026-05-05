// =============================================================================
// sampleWardrobeFemale.js
// =============================================================================

const SAMPLE_WARDROBE_FEMALE = [
    // ── TOPS (7 items) ──
    { id: 'sample_f_t1', name: 'White Ribbed Crop Top', category: 'Top', fit: 'Tight', colour: 'White', formality: 'Casual', warmth: 'Warm', length: 'Cropped', image: require('../assets/sampleWardrobe/Women/Tops/white Ribbed Crop top.png'), isSample: true },
    { id: 'sample_f_t2', name: 'Black Oversized T-Shirt', category: 'Top', fit: 'Oversized', colour: 'Black', formality: 'Casual', warmth: 'Warm', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Black Oversized T-shirt.png'), isSample: true },
    { id: 'sample_f_t3', name: 'White Satin Blouse', category: 'Top', fit: 'Regular', colour: 'White', formality: 'Smart', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/White Satin Blouse.png'), isSample: true },
    { id: 'sample_f_t4', name: 'Beige Knit Cardigan', category: 'Top', fit: 'Oversized', colour: 'Beige', formality: 'Everyday', warmth: 'Cold', length: 'Long', image: require('../assets/sampleWardrobe/Women/Tops/Beige Knit Cardigan.png'), isSample: true },
    { id: 'sample_f_t5', name: 'Navy Breton Stripe Top', category: 'Top', fit: 'Regular', colour: 'Navy', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Navy Breton Stripe Top.png'), isSample: true },
    { id: 'sample_f_t6', name: 'Pink Fitted Bodysuit', category: 'Top', fit: 'Tight', colour: 'Pink', formality: 'Everyday', warmth: 'Warm', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Pink Fitted Bodysuit.png'), isSample: true },
    { id: 'sample_f_t7', name: 'Burgundy Roll Neck Jumper', category: 'Top', fit: 'Regular', colour: 'Burgundy', formality: 'Everyday', warmth: 'Cold', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Burgundy Roll Neck Jumper.png'), isSample: true },

    // ── BOTTOMS (5 items) ──
    { id: 'sample_f_b1', name: 'Blue High Waist Mom Jeans', category: 'Bottom', fit: 'Regular', colour: 'Blue', formality: 'Everyday', warmth: 'Transitional', length: 'Long', image: require('../assets/sampleWardrobe/Women/Bottoms/Blue High Waist Mom jeans.png'), isSample: true },
    { id: 'sample_f_b2', name: 'Black Faux Leather Mini Skirt', category: 'Bottom', fit: 'Tight', colour: 'Black', formality: 'Smart', warmth: 'Warm', length: 'Cropped', image: require('../assets/sampleWardrobe/Women/Bottoms/Black Faux Leather Mini Skirt.png'), isSample: true },
    { id: 'sample_f_b3', name: 'Beige Wide Leg Trousers', category: 'Bottom', fit: 'Oversized', colour: 'Beige', formality: 'Everyday', warmth: 'Transitional', length: 'Long', image: require('../assets/sampleWardrobe/Women/Bottoms/Beige Wide Leg Trousers.png'), isSample: true },
    { id: 'sample_f_b4', name: 'Black Cycling Shorts', category: 'Bottom', fit: 'Tight', colour: 'Black', formality: 'Casual', warmth: 'Warm', length: 'Cropped', image: require('../assets/sampleWardrobe/Women/Bottoms/Black Cycling Shorts.png'), isSample: true },
    { id: 'sample_f_b5', name: 'Grey Pleated Midi Skirt', category: 'Bottom', fit: 'Regular', colour: 'Grey', formality: 'Smart', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Bottoms/Grey Pleated Mini Skirt.png'), isSample: true },

    // ── FULL BODY (3 items) ──
    { id: 'sample_f_fb1', name: 'Black Midi Wrap Dress', category: 'Full Body', fit: 'Regular', colour: 'Black', formality: 'Smart', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Full Body/Black Midi Wrap Dress.png'), isSample: true },
    { id: 'sample_f_fb2', name: 'Floral Summer Dress', category: 'Full Body', fit: 'Regular', colour: 'Green', formality: 'Everyday', warmth: 'Warm', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Full Body/Floral Sumer Dress.png'), isSample: true },
    { id: 'sample_f_fb3', name: 'Beige Linen Jumpsuit', category: 'Full Body', fit: 'Regular', colour: 'Beige', formality: 'Everyday', warmth: 'Warm', length: 'Long', image: require('../assets/sampleWardrobe/Women/Full Body/Beige Linen Jumpsuit.png'), isSample: true },

    // ── SHOES (4 items) ──
    { id: 'sample_f_s1', name: 'White Chunky Trainers', category: 'Shoes', fit: 'Regular', colour: 'White', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/White Chunky Trainers.png'), isSample: true },
    { id: 'sample_f_s2', name: 'Black Heeled Ankle Boots', category: 'Shoes', fit: 'Regular', colour: 'Black', formality: 'Smart', warmth: 'Cold', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Black Heeled Ankle Boots.png'), isSample: true },
    { id: 'sample_f_s3', name: 'Tan Strappy Sandals', category: 'Shoes', fit: 'Regular', colour: 'Brown', formality: 'Casual', warmth: 'Warm', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Tan Strappy Sandals.png'), isSample: true },
    { id: 'sample_f_s4', name: 'Black Ballet Flats', category: 'Shoes', fit: 'Regular', colour: 'Black', formality: 'Smart', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Black Ballet Flats.png'), isSample: true },

    // ── OUTERWEAR (3 items) ──
    { id: 'sample_f_o1', name: 'Camel Wool Coat', category: 'Outerwear', fit: 'Regular', colour: 'Beige', formality: 'Smart', warmth: 'Cold', length: 'Long', image: require('../assets/sampleWardrobe/Women/Outerwear/Camel Wool Coat.png'), isSample: true },
    { id: 'sample_f_o2', name: 'Black Cropped Puffer Jacket', category: 'Outerwear', fit: 'Oversized', colour: 'Black', formality: 'Casual', warmth: 'Cold', length: 'Cropped', image: require('../assets/sampleWardrobe/Women/Outerwear/Black Puffer Jacket.png'), isSample: true },
    { id: 'sample_f_o3', name: 'Khaki Oversized Blazer', category: 'Outerwear', fit: 'Oversized', colour: 'Green', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Outerwear/Khaki Oversized Blazer.png'), isSample: true },

    // ── ATHLETIC (3 items) ──
    { id: 'sample_f_a1', name: 'Black Sports Bra', category: 'Top', fit: 'Tight', colour: 'Black', formality: 'Athletic', warmth: 'Warm', length: 'Cropped', image: require('../assets/sampleWardrobe/Women/Athletic/Black Sports Bra.png'), isSample: true },
    { id: 'sample_f_a2', name: 'Grey High Waist Leggings', category: 'Bottom', fit: 'Tight', colour: 'Grey', formality: 'Athletic', warmth: 'Transitional', length: 'Long', image: require('../assets/sampleWardrobe/Women/Athletic/Grey High Waist Leggings.png'), isSample: true },
    { id: 'sample_f_a3', name: 'White Running Trainers', category: 'Shoes', fit: 'Regular', colour: 'White', formality: 'Athletic', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Athletic/white running Trainers.png'), isSample: true },

    // ── ACCESSORY (6 items) ──
    {
        id: 'f_acc_01',
        name: 'Canvas Tote',
        category: 'Accessory',
        accessoryType: 'Bag / Backpack',
        colour: 'Beige',
        formality: 'Everyday',
        warmth: 'Transitional',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Brown Canvas Tote.png'),
        isSample: true,
    },
    {
        id: 'f_acc_02',
        name: 'Gold Necklace',
        category: 'Accessory',
        accessoryType: 'Watch / Jewellery',
        colour: 'White', // Gold acts as white/neutral in our engine usually
        formality: 'Smart',
        warmth: 'Transitional',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Gold Necklace.png'),
        isSample: true,
    },
    {
        id: 'f_acc_03',
        name: 'Thin Gold-Buckle Belt',
        category: 'Accessory',
        accessoryType: 'Belt',
        colour: 'Black',
        formality: 'Smart',
        warmth: 'Transitional',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Brown Belt.png'),
        isSample: true,
    },
    {
        id: 'f_acc_04',
        name: 'Cream Beanie',
        category: 'Accessory',
        accessoryType: 'Hat / Cap',
        colour: 'Cream',
        formality: 'Casual',
        warmth: 'Cold',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Cream Beanie.png'),
        isSample: true,
    },
    {
        id: 'f_acc_05',
        name: 'Leather Crossbody',
        category: 'Accessory',
        accessoryType: 'Bag / Backpack',
        colour: 'Brown',
        formality: 'Everyday',
        warmth: 'Transitional',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Brown Leather Crossbody bag.png'),
        isSample: true,
    },
    {
        id: 'f_acc_06',
        name: 'Tortoiseshell Sunglasses',
        category: 'Accessory',
        accessoryType: 'Sunglasses',
        colour: 'Brown',
        formality: 'Everyday',
        warmth: 'Warm',
        fit: null,
        length: null,
        image: require('../assets/sampleWardrobe/Women/accessories/Polarised Sunglasses.png'),
        isSample: true,
    },
    { id: 'sample_f_b7', name: 'Black High Waist Skinny Jeans', category: 'Bottom', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Bottoms/Black High waist Skinny Jeans.png'), isSample: true },
    { id: 'sample_f_b11', name: 'Navy Pleated Trousers', category: 'Bottom', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Bottoms/Navy Pleated Trousers.png'), isSample: true },
    { id: 'sample_f_s6', name: 'Black Loafers', category: 'Shoes', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Black Loafers.png'), isSample: true },
    { id: 'sample_f_b8', name: 'Blue Baggy Jeans', category: 'Bottom', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Bottoms/Blue baggy jeans.png'), isSample: true },
    { id: 'sample_f_t10', name: 'Crochet Beach Top', category: 'Top', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Crotchet Beach Top.png'), isSample: true },
    { id: 'sample_f_b9', name: 'Brown Faux Leather Trousers', category: 'Bottom', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Bottoms/Brown Faux Leather trousers.png'), isSample: true },
    { id: 'sample_f_s7', name: 'Knee High Boots', category: 'Shoes', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Knee High Boots.png'), isSample: true },
    { id: 'sample_f_t12', name: 'Olive Oversized Sweatshirt', category: 'Top', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Olive Oversized Sweatshirt.png'), isSample: true },
    { id: 'sample_f_t9', name: 'Cream Puff Sleeve Blouse', category: 'Top', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Cream Puff Sleeve Blouse.png'), isSample: true },
    { id: 'sample_f_s9', name: 'Black Pointed Mules', category: 'Shoes', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/black pointed mules.png'), isSample: true },
    { id: 'sample_f_s8', name: 'Multicolored Sneakers', category: 'Shoes', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Multicolored Sneakers.png'), isSample: true },
    { id: 'sample_f_o7', name: 'Navy Oversized Denim Jacket', category: 'Outerwear', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Outerwear/Navy oversized Denim Jacket.png'), isSample: true },
    { id: 'sample_f_s5', name: 'Beige Platform Espadrilles', category: 'Shoes', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Shoes/Beige Platform Espadrilles.png'), isSample: true },
    { id: 'sample_f_t13', name: 'Red Ribbed Long Sleeve Top', category: 'Top', fit: 'Regular', colour: 'Unknown', formality: 'Everyday', warmth: 'Transitional', length: 'Regular', image: require('../assets/sampleWardrobe/Women/Tops/Red Ribed Long Sleeve Top.png'), isSample: true },
];

export default SAMPLE_WARDROBE_FEMALE;
