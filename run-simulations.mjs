import { generateOutfits } from './outfitEngine.js';
import femaleWardrobe from './data/sampleWardrobeFemale.js';
import maleWardrobe from './data/sampleWardrobeMale.js';

function runSimulation(name, wardrobe, temp, count, activity, profilePreferences) {
    console.log(`\n======================================================`);
    console.log(`SIMULATION: ${name}`);
    console.log(`======================================================`);
    console.log(`Preferences: ${JSON.stringify(profilePreferences.styleProfile)}`);
    
    const result = generateOutfits(wardrobe, temp, count, activity, profilePreferences, []);
    
    if (result.error) {
        console.log(`Error: ${result.error}`);
        return;
    }
    
    result.outfits.forEach((o, i) => {
        console.log(`\n[Rank ${i + 1}] Score: ${o.score.toFixed(2)}`);
        if (o.fullBody) {
            console.log(`  Full Body : ${o.fullBody.name} (${o.fullBody.colour}, ${o.fullBody.fit})`);
        } else {
            console.log(`  Top       : ${o.top.name} (${o.top.colour}, ${o.top.fit})`);
            console.log(`  Bottom    : ${o.bottom.name} (${o.bottom.colour}, ${o.bottom.fit})`);
        }
        if (o.outerwear) {
            console.log(`  Outerwear : ${o.outerwear.name} (${o.outerwear.colour}, ${o.outerwear.fit})`);
        }
        console.log(`  Shoes     : ${o.shoes.name} (${o.shoes.colour})`);
    });
}

// Profile A: Oversized Streetwear (Male)
const profileA = {
    preferBaggyFit: true,
    preferLayering: true,
    styleProfile: {
        colourPalette: 'monochromatic',
        fitCombination: 'oversized-slim',
        proportionPreference: 'cropped-long',
        formalityZone: 'casual',
    }
};

// Profile B: Smart Casual Earth Tones (Female)
const profileB = {
    preferFittedLook: true,
    preferLayering: false,
    styleProfile: {
        colourPalette: 'earth-tones',
        fitCombination: 'matched',
        proportionPreference: 'balanced',
        formalityZone: 'smart',
    }
};

// Profile C: Bold & Colourful Summer (Female)
const profileC = {
    preferColourful: true,
    styleProfile: {
        colourPalette: 'bold-colourful',
        fitCombination: 'no-preference',
        proportionPreference: 'no-preference',
        formalityZone: 'casual',
    }
};

runSimulation('Male - Oversized Streetwear (Monochrome)', maleWardrobe, 15, 3, 'Casual', profileA);
runSimulation('Female - Smart Earth Tones', femaleWardrobe, 18, 3, 'Night Out / Date', profileB);
runSimulation('Female - Bold & Colourful Summer', femaleWardrobe, 25, 3, 'Casual', profileC);
