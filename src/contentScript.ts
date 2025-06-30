// Content script for translation functionality
let selectedText = '';
let isInsidePopup = false; // Flag to track if selection is inside our popup

// Listen for text selection
document.addEventListener('mouseup', function (e) {
	// Don't show translation button if selecting inside our popup
	if (isInsidePopup) {
		return;
	}

	// Check if clicking inside one of our popups (double-check to be safe)
	const isClickInsidePopup = Boolean(
		document
			.getElementById('vn-en-translate-result')
			?.contains(e.target as Node) ||
			document
				.getElementById('vn-en-translate-loader')
				?.contains(e.target as Node) ||
			document
				.getElementById('vn-en-translate-error')
				?.contains(e.target as Node)
	);

	if (isClickInsidePopup) {
		return;
	}

	const selection = window.getSelection();
	if (selection && selection.toString().trim().length > 0) {
		selectedText = selection.toString().trim();

		// Show the translation option if text is selected
		if (selectedText) {
			showTranslationButton(selection);
		}
	}
});

// Create and show a translation button near the selection
function showTranslationButton(selection: Selection) {
	// If we're inside the popup, don't show the button
	if (isInsidePopup) {
		return;
	}

	// Remove any existing translation UI
	removeExistingUI();

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();

	// Create translation button
	const button = document.createElement('div');
	button.id = 'vn-en-translate-button';
	button.textContent = '🔄 Translate';
	button.style.position = 'absolute';
	button.style.left = `${rect.right}px`;
	button.style.top = `${rect.bottom + window.scrollY}px`;
	button.style.backgroundColor = '#4285f4';
	button.style.color = 'white';
	button.style.padding = '5px 10px';
	button.style.borderRadius = '4px';
	button.style.cursor = 'pointer';
	button.style.fontSize = '14px';
	button.style.zIndex = '10000';
	button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

	// Add click event listener
	button.addEventListener('click', function () {
		translateSelectedText(selectedText);
		button.remove();
	});

	document.body.appendChild(button);

	// Remove the button when clicking elsewhere
	document.addEventListener('mousedown', function handleMouseDown(e) {
		if (e.target !== button) {
			button.remove();
			document.removeEventListener('mousedown', handleMouseDown);
		}
	});
}

// Send selected text to background script for translation
function translateSelectedText(text: string) {
	// Show loading indicator
	showLoadingIndicator();

	// Detect language and determine translation direction
	const isVietnamese = detectVietnamese(text);

	// Create message object with text and detected language
	const message = {
		action: 'translate',
		text: text,
		sourceLanguage: isVietnamese ? 'vi' : 'en',
		targetLanguage: isVietnamese ? 'en' : 'vi',
	};

	// Send message to background script
	chrome.runtime.sendMessage(message, function (response) {
		if (response && response.translation) {
			showTranslationResult(response.translation);
		} else {
			showTranslationError();
		}
	});
}

// Basic Vietnamese language detection (simplified)
function detectVietnamese(text: string): boolean {
	// Vietnamese-specific characters
	const vietnamesePattern =
		/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
	return vietnamesePattern.test(text);
}

// Show loading indicator
function showLoadingIndicator() {
	removeExistingUI();

	const loader = document.createElement('div');
	loader.id = 'vn-en-translate-loader';
	loader.textContent = 'Translating...';
	loader.style.position = 'fixed';
	loader.style.left = '50%';
	loader.style.top = '50%';
	loader.style.transform = 'translate(-50%, -50%)';
	loader.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	loader.style.color = 'white';
	loader.style.padding = '10px 20px';
	loader.style.borderRadius = '4px';
	loader.style.zIndex = '10000';

	document.body.appendChild(loader);
}

