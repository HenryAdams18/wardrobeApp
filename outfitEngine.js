// =============================================================================
// Rule-Based Outfit Generation Engine — Multi-Factor Scoring (Prototype 3+)
// =============================================================================
// Scores outfits across four weighted dimensions:
//   - Colour harmony  (30%)
//   - Formality match  (25%)
//   - Fit balance      (25%)
//   - Length proportion (20%)
//
// Supports four outfit slots: Top, Bottom, Shoes, and optional Outerwear.
// Outerwear is conditionally included based on live weather temperature.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. COLOUR HARMONY
// ---------------------------------------------------------------------------
// Colours are classified into groups for harmony scoring.
// Based on colour theory: neutrals pair with everything, monochromatic and
// analogous combos score well, complementary pairings are acceptable,
// and exceeding 3 non-neutral colours is penalised (the "three-colour rule").
// References: Ma et al. (2023); Shamoi, Inoue & Kawanaka (2020)

const NEUTRAL_COLOURS = ['Black', 'White', 'Grey', 'Navy', 'Beige', 'Cream'];

// Colour wheel positions for harmony calculation (simplified 12-segment wheel)
const COLOUR_WHEEL = {
    'Red': 0,
    'Orange': 1,
    'Yellow': 2,
    'Green': 4,
    'Blue': 7,
    'Purple': 10,
    'Pink': 11,
    'Brown': 1,    // Brown sits near orange on the warm spectrum
    'Burgundy': 0, // Near red
    'Olive': 3,    // Between yellow and green
    'Teal': 6,     // Between green and blue
    'Maroon': 0,   // Near red
};

function isNeutral(colour) {
    if (!colour) return true; // No colour tagged = treat as neutral (safe default)
    return NEUTRAL_COLOURS.includes(colour);
}

function getWheelPosition(colour) {
    return COLOUR_WHEEL[colour] ?? null;
}

// Calculate the shortest distance between two positions on a 12-segment wheel
function wheelDistance(pos1, pos2) {
    const diff = Math.abs(pos1 - pos2);
    return Math.min(diff, 12 - diff);
}

/**
 * Score the colour harmony of an outfit's items.
 * Returns a value between 0 and 10.
 */
function scoreColourHarmony(items, preferences = {}) {
    const colours = items.map(item => item.colour).filter(Boolean);

    // If no colours tagged, return a neutral score (don't penalise legacy items)
    if (colours.length === 0) return 5;

    const nonNeutrals = colours.filter(c => !isNeutral(c));
    const uniqueNonNeutrals = [...new Set(nonNeutrals)];

    // Bonus: all-neutral outfit is always safe
    if (uniqueNonNeutrals.length === 0) {
        return preferences.preferMonochrome ? 10 : 8;
    }

    let score = 6; // Base score

    // Three-colour rule: penalise more than 3 distinct non-neutral colours
    if (uniqueNonNeutrals.length > 3) {
        if (preferences.preferColourful) {
            score += 2; // Bonus for vibrant looks
        } else {
            score -= (uniqueNonNeutrals.length - 3) * 2;
        }
    } else if (preferences.preferMonochrome && uniqueNonNeutrals.length > 1) {
        score -= (uniqueNonNeutrals.length - 1) * 2; // Penalise multi-coloured looks
    }

    // Check harmony between non-neutral colour pairs
    if (uniqueNonNeutrals.length >= 2) {
        const positions = uniqueNonNeutrals.map(c => getWheelPosition(c)).filter(p => p !== null);

        if (positions.length >= 2) {
            let totalHarmony = 0;
            let pairCount = 0;

            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const dist = wheelDistance(positions[i], positions[j]);
                    pairCount++;

                    if (dist === 0) {
                        totalHarmony += 3; // Monochromatic — excellent
                    } else if (dist <= 2) {
                        totalHarmony += 2; // Analogous — good
                    } else if (dist >= 5 && dist <= 7) {
                        totalHarmony += 1; // Complementary — acceptable
                    } else {
                        totalHarmony -= 1; // Awkward distance — slight penalty
                    }
                }
            }

            score += pairCount > 0 ? (totalHarmony / pairCount) : 0;
        }
    } else {
        // Single non-neutral with neutrals = clean, easy outfit
        score += 2;
    }

    const profile = preferences?.styleProfile;
    if (profile?.colourPalette === 'bold-colourful' && uniqueNonNeutrals.length >= 3) {
        score += 2; // bonus instead of penalty
    } else if (profile?.colourPalette === 'monochromatic' && uniqueNonNeutrals.length <= 1) {
        score += 2;
    } else if (profile?.colourPalette === 'earth-tones') {
        const earthTones = ['Brown', 'Beige', 'Burgundy', 'Olive', 'Cream'];
        const earthCount = colours.filter(c => earthTones.includes(c)).length;
        if (earthCount >= 2) score += 1;
    } else if (profile?.colourPalette === 'neutral' && uniqueNonNeutrals.length === 0) {
        score = 10; // boost all-neutral from 8 to 10
    }

    return Math.max(0, Math.min(10, score));
}

