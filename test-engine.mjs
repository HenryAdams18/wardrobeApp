import { generateOutfits } from './outfitEngine.js';
import sampleWardrobe from './data/sampleWardrobeFemale.js';

const noFullBodyWardrobe = sampleWardrobe.filter(i => i.category !== 'Full Body');

console.log("--- DEFAULT PREFERENCES ---");
let result = generateOutfits(noFullBodyWardrobe, 20, 3, 'Uni / Work', {});
if (result.error) console.log("Error:", result.error);
result.outfits.forEach(o => console.log(`Score: ${o.score.toFixed(2)} | Top: ${o.top?.name || o.fullBody?.name} (${o.top?.fit || '-'}) | Bottom: ${o.bottom?.name || '-'} (${o.bottom?.fit || '-'})`));

// Extract the top combination signature to pass as 'recent'
const topOutfit = result.outfits[0];
const recentSignature = `${topOutfit.top.id}_${topOutfit.bottom.id}`;

console.log("\n--- WITH RECENCY PENALTY ACTIVE ---");
console.log(`Penalizing signature: ${recentSignature}`);
let resultWithPenalty = generateOutfits(noFullBodyWardrobe, 20, 3, 'Uni / Work', {}, [recentSignature]);
if (resultWithPenalty.error) console.log("Error:", resultWithPenalty.error);
resultWithPenalty.outfits.forEach(o => console.log(`Score: ${o.score.toFixed(2)} | Top: ${o.top?.name || o.fullBody?.name} (${o.top?.fit || '-'}) | Bottom: ${o.bottom?.name || '-'} (${o.bottom?.fit || '-'})`));
