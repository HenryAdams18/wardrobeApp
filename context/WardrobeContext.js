import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateOutfits, getAlternatives, getAccessoryAlternatives } from '../outfitEngine';
import SAMPLE_WARDROBE_MALE from '../data/sampleWardrobeMale';
import SAMPLE_WARDROBE_FEMALE from '../data/sampleWardrobeFemale';
import { MISSING_IMAGES } from '../data/missingImagesMap';

export const WardrobeContext = createContext();

const WARDROBE_KEY = '@wardrobe_items';
const SAVED_OUTFITS_KEY = '@saved_outfits';
const ONBOARDING_KEY = '@onboarding_complete';
const USER_GENDER_KEY = '@user_gender';
const PREFERENCES_KEY = '@user_preferences';
const RECENT_GENERATIONS_KEY = '@recent_generations';

export const defaultPreferences = {
    preferColourful: false,
    preferMonochrome: false,
    preferBaggyFit: false,
    preferFittedLook: false,
    preferDresses: false,
    preferLayering: false,
    rainReminder: false,
    preferCasualStyle: false,
    preferSmartStyle: false,
};

export function WardrobeProvider({ children }) {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [generatedOutfits, setGeneratedOutfits] = useState([]);
    const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
    const [selectedActivity, setSelectedActivityState] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(null); // null = loading
    const [userGender, setUserGenderState] = useState(null);
    const [preferences, setPreferences] = useState(defaultPreferences);
    const [recentGenerations, setRecentGenerations] = useState([]);

    // Load data on startup
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedItems = await AsyncStorage.getItem(WARDROBE_KEY);
            const storedOutfits = await AsyncStorage.getItem(SAVED_OUTFITS_KEY);
            const storedOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
            const storedGender = await AsyncStorage.getItem(USER_GENDER_KEY);
            const storedPreferences = await AsyncStorage.getItem(PREFERENCES_KEY);
            const storedRecent = await AsyncStorage.getItem(RECENT_GENERATIONS_KEY);

            const allSamples = [...SAMPLE_WARDROBE_MALE, ...SAMPLE_WARDROBE_FEMALE];

            const restoreImage = (item) => {
                if (item && item.isSample) {
                    const sampleMatch = allSamples.find(s => s.id === item.id);
                    if (sampleMatch) return { ...item, image: sampleMatch.image };
                    
                    // Fallback to our generated missing images map if it's not in the base sample files
                    if (item.name) {
                        const normalizedName = item.name.toLowerCase().replace('.png', '').replace('.jpeg', '').replace('.jpg', '');
                        if (MISSING_IMAGES[normalizedName]) {
                            return { ...item, image: MISSING_IMAGES[normalizedName] };
                        }
                    }
                }
                return item;
            };

            if (storedItems) {
                let parsedItems = JSON.parse(storedItems).map(restoreImage);
                
                // Automatically add any newly introduced sample accessories that are missing
                const sampleAccessories = allSamples.filter(s => s.category === 'Accessory');
                const missingAccessories = sampleAccessories.filter(sa => !parsedItems.some(pi => pi.id === sa.id));
                
                if (missingAccessories.length > 0) {
                    parsedItems = [...parsedItems, ...missingAccessories];
                    AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(parsedItems)).catch(console.error);
                }

                setWardrobeItems(parsedItems);
            } else {
                // If it's a completely fresh start without anything stored
                setWardrobeItems([]);
            }
            if (storedOutfits) {
                const parsedOutfits = JSON.parse(storedOutfits).map(outfit => {
                    const restoredOutfit = { ...outfit };
                    if (restoredOutfit.top) restoredOutfit.top = restoreImage(restoredOutfit.top);
                    if (restoredOutfit.bottom) restoredOutfit.bottom = restoreImage(restoredOutfit.bottom);
                    if (restoredOutfit.shoes) restoredOutfit.shoes = restoreImage(restoredOutfit.shoes);
                    if (restoredOutfit.outerwear) restoredOutfit.outerwear = restoreImage(restoredOutfit.outerwear);
                    if (restoredOutfit.fullBody) restoredOutfit.fullBody = restoreImage(restoredOutfit.fullBody);
                    if (restoredOutfit.accessories && Array.isArray(restoredOutfit.accessories)) {
                        restoredOutfit.accessories = restoredOutfit.accessories.map(restoreImage);
                    }
                    return restoredOutfit;
                });
                setSavedOutfits(parsedOutfits);
            }
            if (storedGender) setUserGenderState(storedGender);
            if (storedPreferences) setPreferences(JSON.parse(storedPreferences));
            if (storedRecent) setRecentGenerations(JSON.parse(storedRecent));
            setIsOnboardingComplete(storedOnboarding === 'true');
        } catch (e) {
            console.error("Failed to load data", e);
            setIsOnboardingComplete(false);
        }
    };

    const saveWardrobeItems = async (items) => {
        try {
            await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error("Failed to save wardrobe items", e);
        }
    };

    const saveSavedOutfits = async (outfits) => {
        try {
            await AsyncStorage.setItem(SAVED_OUTFITS_KEY, JSON.stringify(outfits));
        } catch (e) {
            console.error("Failed to save outfits", e);
        }
    };

    const updatePreference = async (key, value) => {
        try {
            const updatedPreferences = {
                ...preferences,
                [key]: value
            };

            // Mutual exclusivity handlers
            if (key === 'preferColourful' && value) updatedPreferences.preferMonochrome = false;
            if (key === 'preferMonochrome' && value) updatedPreferences.preferColourful = false;

            setPreferences(updatedPreferences);
            await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
        } catch (e) {
            console.error("Failed to save preference", e);
        }
    };

    // ─── Onboarding & User State ────────────────────────────

    const setUserGender = async (gender) => {
        try {
            await AsyncStorage.setItem(USER_GENDER_KEY, gender);
            setUserGenderState(gender);
        } catch (e) {
            console.error("Failed to save gender", e);
        }
    };

    const setOnboardingComplete = async (value, gender = null) => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, value.toString());
            if (gender) {
                await AsyncStorage.setItem(USER_GENDER_KEY, gender);
                setUserGenderState(gender);
            }
            setIsOnboardingComplete(value);
        } catch (e) {
            console.error("Failed to save onboarding state", e);
        }
    };

    // ─── Wardrobe CRUD ──────────────────────────────────────

    const addItem = async (item) => {
        const newItem = {
            ...item,
            id: item.id || Date.now().toString(), // keep existing ID for sample items
        };

        setWardrobeItems((prev) => {
            const updatedItems = [...prev, newItem];
            saveWardrobeItems(updatedItems);
            return updatedItems;
        });
    };

    const addMultipleItems = async (items) => {
        const newItems = items.map((item, index) => ({
            ...item,
            id: item.id || (Date.now() + index).toString(),
        }));

        setWardrobeItems((prev) => {
            const updatedItems = [...prev, ...newItems];
            saveWardrobeItems(updatedItems);
            return updatedItems;
        });
    };

    const deleteItem = (id) => {
        setWardrobeItems((prev) => {
            const newItems = prev.filter(item => item.id !== id);
            saveWardrobeItems(newItems);
            return newItems;
        });
    };

    const updateItem = (id, updatedFields) => {
        setWardrobeItems((prev) => {
            const newItems = prev.map(item => item.id === id ? { ...item, ...updatedFields } : item);
            saveWardrobeItems(newItems);
            return newItems;
        });
    };

    const adjustItemScore = async (itemIds, adjustmentValue) => {
        setWardrobeItems((prev) => {
            const updatedItems = prev.map(item => {
                if (itemIds.includes(item.id)) {
                    const currentAdjustment = item.scoreAdjustment || 0;
                    return {
                        ...item,
                        scoreAdjustment: currentAdjustment + adjustmentValue,
                    };
                }
                return item;
            });
            saveWardrobeItems(updatedItems);
            return updatedItems;
        });
    };

    const saveOutfit = (outfit) => {
        setSavedOutfits((prev) => {
            const newOutfits = [...prev, { ...outfit, id: Date.now().toString() }];
            saveSavedOutfits(newOutfits);
            return newOutfits;
        });
    };

    const deleteOutfit = (id) => {
        setSavedOutfits((prev) => {
            const newOutfits = prev.filter(o => o.id !== id);
            saveSavedOutfits(newOutfits);
            return newOutfits;
        });
    };

    // ─── Prototype 3: Rule-based generation ─────────────────

    const updateWeather = (weatherData) => {
        setWeather(weatherData);
    };

    const _addRecentGeneration = async (outfits) => {
        if (!outfits || outfits.length === 0) return;

        // Take the top rated option
        const primaryOutfit = outfits[0];
        const signature = primaryOutfit.fullBody
            ? primaryOutfit.fullBody.id
            : `${primaryOutfit.top.id}_${primaryOutfit.bottom.id}`;

        setRecentGenerations((prev) => {
            // Keep the last 5 unique signatures
            const filtered = prev.filter(sig => sig !== signature);
            const newRecent = [signature, ...filtered].slice(0, 5);
            AsyncStorage.setItem(RECENT_GENERATIONS_KEY, JSON.stringify(newRecent)).catch(console.error);
            return newRecent;
        });
    };

    const generateOutfitOptions = (activity) => {
        const temperature = weather?.temperature ?? null;
        setSelectedActivityState(activity); // Save for swapping later
        const { outfits, error } = generateOutfits(wardrobeItems, temperature, 3, activity, preferences, recentGenerations);

        if (error) {
            return error;
        }

        setGeneratedOutfits(outfits);
        setActiveOutfitIndex(0);
        _addRecentGeneration(outfits);
        return null;
    };

    const swapItem = (slot) => {
        if (generatedOutfits.length === 0) return;

        const currentOutfit = generatedOutfits[activeOutfitIndex];
        const currentItem = currentOutfit[slot];
        const category = slot === 'top' ? 'Top' :
            slot === 'bottom' ? 'Bottom' :
                slot === 'shoes' ? 'Shoes' :
                    slot === 'fullBody' ? 'Full Body' : 'Outerwear';
        const temperature = weather?.temperature ?? null;

        const alternatives = getAlternatives(wardrobeItems, category, currentItem.id, temperature, selectedActivity);

        if (alternatives.length === 0) return;

        const swapKey = `_swapIndex_${slot}`;
        const currentSwapIndex = currentOutfit[swapKey] || 0;
        const nextIndex = (currentSwapIndex) % alternatives.length;
        const newItem = alternatives[nextIndex];

        const updatedOutfit = {
            ...currentOutfit,
            [slot]: newItem,
            [swapKey]: nextIndex + 1,
            generatedAt: currentOutfit.generatedAt,
        };

        const updatedOutfits = [...generatedOutfits];
        updatedOutfits[activeOutfitIndex] = updatedOutfit;
        setGeneratedOutfits(updatedOutfits);
    };

    const swapAccessory = (index) => {
        if (generatedOutfits.length === 0) return;
        const currentOutfit = generatedOutfits[activeOutfitIndex];
        const currentAccessory = currentOutfit.accessories[index];
        const temperature = weather?.temperature ?? null;

        const alternatives = getAccessoryAlternatives(wardrobeItems, currentOutfit, currentAccessory, temperature);
        if (alternatives.length === 0) return;

        const swapKey = `_swapIndex_acc_${index}`;
        const currentSwapIndex = currentOutfit[swapKey] || 0;
        const nextIndex = (currentSwapIndex) % alternatives.length;
        const newItem = alternatives[nextIndex];

        const newAccessories = [...currentOutfit.accessories];
        newAccessories[index] = newItem;

        const updatedOutfit = {
            ...currentOutfit,
            accessories: newAccessories,
            [swapKey]: nextIndex + 1,
        };

        const updatedOutfits = [...generatedOutfits];
        updatedOutfits[activeOutfitIndex] = updatedOutfit;
        setGeneratedOutfits(updatedOutfits);
    };

    const removeAccessory = (index) => {
        if (generatedOutfits.length === 0) return;
        const currentOutfit = generatedOutfits[activeOutfitIndex];
        const newAccessories = [...(currentOutfit.accessories || [])];
        newAccessories.splice(index, 1);
        
        const updatedOutfit = { ...currentOutfit, accessories: newAccessories };
        const updatedOutfits = [...generatedOutfits];
        updatedOutfits[activeOutfitIndex] = updatedOutfit;
        setGeneratedOutfits(updatedOutfits);
    };

    const currentOutfit = generatedOutfits.length > 0
        ? generatedOutfits[activeOutfitIndex]
        : null;

    // Don't render children until we know if onboarding is done
    if (isOnboardingComplete === null) {
        return null; // or a splash/loading screen
    }

    return (
        <WardrobeContext.Provider value={{
            wardrobeItems,
            addItem,
            addMultipleItems,
            updateItem,
            deleteItem,
            adjustItemScore,
            // Onboarding & User Context
            isOnboardingComplete,
            setOnboardingComplete,
            userGender,
            setUserGender,
            preferences,
            updatePreference,
            // Outfit generation
            generatedOutfits,
            activeOutfitIndex,
            setActiveOutfitIndex,
            currentOutfit,
            generateOutfitOptions,
            swapItem,
            swapAccessory,
            removeAccessory,
            // Saved outfits
            savedOutfits,
            saveOutfit,
            deleteOutfit,
            // Weather
            weather,
            updateWeather,
        }}>
            {children}
        </WardrobeContext.Provider>
    );
}