function scoreAccessoryColourMatch(accessory, outfitItems) {
    if (!accessory.colour) return 5; // No colour tagged, neutral score

    const outfitColours = outfitItems.map(item => item.colour).filter(Boolean);
    const accessoryColour = accessory.colour;

    // Neutral accessories always work
    if (isNeutral(accessoryColour)) return 9;

    // Check if accessory colour already exists in outfit (monochromatic match)
    if (outfitColours.includes(accessoryColour)) return 8;

    // Count non-neutral colours in outfit
    const outfitNonNeutrals = [...new Set(outfitColours.filter(c => !isNeutral(c)))];

    // If adding this accessory would exceed 3 non-neutral colours, penalise
    const allNonNeutrals = [...new Set([...outfitNonNeutrals, accessoryColour].filter(c => !isNeutral(c)))];
    if (allNonNeutrals.length > 3) return 2;

    // Check colour wheel harmony with outfit's non-neutral colours
    const accessoryPos = getWheelPosition(accessoryColour);
    if (accessoryPos === null) return 5;

    let harmonyTotal = 0;
    let pairCount = 0;
    for (const outfitColour of outfitNonNeutrals) {
        const outfitPos = getWheelPosition(outfitColour);
        if (outfitPos === null) continue;
        const dist = wheelDistance(accessoryPos, outfitPos);
        pairCount++;
        if (dist === 0) harmonyTotal += 3;      // Same colour family
        else if (dist <= 2) harmonyTotal += 2;   // Analogous
        else if (dist >= 5 && dist <= 7) harmonyTotal += 1; // Complementary
        else harmonyTotal -= 1;                   // Awkward
    }

    if (pairCount === 0) return 7; // No non-neutrals to compare against
    const avgHarmony = harmonyTotal / pairCount;
    return Math.max(0, Math.min(10, 6 + avgHarmony));
}


// ---------------------------------------------------------------------------
// 2. FORMALITY MATCHING
// ---------------------------------------------------------------------------
// Three-level formality scale: Casual (1), Everyday (2), Smart (3).
// Items within the same level or adjacent levels are compatible.
// Non-adjacent levels (e.g., Smart top + Casual bottom) are penalised.
// References: Ma et al. (2023); Principle of Refinement (Inside Out Style)

const FORMALITY_VALUES = {
    'Casual': 1,
    'Everyday': 2,
    'Smart': 3,
    'Athletic': 99, // Isolated off the main spectrum
};

/**
 * Score formality consistency across outfit items.
 * Returns a value between 0 and 10.
 */
function scoreFormalityMatch(items, preferences = {}) {
    const formalityLevels = items
        .map(item => FORMALITY_VALUES[item.formality])
        .filter(v => v !== undefined);

    // If no formality tagged, return neutral score
    if (formalityLevels.length === 0) return 5;

    const maxLevel = Math.max(...formalityLevels);
    const minLevel = Math.min(...formalityLevels);
    const range = maxLevel - minLevel;

    if (range === 0) {
        return 10;   // Perfect match — all same level
    }

    if (range === 1) {
        if (preferences.preferCasualStyle && ((minLevel === 1 && maxLevel === 2) || (minLevel === 2 && maxLevel === 1))) {
            return 8; // Relaxed penalty for Casual/Everyday mix
        }
        if (preferences.preferSmartStyle && ((minLevel === 2 && maxLevel === 3) || (minLevel === 3 && maxLevel === 2))) {
            return 8; // Relaxed penalty for Smart/Everyday mix
        }
        return 7;    // Adjacent levels — acceptable mix
    }

    if (maxLevel === 99) return 0; // Athletic mixed with non-athletic is hard clash
    return 2;                      // Non-adjacent — strong penalty (e.g., blazer + joggers)
}

