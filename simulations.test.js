import { generateOutfits } from './outfitEngine.js';
import femaleWardrobe from './data/sampleWardrobeFemale.js';
import maleWardrobe from './data/sampleWardrobeMale.js';

describe('Outfit Engine - Style Profile Simulations', () => {
    
    // Profile A: Oversized Streetwear (Male)
    test('Simulate Profile A: Oversized Streetwear (Male)', () => {
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

        const result = generateOutfits(maleWardrobe, 15, 3, 'Casual', profileA, []);
        expect(result.error).toBeNull();
        
        console.log(`\n======================================================`);
        console.log(`SIMULATION A: Male - Oversized Streetwear (Monochrome)`);
        console.log(`======================================================`);
        
        result.outfits.forEach((o, i) => {
            console.log(`\n[Rank ${i + 1}] Score: ${o.score.toFixed(2)}`);
            if (o.fullBody) console.log(`  Full Body : ${o.fullBody.name} (${o.fullBody.colour}, ${o.fullBody.fit})`);
            else {
                console.log(`  Top       : ${o.top.name} (${o.top.colour}, ${o.top.fit})`);
                console.log(`  Bottom    : ${o.bottom.name} (${o.bottom.colour}, ${o.bottom.fit})`);
            }
            if (o.outerwear) console.log(`  Outerwear : ${o.outerwear.name} (${o.outerwear.colour}, ${o.outerwear.fit})`);
            console.log(`  Shoes     : ${o.shoes.name} (${o.shoes.colour})`);
        });
    });

    // Profile B: Smart Casual Earth Tones (Female)
    test('Simulate Profile B: Smart Earth Tones (Female)', () => {
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

        const result = generateOutfits(femaleWardrobe, 18, 3, 'Night Out / Date', profileB, []);
        expect(result.error).toBeNull();
        
        console.log(`\n======================================================`);
        console.log(`SIMULATION B: Female - Smart Earth Tones`);
        console.log(`======================================================`);
        
        result.outfits.forEach((o, i) => {
            console.log(`\n[Rank ${i + 1}] Score: ${o.score.toFixed(2)}`);
            if (o.fullBody) console.log(`  Full Body : ${o.fullBody.name} (${o.fullBody.colour}, ${o.fullBody.fit})`);
            else {
                console.log(`  Top       : ${o.top.name} (${o.top.colour}, ${o.top.fit})`);
                console.log(`  Bottom    : ${o.bottom.name} (${o.bottom.colour}, ${o.bottom.fit})`);
            }
            if (o.outerwear) console.log(`  Outerwear : ${o.outerwear.name} (${o.outerwear.colour}, ${o.outerwear.fit})`);
            console.log(`  Shoes     : ${o.shoes.name} (${o.shoes.colour})`);
        });
    });

    // Profile C: Bold & Colourful Summer (Female)
    test('Simulate Profile C: Bold & Colourful Summer (Female)', () => {
        const profileC = {
            preferColourful: true,
            styleProfile: {
                colourPalette: 'bold-colourful',
                fitCombination: 'no-preference',
                proportionPreference: 'no-preference',
                formalityZone: 'casual',
            }
        };

        const result = generateOutfits(femaleWardrobe, 25, 3, 'Casual', profileC, []);
        expect(result.error).toBeNull();
        
        console.log(`\n======================================================`);
        console.log(`SIMULATION C: Female - Bold & Colourful Summer`);
        console.log(`======================================================`);
        
        result.outfits.forEach((o, i) => {
            console.log(`\n[Rank ${i + 1}] Score: ${o.score.toFixed(2)}`);
            if (o.fullBody) console.log(`  Full Body : ${o.fullBody.name} (${o.fullBody.colour}, ${o.fullBody.fit})`);
            else {
                console.log(`  Top       : ${o.top.name} (${o.top.colour}, ${o.top.fit})`);
                console.log(`  Bottom    : ${o.bottom.name} (${o.bottom.colour}, ${o.bottom.fit})`);
            }
            if (o.outerwear) console.log(`  Outerwear : ${o.outerwear.name} (${o.outerwear.colour}, ${o.outerwear.fit})`);
            console.log(`  Shoes     : ${o.shoes.name} (${o.shoes.colour})`);
        });
    });

});
