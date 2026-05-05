import * as FileSystem from 'expo-file-system/legacy';
import { PHOTOROOM_API_KEY } from '../config/keys';

const PHOTOROOM_URL = 'https://sdk.photoroom.com/v1/segment';

export async function removeBackground(imageUri) {
    if (!imageUri) return null;

    try {
        // 1. Read the image as base64
        let base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        if (base64Image.includes('base64,')) {
            base64Image = base64Image.split('base64,')[1];
        }

        // 2. Prepare the JSON request
        const payload = {
            image_file_b64: base64Image
        };

        // 3. Send the request
        const response = await fetch(PHOTOROOM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'image/png',
                'x-api-key': PHOTOROOM_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Photoroom API returned status ${response.status}: ${errorText}`);
            return { error: `API Error ${response.status}: ${errorText}` };
        }

        // 4. Receive binary blob
        const blob = await response.blob();
        
        // 5. Convert blob to base64 with FileReader
        const base64DataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        // The result is formatted as: data:image/png;base64,......
        const base64Content = base64DataUrl.split(',')[1];

        // 6. Save the transparent PNG back to a new generic URI in the cache directory
        const filename = `transparent_${Date.now()}.png`;
        const newUri = `${FileSystem.cacheDirectory}${filename}`;
        
        await FileSystem.writeAsStringAsync(newUri, base64Content, {
            encoding: 'base64'
        });

        return newUri;
    } catch (error) {
        console.error('Photoroom Background Removal Error:', error);
        return { error: error.message || 'Unknown network error occurred.' };
    }
}