/**
 * Pre-filter check: should this combination be eliminated before scoring?
 * Returns true if the formality gap is too wide (non-adjacent levels).
 */
function hasFormalityClash(items) {
    const formalityLevels = items
        .map(item => FORMALITY_VALUES[item.formality])
        .filter(v => v !== undefined);

    if (formalityLevels.length < 2) return false; // Can't clash with one or zero tagged items

    const range = Math.max(...formalityLevels) - Math.min(...formalityLevels);
    return range > 1;
}

function scoreAccessoryFormalityMatch(accessory, outfitItems) {
    const accessoryFormality = FORMALITY_VALUES[accessory.formality];
    if (!accessoryFormality) return 5; // Not tagged

    const outfitFormalityLevels = outfitItems
        .map(item => FORMALITY_VALUES[item.formality])
        .filter(v => v !== undefined);

    if (outfitFormalityLevels.length === 0) return 5;

    // Find the outfit's dominant formality (most common level)
    const avgFormality = Math.round(
        outfitFormalityLevels.reduce((a, b) => a + b, 0) / outfitFormalityLevels.length
    );

    const gap = Math.abs(accessoryFormality - avgFormality);
    if (gap === 0) return 10;  // Perfect match
    if (gap === 1) return 7;   // Adjacent — acceptable
    return 2;                   // Non-adjacent — clash
}


// ---------------------------------------------------------------------------
// 3. FIT BALANCE (retained and refined from Prototype 3)
// ---------------------------------------------------------------------------
// Based on the Principle of Volume: contrasting proportions create balance.
// Oversized + slim scores well; oversized + oversized scores poorly.

const FIT_SCORES = {
    'Tight-Tight': 5,
    'Tight-Regular': 7,
    'Tight-Oversized': 6,
    'Regular-Tight': 7,
    'Regular-Regular': 8,
    'Regular-Oversized': 9,
    'Oversized-Tight': 9,
    'Oversized-Regular': 8,
    'Oversized-Oversized': 3,
};

/**
 * Score the fit balance between top and bottom.
 * Returns a value between 0 and 10.
 */
function scoreFitBalance(top, bottom, preferences = {}) {
    const scores = { ...FIT_SCORES };
    const profile = preferences?.styleProfile;
    
    if (profile?.fitCombination === 'oversized-slim') {
        scores['Oversized-Tight'] = 10;
        scores['Oversized-Regular'] = 10;
        scores['Oversized-Oversized'] = 6;
    } else if (profile?.fitCombination === 'slim-wide') {
        scores['Tight-Oversized'] = 9;
        scores['Regular-Oversized'] = 10;
    } else if (profile?.fitCombination === 'matched') {
        scores['Regular-Regular'] = 10;
        scores['Tight-Tight'] = 7;
    }

    const topFit = top.fit || 'Regular';
    const bottomFit = bottom.fit || 'Regular';
    const key = `${topFit}-${bottomFit}`;

    let baseScore = scores[key] ?? 5;

    if (preferences.preferBaggyFit) {
        if (key === 'Oversized-Oversized') baseScore = Math.max(baseScore, 8);
        if (key === 'Oversized-Regular') baseScore = Math.max(baseScore, 9);
    }

    if (preferences.preferFittedLook) {
        if (key === 'Tight-Tight') baseScore = Math.max(baseScore, 8);
        if (key === 'Tight-Regular') baseScore = Math.max(baseScore, 9);
    }

    return baseScore;
}


// ---------------------------------------------------------------------------
// 4. LENGTH PROPORTION
// ---------------------------------------------------------------------------
// Scoring how top and bottom lengths interact visually.
// Cropped top + full-length bottom is a strong pairing.
// Long top + long bottom can obscure proportions.

