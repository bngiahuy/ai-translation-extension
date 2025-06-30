# VN-EN Translator Chrome Extension

An AI-powered Vietnamese-English translation Chrome extension using Gemini API.

## Features

- Translate text directly on any webpage by highlighting it
- Bidirectional translation between Vietnamese and English
- Clean popup interface for manual text translation
- Automatic language detection
- Powered by Google's Gemini AI model
- Context menu translation: Right-click to translate selected text

## Installation

1. **Clone or Download the Repository**
   ```
   git clone https://github.com/your-username/vn-en-translator.git
   cd vn-en-translator
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Create a .env file with your Gemini API key**
   ```
   VITE_GOOGLE_API_KEY="your-api-key-here"
   VITE_GOOGLE_MODEL="gemini-model-name"
   ```
   - Replace `"your-api-key-here"` with your actual Gemini API key.
   - `VITE_GOOGLE_MODEL` is optional. If not specified, the extension defaults to `gemini-2.0-flash`.

4. **Build the Extension**
   ```
   npm run build
   ```
   This will generate the `dist` folder with the production build. After that, copy these file: 
   - `manifest.json` to `dist/`.
   - `icons-48.png` and `icons-128.png` to `dist/assets/`.

5. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder inside this project

## Usage

### Popup Interface
- Click the extension icon in the Chrome toolbar to open the popup
- Enter text to translate
- Select translation direction or use auto-detect
- View the translation result
- Click the "Copy" button to copy the translation to your clipboard

### Content Script Translation
- Select text on any webpage.
- A translate button will appear near the selected text.
- Click the translate button to view the translation in a popup.
- Use the copy button in the popup to copy the translation.
- Click outside the popup to close it.

### Context Menu Translation
- Highlight any text on a webpage
- Right-click on the selected text
- Choose "Translate Selection" from the context menu
- View the translation in a popup
- Use the copy button in the popup to copy the translation

## Development

To run in development mode with hot reload:
```
npm run dev
```
Then, reload the extension in Chrome after each build.

## Permissions

This extension uses the following permissions:
- `scripting`: To inject scripts into webpages
- `contextMenus`: To add right-click menu options for quick translation
- `storage`: To save user preferences (currently not used)
- `clipboardWrite`: To copy translation results to clipboard
- `host_permissions`: To allow script execution on all sites
