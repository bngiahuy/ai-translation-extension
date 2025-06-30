// Background script for handling translation requests
import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI client
const initGoogleAI = () => {
	try {
		return new GoogleGenAI({
			apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
		});
	} catch (error) {
		console.error('Error initializing Google GenAI:', error);
		return null;
	}
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.action === 'translate') {
		translateText(message.text, message.sourceLanguage, message.targetLanguage)
			.then((translation) => {
				sendResponse({ translation });
			})
			.catch((error) => {
				console.error('Translation error:', error);
				sendResponse({ error: 'Translation failed' });
			});
		return true; // Required to use sendResponse asynchronously
	}
});

// Function to translate text using Gemini API
async function translateText(
	text: string,
	sourceLanguage: string,
	targetLanguage: string
): Promise<string> {
	const googleAi = initGoogleAI();
	if (!googleAi) {
		throw new Error('Failed to initialize Google GenAI');
	}

	const config = {
		responseMimeType: 'text/plain',
	};

	const model = import.meta.env.VITE_GOOGLE_MODEL || 'gemini-2.0-flash';

	// Determine the prompt based on source and target languages
	let prompt = '';
	if (sourceLanguage === 'vi' && targetLanguage === 'en') {
		prompt = `You are an advanced AI specialized in accurate and fluent text translation from Vietnamese to English. Translate the following Vietnamese text to English. Respond with the translation result only, preserving meaning, tone, and stylistic nuances of the source.\n\nInput: ${text}.\n\nOutput:`;
	} else {
		prompt = `You are an advanced AI specialized in accurate and fluent text translation from English to Vietnamese. Translate the following English text to Vietnamese. Respond with the translation result only, preserving meaning, tone, and stylistic nuances of the source.\n\nInput: ${text}.\n\nOutput:`;
	}

	const contents = [
		{
			role: 'user',
			parts: [
				{
					text: prompt,
				},
			],
		},
	];

	try {
		const response = await googleAi.models.generateContent({
			model,
			config,
			contents,
		});

		if (!response || !response.text) {
			throw new Error('No response received from Gemini API');
		}

		return response.text.trim();
	} catch (error) {
		console.error('Error calling Gemini API:', error);
		throw error;
	}
}