// Show translation result
function showTranslationResult(translatedText: string) {
	removeExistingUI();

	const popup = document.createElement('div');
	popup.id = 'vn-en-translate-result';
	popup.style.position = 'fixed';
	popup.style.left = '50%';
	popup.style.top = '50%';
	popup.style.transform = 'translate(-50%, -50%)';
	popup.style.backgroundColor = 'white';
	popup.style.color = 'black';
	popup.style.padding = '15px';
	popup.style.borderRadius = '8px';
	popup.style.zIndex = '10000';
	popup.style.maxWidth = '80%';
	popup.style.maxHeight = '60%';
	popup.style.overflow = 'auto';
	popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

	// Create close button
	const closeButton = document.createElement('div');
	closeButton.textContent = '✕';
	closeButton.style.position = 'absolute';
	closeButton.style.top = '5px';
	closeButton.style.right = '10px';
	closeButton.style.cursor = 'pointer';
	closeButton.style.fontWeight = 'bold';
	closeButton.addEventListener('click', function () {
		popup.remove();
	});

	// Create copy button
	const copyButton = document.createElement('button');
	copyButton.textContent = '📋 Copy';
	copyButton.style.position = 'absolute';
	copyButton.style.top = '5px';
	copyButton.style.right = '30px';
	copyButton.style.backgroundColor = '#34a853';
	copyButton.style.color = 'white';
	copyButton.style.border = 'none';
	copyButton.style.borderRadius = '4px';
	copyButton.style.padding = '4px 8px';
	copyButton.style.fontSize = '12px';
	copyButton.style.cursor = 'pointer';
	copyButton.style.marginRight = '15px';
	copyButton.addEventListener('click', function () {
		// Copy to clipboard
		navigator.clipboard.writeText(translatedText).then(() => {
			// Show feedback
			const originalText = copyButton.textContent;
			copyButton.textContent = 'Copied!';
			setTimeout(() => {
				copyButton.textContent = originalText;
			}, 2000);
		});
	});

	// Create a container for translation text and controls
	const contentContainer = document.createElement('div');
	contentContainer.style.position = 'absolute';
	contentContainer.style.marginTop = '30px';
	contentContainer.style.padding = '5px';
	contentContainer.style.border = '1px solid #e0e0e0';
	contentContainer.style.borderRadius = '4px';
	contentContainer.style.backgroundColor = '#f8f9fa';
	contentContainer.style.maxHeight = '200px';
	contentContainer.style.overflowY = 'auto';

	// Create content
	const content = document.createElement('div');
	content.textContent = translatedText;
	content.style.whiteSpace = 'pre-line';
	content.style.lineHeight = '1.6';
	content.style.padding = '5px';

	// Append elements to content container
	contentContainer.appendChild(content);

	// Append elements to popup
	popup.appendChild(closeButton);
	popup.appendChild(copyButton);
	popup.appendChild(contentContainer);
	document.body.appendChild(popup);

	// Make content selectable explicitly
	content.style.userSelect = 'text';
	// Use non-standard CSS as a string to avoid TypeScript errors
	content.setAttribute(
		'style',
		content.getAttribute('style') +
			'user-select: text; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text;'
	);
	content.style.cursor = 'text';

	// Make sure any click inside popup sets the flag
	popup.addEventListener('mousedown', (e) => {
		isInsidePopup = true;
		e.stopPropagation(); // Prevent the event from reaching the document
	});

	// Handle all mouseup events inside popup
	popup.addEventListener('mouseup', (e) => {
		e.stopPropagation(); // Prevent the event from reaching the document's mouseup handler
	});

	// Make sure the flag stays true while interacting with content
	content.addEventListener('mousedown', (e) => {
		isInsidePopup = true;
		e.stopPropagation();
	});

	content.addEventListener('mouseup', (e) => {
		e.stopPropagation();
	});

	// Handle selection events specifically
	content.addEventListener('selectstart', (e) => {
		isInsidePopup = true;
		e.stopPropagation();
	});

	// Close only when clicking outside
	document.addEventListener('mousedown', function handleClick(e: MouseEvent) {
		if (popup && e.target instanceof Node && !popup.contains(e.target)) {
			popup.remove();
			// Reset flag when closing the popup
			setTimeout(() => {
				isInsidePopup = false;
			}, 10);
			document.removeEventListener('mousedown', handleClick);
		}
	});
}

// Show translation error
function showTranslationError() {
	removeExistingUI();

	const errorPopup = document.createElement('div');
	errorPopup.id = 'vn-en-translate-error';
	errorPopup.textContent = 'Translation failed. Please try again.';
	errorPopup.style.position = 'fixed';
	errorPopup.style.left = '50%';
	errorPopup.style.top = '50%';
	errorPopup.style.transform = 'translate(-50%, -50%)';
	errorPopup.style.backgroundColor = '#f44336';
	errorPopup.style.color = 'white';
	errorPopup.style.padding = '10px 20px';
	errorPopup.style.borderRadius = '4px';
	errorPopup.style.zIndex = '10000';

	document.body.appendChild(errorPopup);

	// Auto-remove after 3 seconds
	setTimeout(() => {
		errorPopup.remove();
	}, 3000);
}

// Remove any existing UI elements
function removeExistingUI() {
	const elements = [
		document.getElementById('vn-en-translate-button'),
		document.getElementById('vn-en-translate-loader'),
		document.getElementById('vn-en-translate-result'),
		document.getElementById('vn-en-translate-error'),
	];

	elements.forEach((el) => {
		if (el) el.remove();
	});

	// Reset the flag after a small delay to prevent race conditions
	setTimeout(() => {
		isInsidePopup = false;
	}, 10);
}

// Listen for messages from the background script or context menu
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
	if (message.action === 'translate-context-menu' && message.text) {
		// Show loading indicator
		showLoadingIndicator();

		// Create message object with text and detected language
		const translationMessage = {
			action: 'translate',
			text: message.text,
			sourceLanguage: message.sourceLanguage,
			targetLanguage: message.targetLanguage,
		};

		// Send message to background script
		chrome.runtime.sendMessage(translationMessage, function (response) {
			if (response && response.translation) {
				showTranslationResult(response.translation);
			} else {
				showTranslationError();
			}
		});
	}
});