const LENGTH_SCORES = {
    'Cropped-Regular': 8,
    'Cropped-Long': 9,
    'Regular-Regular': 7,
    'Regular-Long': 6,
    'Regular-Cropped': 5,  // Regular top with shorts — fine but less defined
    'Long-Cropped': 7,     // Longline top with shorts — intentional look
    'Long-Regular': 5,
    'Long-Long': 3,        // Both long — can look shapeless
    'Cropped-Cropped': 4,  // Both cropped — very exposed, niche
};

/**
 * Score the length proportion between top and bottom.
 * Returns a value between 0 and 10.
 */
function scoreLengthProportion(top, bottom, preferences = {}) {
    const scores = { ...LENGTH_SCORES };
    const profile = preferences?.styleProfile;
    
    if (profile?.proportionPreference === 'cropped-long') {
        scores['Cropped-Long'] = 10;
        scores['Cropped-Regular'] = 9;
    } else if (profile?.proportionPreference === 'long-slim') {
        scores['Long-Regular'] = 8;
        scores['Long-Long'] = 5;
    } else if (profile?.proportionPreference === 'balanced') {
        scores['Regular-Regular'] = 10;
    }

    const topLength = top.length || 'Regular';
    const bottomLength = bottom.length || 'Regular';
    const key = `${topLength}-${bottomLength}`;
    return scores[key] ?? 5;
}


// ---------------------------------------------------------------------------
// 5. WEATHER FILTERING (upgraded from keyword-only to warmth metadata)
// ---------------------------------------------------------------------------
// Items now carry a warmth field: 'Cold' (3), 'Transitional' (2), 'Warm' (1).
// Falls back to keyword analysis if warmth is not set (backwards compatibility).
// References: Liu et al. (2017) Weather-to-Garment; Kwon & Choi (2012)

const COLD_KEYWORDS = ['jumper', 'hoodie', 'sweater', 'coat', 'jacket', 'fleece', 'cardigan', 'puffer', 'parka', 'thermal', 'wool'];
const WARM_KEYWORDS = ['shorts', 'vest', 'tank', 'sandals', 'flip', 'linen', 'crop'];

const WARMTH_VALUES = {
    'Cold': 3,
    'Transitional': 2,
    'Warm': 1,
};

/**
 * Get the warmth level of an item. Uses the warmth metadata field if available,
 * otherwise falls back to keyword analysis of the item name.
 */
function getItemWarmth(item) {
    // Use metadata if available
    if (item.warmth && WARMTH_VALUES[item.warmth]) {
        return item.warmth;
    }

    // Fallback: keyword analysis (backwards compatibility with Prototype 3 items)
    const nameLower = (item.name || '').toLowerCase();
    if (COLD_KEYWORDS.some(kw => nameLower.includes(kw))) return 'Cold';
    if (WARM_KEYWORDS.some(kw => nameLower.includes(kw))) return 'Warm';
    return 'Transitional';
}

/**
 * Filter items by weather appropriateness based on temperature.
 * Always returns at least the original list if filtering would empty a category.
 */
function filterByWeather(items, temperature) {
    if (temperature === null || temperature === undefined) return items;

    let filtered;

    if (temperature < 10) {
        // Cold weather: exclude warm-only items (shorts, vests, sandals)
        filtered = items.filter(item => getItemWarmth(item) !== 'Warm');
    } else if (temperature > 20) {
        // Hot weather: exclude cold-only items (heavy coats, wool jumpers)
        filtered = items.filter(item => getItemWarmth(item) !== 'Cold');
    } else {
        // Transitional: all items are eligible
        return items;
    }

    // Fallback: if filtering removes everything, return the full list
    return filtered.length > 0 ? filtered : items;
}

/**
 * Determine whether outerwear should be included based on temperature.
 * Returns: 'required' | 'optional' | 'excluded'
 */
function getOuterwearMode(temperature) {
    if (temperature === null || temperature === undefined) return 'optional';
    if (temperature < 10) return 'required';
    if (temperature <= 18) return 'optional';
    return 'excluded';
}


