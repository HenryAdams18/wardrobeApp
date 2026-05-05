export function calculateStyleProfile(responses, outfitData) {
    // We track scores for each dimension value
    // e.g., scores.fitCombination['oversized-slim'] = 2
    const scores = {
        fitCombination: {},
        colourPalette: {},
        proportionPreference: {},
        formalityZone: {},
        layeringTendency: {},
        outfitType: {},
    };

    responses.forEach(response => {
        const outfit = outfitData.find(o => o.id === response.outfitId);
        if (!outfit) return;

        const valueChange = response.score !== undefined ? response.score : (response.liked ? 1 : -1);

        Object.entries(outfit.dimensionSignals).forEach(([dimension, value]) => {
            if (value === 'no-preference') return; // no-preference doesn't accrue score

            if (!scores[dimension]) scores[dimension] = {};
            if (!scores[dimension][value]) scores[dimension][value] = 0;

            scores[dimension][value] += valueChange;
        });
    });

    const profile = {};

    Object.keys(scores).forEach(dimension => {
        const dimensionScores = scores[dimension];
        let bestValue = 'no-preference';
        let highestScore = 0;

        Object.entries(dimensionScores).forEach(([value, score]) => {
            if (score > highestScore) {
                highestScore = score;
                bestValue = value;
            }
        });

        profile[dimension] = bestValue;
    });

    return profile;
}

export function profileToPreferences(profile) {
    return {
        preferBaggyFit: profile.fitCombination === 'oversized-slim',
        preferFittedLook: profile.fitCombination === 'slim-wide',
        preferColourful: profile.colourPalette === 'bold-colourful',
        preferMonochrome: profile.colourPalette === 'monochromatic' || profile.colourPalette === 'neutral',
        preferDresses: profile.outfitType === 'full-body',
        preferLayering: profile.layeringTendency === 'likes-layers',
        preferCasualStyle: profile.formalityZone === 'casual',
        preferSmartStyle: profile.formalityZone === 'smart',
        rainReminder: true,
        // Store the raw profile so we can display it and use it for fine-grained engine modifiers
        styleProfile: profile,
    };
}
