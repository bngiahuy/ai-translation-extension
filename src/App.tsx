import { useState, Fragment } from 'react';
import './App.css';
import { GoogleGenAI } from '@google/genai';

function App() {
	const [inputText, setInputText] = useState('');
	const [outputText, setOutputText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [translationDirection, setTranslationDirection] = useState<
		'vi-to-en' | 'en-to-vi'
	>('vi-to-en');
	const [error, setError] = useState('');

	// Function to detect if text is Vietnamese
	const detectVietnamese = (text: string): boolean => {
		const vietnamesePattern =
			/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
		return vietnamesePattern.test(text);
	};

	// Function to automatically detect language and set translation direction
	const autoDetectLanguage = (text: string) => {
		const isVi = detectVietnamese(text);
		setTranslationDirection(isVi ? 'vi-to-en' : 'en-to-vi');
	};

	// Function to call Gemini API
	const callGeminiAPI = async () => {
		if (!inputText.trim()) {
			setError('Please enter text to translate');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const googleAIClient = new GoogleGenAI({
				apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
			});

			const modelParameters = {
				responseMimeType: 'text/plain',
				seed: 123,
				temperature: 0.7,
				topP: 0.95,
				topK: 64,
			};

			const model = import.meta.env.VITE_GOOGLE_MODEL || 'gemini-2.0-flash';

			// Create prompt based on translation direction
			const prompt =
				translationDirection === 'vi-to-en'
					? `You are an expert AI translator. Your task is to translate the provided Vietnamese text into natural, accurate, and contextually appropriate English. Maintain the original meaning, tone, and stylistic nuances. Respond with the English translation **only**.\n\nInput: ${inputText}.\n\nOutput:`
					: `You are an expert AI translator. Your task is to translate the provided English text into natural, accurate, and contextually appropriate Vietnamese. Maintain the original meaning, tone, and stylistic nuances. Respond with the Vietnamese translation **only**.\n\nInput: ${inputText}.\n\nOutput:`;

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

			const response = await googleAIClient.models.generateContent({
				model,
				config: modelParameters,
				contents,
			});

			if (!response || !response.text) {
				throw new Error('No response received from Gemini API');
			}
			console.log('Gemini API response:', response.text.trim());
			setOutputText(response.text.trim());
		} catch (error) {
			console.error('Error calling Gemini API:', error);
			setError('Translation failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Function to copy text to clipboard
	const copyToClipboard = () => {
		if (outputText) {
			navigator.clipboard
				.writeText(outputText)
				.then(() => {
					// Show temporary success message
					const outputSection = document.querySelector('.output-section');
					const copySuccess = document.createElement('div');
					copySuccess.className = 'copy-success';
					copySuccess.textContent = 'Copied!';
					outputSection?.appendChild(copySuccess);

					// Remove message after 2 seconds
					setTimeout(() => {
						copySuccess.remove();
					}, 2000);
				})
				.catch((err) => {
					console.error('Failed to copy text: ', err);
				});
		}
	};

	// Function to preserve newlines in the displayed text
	const formatOutputText = (text: string) => {
		return text.split('\n').map((line, index) => (
			<Fragment key={index}>
				{line}
				{index < text.split('\n').length - 1 && <br />}
			</Fragment>
		));
	};

	return (
		<div className="translator-container">
			<h1>VN-EN Translator</h1>

			<div className="translation-controls">
				<label>
					<input
						type="radio"
						name="direction"
						checked={translationDirection === 'vi-to-en'}
						onChange={() => setTranslationDirection('vi-to-en')}
					/>
					Vietnamese → English
				</label>

				<label>
					<input
						type="radio"
						name="direction"
						checked={translationDirection === 'en-to-vi'}
						onChange={() => setTranslationDirection('en-to-vi')}
					/>
					English → Vietnamese
				</label>

				<button
					onClick={() => autoDetectLanguage(inputText)}
					className="auto-detect-btn"
				>
					Auto Detect
				</button>
			</div>

			<div className="translation-area">
				<div className="input-section">
					<label>Input:</label>
					<textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder={
							translationDirection === 'vi-to-en'
								? 'Enter Vietnamese text...'
								: 'Enter English text...'
						}
						rows={8}
					/>
				</div>

				<button
					onClick={callGeminiAPI}
					disabled={isLoading || !inputText.trim()}
					className="translate-btn"
				>
					{isLoading ? 'Translating...' : 'Translate'}
				</button>

				<div className="output-section">
					<div className="output-header">
						<label>Output:</label>
						<button
							onClick={copyToClipboard}
							disabled={!outputText}
							className="copy-btn"
						>
							📋 Copy
						</button>
					</div>
					<div className="output-text">
						{outputText ? (
							formatOutputText(outputText)
						) : error ? (
							<span className="error-message">{error}</span>
						) : (
							''
						)}
					</div>
				</div>
			</div>

			<div className="info-text">
				<p>Select text on any webpage and look for the translate button</p>
			</div>
		</div>
	);
}

export default App;