// ---------------------------------------------------------------------------
// 6. OUTERWEAR COMPATIBILITY
// ---------------------------------------------------------------------------
// When outerwear is included, it must be compatible with the rest of the outfit
// in terms of fit, formality, and colour.

/**
 * Score how well an outerwear item works with the top and bottom.
 * Returns a value between 0 and 10.
 */
function scoreOuterwearCompatibility(outerwear, top, bottom) {
    if (!outerwear) return 5; // No outerwear = neutral score

    let score = 5;

    // Fit: oversized outerwear over oversized top = too bulky
    const outerFit = outerwear.fit || 'Regular';
    const topFit = top.fit || 'Regular';
    if (outerFit === 'Oversized' && topFit === 'Oversized') {
        score -= 3;
    } else if (outerFit === 'Oversized' && (topFit === 'Tight' || topFit === 'Regular')) {
        score += 2; // Good layering contrast
    } else if (outerFit === 'Regular') {
        score += 1; // Regular outerwear is versatile
    }

    // Formality: outerwear should be within 1 level of the outfit
    const outerFormality = FORMALITY_VALUES[outerwear.formality];
    const topFormality = FORMALITY_VALUES[top.formality];
    if (outerFormality && topFormality) {
        const gap = Math.abs(outerFormality - topFormality);
        if (gap === 0) score += 2;
        else if (gap === 1) score += 1;
        else score -= 2;
    }

    return Math.max(0, Math.min(10, score));
}


// ---------------------------------------------------------------------------
// 7. COMPOSITE SCORING
// ---------------------------------------------------------------------------
// Combines all four scoring dimensions with configurable weights.
// Weights from the literature review: Colour 30%, Formality 25%, Fit 25%, Length 20%

const SCORE_WEIGHTS = {
    colour: 0.30,
    formality: 0.25,
    fit: 0.25,
    length: 0.20,
};

/**
 * Calculate the composite score for a full outfit combination (Top + Bottom).
 */
function scoreOutfit(top, bottom, shoes, outerwear = null, preferences = {}, outerwearMode = 'optional', recentGenerations = []) {
    const allItems = [top, bottom, shoes];
    if (outerwear) allItems.push(outerwear);

    const colourScore = scoreColourHarmony(allItems, preferences);
    const formalityScore = scoreFormalityMatch(allItems, preferences);
    const fitScore = scoreFitBalance(top, bottom, preferences);
    const lengthScore = scoreLengthProportion(top, bottom, preferences);

    let composite = (
        colourScore * SCORE_WEIGHTS.colour +
        formalityScore * SCORE_WEIGHTS.formality +
        fitScore * SCORE_WEIGHTS.fit +
        lengthScore * SCORE_WEIGHTS.length
    );

    if (preferences.preferLayering && outerwear && outerwearMode === 'optional') {
        composite += 1.0;
    }

    if (outerwear) {
        const outerwearScore = scoreOuterwearCompatibility(outerwear, top, bottom);
        composite += (outerwearScore - 5) * 0.3;
    }

    composite += Math.random() * 0.5;
    const imageCount = allItems.filter(item => item?.imageUri).length;
    composite += imageCount * 0.2;

    // Apply accumulated user feedback adjustments
    const totalAdjustment = allItems.reduce((sum, item) => sum + (item?.scoreAdjustment || 0), 0);
    composite += totalAdjustment;

    // Apply recency penalty (-1.0) if this exact top-bottom combo was recently generated
    const signature = `${top.id}_${bottom.id}`;
    if (recentGenerations.includes(signature)) {
        composite -= 1.0;
    }

    return Math.max(0, composite);
}

/**
 * Calculate the composite score for a Full Body outfit combination.
 * Skips fit balance and length proportion for the top/bottom interaction.
 */
