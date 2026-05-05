import * as FileSystem from 'expo-file-system/legacy';
import { OPENAI_API_KEY } from '../config/keys';

const OPENAI_URL = `https://api.openai.com/v1/chat/completions`;

const CLASSIFICATION_PROMPT = `
You are a clothing classification system for a wardrobe app. Analyse this clothing image and return ONLY a JSON object with these fields:

{
  "name": "short descriptive name e.g. 'Black Oversized Hoodie' or 'Brown Leather Belt'",
  "category": one of "Top", "Bottom", "Outerwear", "Full Body", "Shoes", "Accessory",
  "accessoryType": if category is Accessory, one of "Hat / Cap", "Bag / Backpack", "Watch / Jewellery", "Belt", "Scarf", "Sunglasses", otherwise null,
  "colour": one of "Black", "White", "Grey", "Navy", "Beige", "Cream", "Red", "Blue", "Green", "Brown", "Pink", "Yellow", "Orange", "Purple", "Burgundy", "Olive", "Teal", "Maroon",
  "fit": one of "Tight", "Regular", "Oversized" (null if accessory),
  "formality": one of "Casual", "Everyday", "Smart", "Athletic",
  "warmth": one of "Warm", "Transitional", "Cold",
  "length": one of "Cropped", "Regular", "Long" (null if accessory)
}

Rules:
- Pick the CLOSEST match from the allowed values for each field
- For colour, pick the dominant colour of the garment
- Return ONLY the JSON object, no markdown, no explanation
`;

export async function classifyItem(imageUri) {
    if (!imageUri) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        // 1. Read the image as base64
        let base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        // Strip data prefix if React Native FileSystem attached one
        if (base64Image.includes('base64,')) {
            base64Image = base64Image.split('base64,')[1];
        }

        // 2. Guess the MIME type from the file extension
        let mimeType = 'image/jpeg';
        const uriLow = imageUri.toLowerCase();
        if (uriLow.endsWith('.png')) mimeType = 'image/png';
        else if (uriLow.endsWith('.webp')) mimeType = 'image/webp';
        else if (uriLow.endsWith('.heic')) mimeType = 'image/heic';

        // 3. Prepare the request payload
        const payload = {
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: CLASSIFICATION_PROMPT },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                                detail: "low"
                            }
                        }
                    ]
                }
            ]
        };

        // 4. Send the request with retry logic
        let response;
        let retries = 0;
        const MAX_RETRIES = 2;

        while (retries <= MAX_RETRIES) {
            response = await fetch(OPENAI_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            // If overloaded, wait and try again
            if (response.status === 503 && retries < MAX_RETRIES) {
                console.warn(`OpenAI API overloaded (503). Retrying ${retries + 1}/${MAX_RETRIES}...`);
                retries++;
                await new Promise(res => setTimeout(res, 2000 * retries)); // 2s, 4s backoff
                continue;
            }
            break;
        }

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`OpenAI API returned status ${response.status}: ${errorText}`);
            return { error: `OpenAI API Error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenAI API Error Response:", data);
            return null;
        }

        const firstChoice = data.choices[0];
        if (!firstChoice.message || !firstChoice.message.content) {
            console.error("OpenAI API returned no text content:", data);
            return null;
        }

        let textResult = firstChoice.message.content;

        if (!textResult) return null;

        // Strip markdown blocks if the model wrapped it (e.g., ```json ... ```)
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        // 6. Parse and return
        return JSON.parse(textResult);

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn('OpenAI API request timed out after 30s');
            return { error: 'Request timed out. The image might be too large or internet is slow.' };
        } else {
            console.error('OpenAI Classification Error:', error);
            return { error: error.message || 'Unknown network error occurred.' };
        }
    }
}
