import { generateOutfits } from './outfitEngine.js';
import maleWardrobe from './data/sampleWardrobeMale.js';

// Base profile for testing
const baseProfile = {
    preferBaggyFit: false,
    preferLayering: false,
    styleProfile: {
        colourPalette: 'neutral',
        fitCombination: 'matched',
        proportionPreference: 'balanced',
        formalityZone: 'casual',
    }
};

console.log("\n======================================================");
console.log("ADAPTATION AND LEARNING LOOP SIMULATION");
console.log("======================================================");

console.log("\n--- DAY 1 ---");
console.log("Parameters: Male Wardrobe, 15°C, Casual");

// Run Day 1
const day1Result = generateOutfits(maleWardrobe, 15, 3, 'Casual', baseProfile, []);

const chosenOutfit = day1Result.outfits[0];
console.log(`\nAlgorithm generated recommendations.`);
console.log(`User selects Option 1:`);
console.log(`  Top    : ${chosenOutfit.top.name} [ID: ${chosenOutfit.top.id}]`);
console.log(`  Bottom : ${chosenOutfit.bottom.name} [ID: ${chosenOutfit.bottom.id}]`);
console.log(`  Shoes  : ${chosenOutfit.shoes.name} [ID: ${chosenOutfit.shoes.id}]`);
console.log(`  Base Score: ${chosenOutfit.score.toFixed(2)}`);

// Apply User Feedback
console.log("\n--- END OF DAY 1 USER FEEDBACK ---");
console.log(`User thumbs-up Top: +1.5 to [${chosenOutfit.top.name}]`);
console.log(`User thumbs-down Shoes: -2.0 to [${chosenOutfit.shoes.name}]`);
console.log(`Recency Penalty Logged: [${chosenOutfit.top.id}_${chosenOutfit.bottom.id}]`);

// Deep copy wardrobe to apply adjustments safely
const updatedWardrobe = JSON.parse(JSON.stringify(maleWardrobe));

// Apply score adjustments
updatedWardrobe.forEach(item => {
    if (item.id === chosenOutfit.top.id) {
        item.scoreAdjustment = 1.5;
    }
    if (item.id === chosenOutfit.shoes.id) {
        item.scoreAdjustment = -2.0;
    }
});

const recentGenerations = [`${chosenOutfit.top.id}_${chosenOutfit.bottom.id}`];

console.log("\n--- DAY 2 ---");
console.log("Algorithm runs again with new ML weights and penalties...");

const day2Result = generateOutfits(updatedWardrobe, 15, 3, 'Casual', baseProfile, recentGenerations);

day2Result.outfits.forEach((o, i) => {
    console.log(`\n[Rank ${i + 1}] Score: ${o.score.toFixed(2)}`);
    console.log(`  Top    : ${o.top.name}`);
    console.log(`  Bottom : ${o.bottom.name}`);
    if (o.outerwear) {
        console.log(`  Outer: ${o.outerwear.name}`);
    }
    console.log(`  Shoes  : ${o.shoes.name}`);
    
    // Explain the ranking shift
    if (o.top.id === chosenOutfit.top.id && o.bottom.id === chosenOutfit.bottom.id) {
        console.log(`  -> (Contains Day 1 Combo: hit by -1.0 recency penalty)`);
    } else if (o.top.id === chosenOutfit.top.id) {
        console.log(`  -> (Contains highly rated Top from Day 1: +1.5 bonus)`);
    }
    if (o.shoes.id === chosenOutfit.shoes.id) {
        console.log(`  -> (Contains poorly rated Shoes from Day 1: -2.0 penalty)`);
    }
});
console.log("\n======================================================\n");
