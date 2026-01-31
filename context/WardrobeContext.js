import React, { createContext, useState } from 'react';

export const WardrobeContext = createContext();

const initialWardrobe = [
    { id: '1', name: 'Black Jumper', category: 'Top', fit: 'Oversized' },
    { id: '2', name: 'White T-Shirt', category: 'Top', fit: 'Regular' },
    { id: '3', name: 'Blue Jeans', category: 'Bottom', fit: 'Regular' },
    { id: '4', name: 'Grey Trousers', category: 'Bottom', fit: 'Loose' },
    { id: '5', name: 'White Trainers', category: 'Shoes', fit: 'Regular' },
];

export function WardrobeProvider({ children }) {
    const [wardrobeItems, setWardrobeItems] = useState(initialWardrobe);
    const [currentOutfit, setCurrentOutfit] = useState(null);

    const addItem = (item) => {
        setWardrobeItems((prev) => [
            ...prev,
            { ...item, id: Date.now().toString() },
        ]);
    };

    const generateOutfit = () => {
        const tops = wardrobeItems.filter(item => item.category === 'Top');
        const bottoms = wardrobeItems.filter(item => item.category === 'Bottom');
        const shoes = wardrobeItems.filter(item => item.category === 'Shoes');

        if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
            alert("Not enough items to generate an outfit! You need at least 1 Top, 1 Bottom, and 1 Shoe.");
            return;
        }

        const randomTop = tops[Math.floor(Math.random() * tops.length)];
        const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
        const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];

        setCurrentOutfit({
            top: randomTop,
            bottom: randomBottom,
            shoes: randomShoes,
            generatedAt: new Date(),
        });
    };

    return (
        <WardrobeContext.Provider value={{ wardrobeItems, addItem, currentOutfit, generateOutfit }}>
            {children}
        </WardrobeContext.Provider>
    );
}