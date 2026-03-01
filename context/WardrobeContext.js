import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateOutfits, getAlternatives } from '../outfitEngine';

export const WardrobeContext = createContext();

const WARDROBE_KEY = '@wardrobe_items';
const SAVED_OUTFITS_KEY = '@saved_outfits';
const ONBOARDING_KEY = '@onboarding_complete';
const USER_GENDER_KEY = '@user_gender';

export function WardrobeProvider({ children }) {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [generatedOutfits, setGeneratedOutfits] = useState([]);
    const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
    const [selectedActivity, setSelectedActivityState] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(null); // null = loading
    const [userGender, setUserGenderState] = useState(null);

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

            if (storedItems) setWardrobeItems(JSON.parse(storedItems));
            if (storedOutfits) setSavedOutfits(JSON.parse(storedOutfits));
            if (storedGender) setUserGenderState(storedGender);
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

    const generateOutfitOptions = (activity) => {
        const temperature = weather?.temperature ?? null;
        setSelectedActivityState(activity); // Save for swapping later
        const { outfits, error } = generateOutfits(wardrobeItems, temperature, 3, activity);

        if (error) {
            return error;
        }

        setGeneratedOutfits(outfits);
        setActiveOutfitIndex(0);
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
            deleteItem,
            // Onboarding & User Context
            isOnboardingComplete,
            setOnboardingComplete,
            userGender,
            setUserGender,
            // Outfit generation
            generatedOutfits,
            activeOutfitIndex,
            setActiveOutfitIndex,
            currentOutfit,
            generateOutfitOptions,
            swapItem,
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