function scoreFullBodyOutfit(fullBody, shoes, outerwear = null, preferences = {}, outerwearMode = 'optional', recentGenerations = []) {
    const allItems = [fullBody, shoes];
    if (outerwear) allItems.push(outerwear);

    const colourScore = scoreColourHarmony(allItems, preferences);
    const formalityScore = scoreFormalityMatch(allItems, preferences);

    // Distribute weights over colour and formality only (e.g. Colour 50%, Formality 50%)
    let composite = (
        colourScore * 0.50 +
        formalityScore * 0.50
    );

    if (preferences.preferDresses) {
        composite += 1.5;
    }

    if (preferences.preferLayering && outerwear && outerwearMode === 'optional') {
        composite += 1.0;
    }

    if (outerwear) {
        // Evaluate outerwear fit mostly against the fullBody piece
        const outerwearScore = scoreOuterwearCompatibility(outerwear, fullBody, fullBody);
        composite += (outerwearScore - 5) * 0.3;
    }

    composite += Math.random() * 0.5;
    const imageCount = allItems.filter(item => item?.imageUri).length;
    composite += imageCount * 0.2;

    // Apply accumulated user feedback adjustments
    const totalAdjustment = allItems.reduce((sum, item) => sum + (item?.scoreAdjustment || 0), 0);
    composite += totalAdjustment;

    // Apply recency penalty (-1.0) if this full body item was recently generated
    const signature = fullBody.id;
    if (recentGenerations.includes(signature)) {
        composite -= 1.0;
    }

    return Math.max(0, composite);
}


const ACTIVITY_FORMALITY_MAP = {
    'Casual': ['Casual'],
    'Uni / Work': ['Everyday', 'Casual'],
    'Night Out / Date': ['Smart', 'Everyday'],
    'Formal Event': ['Smart'],
    'Gym / Sport': ['Athletic'],
};

/**
 * Generate ranked outfit options from the user's wardrobe.
 *
 * @param {Array} wardrobeItems - All items in the user's wardrobe
 * @param {number|null} temperature - Current temperature in °C (from weather API)
 * @param {number} count - Number of outfit options to return (default 3)
 * @param {string|null} activity - The selected activity for pre-filtering (optional)
 * @returns {{ outfits: Array, error: string|null }}
 */
