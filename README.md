# Huy Bui - Basic Chrome Extension

A simple Chrome extension example built with Vite + React.

## Installation

1. **Clone or Download the Repository**
   ```
   git clone https://github.com/your-username/demo-chrome-extension.git
   cd demo-chrome-extension
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Build the Extension**
   ```
   npm run build
   ```
   This will generate the `dist` folder with the production build.

4. **Add Chrome manifest and icons**
  - Move `manifest.json` into `dist` folder (edit this file as you wish)
  - Move 2 icons `.png` into `dist/assets` folder

6. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder inside this project

## Usage

- Click the extension icon in the Chrome toolbar to open the popup.
- Use the color picker and button to change the background color of the current tab.

## Development

To run in development mode with hot reload:
```
npm run dev
```
Then, reload the extension in Chrome after each build.

## Permissions

This extension uses the following permissions:
- `scripting`: To inject scripts into the current tab.
- `host_permissions`: To allow script execution on all sites.
