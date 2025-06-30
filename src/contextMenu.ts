// Context menu setup for the translation extension
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'translate-selection',
		title: 'Translate Selection',
		contexts: ['selection'],
	});
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (
		info.menuItemId === 'translate-selection' &&
		info.selectionText &&
		tab &&
		tab.id
	) {
		// Detect language
		const isVietnamese = detectVietnamese(info.selectionText);

		// Send message to the content script to translate
		chrome.tabs.sendMessage(tab.id, {
			action: 'translate-context-menu',
			text: info.selectionText,
			sourceLanguage: isVietnamese ? 'vi' : 'en',
			targetLanguage: isVietnamese ? 'en' : 'vi',
		});
	}
});

// Basic Vietnamese language detection
function detectVietnamese(text: string): boolean {
	const vietnamesePattern =
		/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
	return vietnamesePattern.test(text);
}