export function generateOutfits(wardrobeItems, temperature = null, count = 3, activity = null, preferences = {}, recentGenerations = []) {
    // Activity Pre-filter
    let activeWardrobe = wardrobeItems;
    if (activity && ACTIVITY_FORMALITY_MAP[activity]) {
        const allowedFormalities = ACTIVITY_FORMALITY_MAP[activity];
        activeWardrobe = wardrobeItems.filter(item =>
            !item.formality || allowedFormalities.includes(item.formality)
        );
    }

    // Separate items by category
    const allTops = activeWardrobe.filter(item => item.category === 'Top');
    const allBottoms = activeWardrobe.filter(item => item.category === 'Bottom');
    const allShoes = activeWardrobe.filter(item => item.category === 'Shoes');
    const allOuterwear = activeWardrobe.filter(item => item.category === 'Outerwear');
    const allFullBody = activeWardrobe.filter(item => item.category === 'Full Body');

    // Validate minimum items (allows full body path IF top/bottom are missing)
    if (allShoes.length === 0) {
        return { outfits: [], error: 'You need at least 1 pair of Shoes to generate an outfit.' };
    }
    const hasStandardPath = allTops.length > 0 && allBottoms.length > 0;
    const hasFullBodyPath = allFullBody.length > 0;

    if (!hasStandardPath && !hasFullBodyPath) {
        return {
            outfits: [],
            error: 'You need either a Top and Bottom, or a Full Body item, and Shoes to generate an outfit.'
        };
    }

    // === FILTERING PHASE ===
    // Weather-based filtering
    const tops = filterByWeather(allTops, temperature);
    const bottoms = filterByWeather(allBottoms, temperature);
    const shoes = filterByWeather(allShoes, temperature);
    const outerwear = filterByWeather(allOuterwear, temperature);
    const fullBody = filterByWeather(allFullBody, temperature);

    // Determine outerwear mode
    const outerwearMode = getOuterwearMode(temperature);

    // === COMBINATION GENERATION & SCORING PHASE ===
    const candidates = [];

    if (hasStandardPath) {
        for (const top of tops) {
            for (const bottom of bottoms) {
                for (const shoe of shoes) {
                    // Pre-filter: skip formality clashes between top, bottom, shoes
                    if (hasFormalityClash([top, bottom, shoe])) continue;

                    if (outerwearMode === 'excluded' || outerwear.length === 0) {
                        candidates.push({ top, bottom, shoes: shoe, outerwear: null, fullBody: null, score: scoreOutfit(top, bottom, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                    } else if (outerwearMode === 'required') {
                        for (const outer of outerwear) {
                            if (hasFormalityClash([top, bottom, shoe, outer])) continue;
                            candidates.push({ top, bottom, shoes: shoe, outerwear: outer, fullBody: null, score: scoreOutfit(top, bottom, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        }
                    } else {
                        candidates.push({ top, bottom, shoes: shoe, outerwear: null, fullBody: null, score: scoreOutfit(top, bottom, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        for (const outer of outerwear) {
                            if (hasFormalityClash([top, bottom, shoe, outer])) continue;
                            candidates.push({ top, bottom, shoes: shoe, outerwear: outer, fullBody: null, score: scoreOutfit(top, bottom, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        }
                    }
                }
            }
        }
    }

    if (hasFullBodyPath) {
        for (const fb of fullBody) {
            for (const shoe of shoes) {
                // Pre-filter: skip formality clashes between fullBody, shoes
                if (hasFormalityClash([fb, shoe])) continue;

                if (outerwearMode === 'excluded' || outerwear.length === 0) {
                    candidates.push({ top: null, bottom: null, fullBody: fb, shoes: shoe, outerwear: null, score: scoreFullBodyOutfit(fb, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                } else if (outerwearMode === 'required') {
                    for (const outer of outerwear) {
                        if (hasFormalityClash([fb, shoe, outer])) continue;
                        candidates.push({ top: null, bottom: null, fullBody: fb, shoes: shoe, outerwear: outer, score: scoreFullBodyOutfit(fb, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                    }
                } else {
                    candidates.push({ top: null, bottom: null, fullBody: fb, shoes: shoe, outerwear: null, score: scoreFullBodyOutfit(fb, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                    for (const outer of outerwear) {
                        if (hasFormalityClash([fb, shoe, outer])) continue;
                        candidates.push({ top: null, bottom: null, fullBody: fb, shoes: shoe, outerwear: outer, score: scoreFullBodyOutfit(fb, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                    }
                }
            }
        }
    }

    // If formality filtering removed everything, regenerate without that filter for standard combinations
    if (candidates.length === 0 && hasStandardPath) {
        for (const top of tops) {
            for (const bottom of bottoms) {
                for (const shoe of shoes) {
                    if (outerwearMode === 'excluded' || outerwear.length === 0) {
                        candidates.push({ top, bottom, shoes: shoe, outerwear: null, fullBody: null, score: scoreOutfit(top, bottom, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                    } else if (outerwearMode === 'required') {
                        for (const outer of outerwear) {
                            candidates.push({ top, bottom, shoes: shoe, outerwear: outer, fullBody: null, score: scoreOutfit(top, bottom, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        }
                    } else {
                        candidates.push({ top, bottom, shoes: shoe, outerwear: null, fullBody: null, score: scoreOutfit(top, bottom, shoe, null, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        for (const outer of outerwear) {
                            candidates.push({ top, bottom, shoes: shoe, outerwear: outer, fullBody: null, score: scoreOutfit(top, bottom, shoe, outer, preferences, outerwearMode, recentGenerations), generatedAt: new Date() });
                        }
                    }
                }
            }
        }
    }

    // === SELECTION PHASE ===
    // Sort by score (highest first)
    candidates.sort((a, b) => b.score - a.score);

    // Select top results, avoiding duplicate top+bottom pairings for variety
    const selected = [];
    const usedCombos = new Set();

    for (const candidate of candidates) {
        const comboKey = candidate.fullBody
            ? `${candidate.fullBody.id}-${candidate.shoes.id}`
            : `${candidate.top.id}-${candidate.bottom.id}`;
        if (!usedCombos.has(comboKey)) {
            usedCombos.add(comboKey);
            selected.push(candidate);
        }
        if (selected.length >= count) break;
    }

    // If we couldn't find enough unique top+bottom combos, allow duplicates
    if (selected.length < count) {
        for (const candidate of candidates) {
            if (!selected.includes(candidate)) {
                selected.push(candidate);
            }
            if (selected.length >= count) break;
        }
    }

    for (const outfit of selected) {
        outfit.accessories = selectAccessories(wardrobeItems, outfit, temperature, 2);
    }

    return { outfits: selected, error: null };
}

export function selectAccessories(wardrobeItems, outfit, temperature = null, count = 2) {
    // Get all accessory items
    let accessories = wardrobeItems.filter(item => item.category === 'Accessory');

    if (accessories.length === 0) return [];

    // Weather filter — exclude cold accessories in hot weather and vice versa
    accessories = filterByWeather(accessories, temperature);

    // Get the outfit's clothing items as an array
    const outfitItems = [outfit.top, outfit.bottom, outfit.shoes].filter(Boolean);
    if (outfit.outerwear) outfitItems.push(outfit.outerwear);
    if (outfit.fullBody) outfitItems.push(outfit.fullBody);

    // Score each accessory
    const scored = accessories.map(acc => {
        const colourScore = scoreAccessoryColourMatch(acc, outfitItems);
        const formalityScore = scoreAccessoryFormalityMatch(acc, outfitItems);
        // Weight: 60% colour, 40% formality (colour is more visually impactful for accessories)
        const totalScore = (colourScore * 0.6) + (formalityScore * 0.4);
        return { accessory: acc, score: totalScore };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Select top accessories ensuring category diversity (no two hats, no two bags)
    const selectedAccessories = [];
    const usedTypes = new Set();

    for (const item of scored) {
        const type = item.accessory.accessoryType;
        if (type && usedTypes.has(type)) continue; // Skip duplicate sub-categories
        if (item.score < 4) continue; // Skip poorly matching accessories
        usedTypes.add(type);
        selectedAccessories.push(item);
        if (selectedAccessories.length >= count) break;
    }

    return selectedAccessories.map(s => ({ ...s.accessory, matchScore: s.score }));
}


// ---------------------------------------------------------------------------
// 9. SWAP ALTERNATIVES (main export)
// ---------------------------------------------------------------------------

/**
 * Get alternative items for swapping within a generated outfit.
 * Filters by weather and returns items in the same category.
 *
 * @param {Array} wardrobeItems - All items in the user's wardrobe
 * @param {string} category - Category to filter by (Top, Bottom, Shoes, Outerwear)
 * @param {string} currentItemId - ID of the item currently in the outfit slot
 * @param {string|null} activity - The selected activity for pre-filtering (optional)
 * @returns {Array} Alternative items
 */
export function getAlternatives(wardrobeItems, category, currentItemId, temperature = null, activity = null) {
    let items = wardrobeItems.filter(item => item.category === category && item.id !== currentItemId);

    if (activity && ACTIVITY_FORMALITY_MAP[activity]) {
        const allowedFormalities = ACTIVITY_FORMALITY_MAP[activity];
        items = items.filter(item =>
            !item.formality || allowedFormalities.includes(item.formality)
        );
    }

    items = filterByWeather(items, temperature);
    return items;
}

export function getAccessoryAlternatives(wardrobeItems, currentOutfit, currentAccessory, temperature = null) {
    let accessories = wardrobeItems.filter(item => item.category === 'Accessory' && item.id !== currentAccessory?.id);
    accessories = filterByWeather(accessories, temperature);

    // Filter diversity
    const otherAccessories = (currentOutfit.accessories || []).filter(a => a.id !== currentAccessory?.id);
    const usedTypes = new Set(otherAccessories.map(a => a.accessoryType).filter(Boolean));
    accessories = accessories.filter(a => !usedTypes.has(a.accessoryType));

    const outfitItems = [currentOutfit.top, currentOutfit.bottom, currentOutfit.shoes, currentOutfit.outerwear, currentOutfit.fullBody].filter(Boolean);

    const scored = accessories.map(acc => {
        const colourScore = scoreAccessoryColourMatch(acc, outfitItems);
        const formalityScore = scoreAccessoryFormalityMatch(acc, outfitItems);
        const totalScore = (colourScore * 0.6) + (formalityScore * 0.4);
        return { accessory: acc, score: totalScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.accessory);
}