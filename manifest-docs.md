# Chrome Extension Manifest File Documentation

This document explains the structure and purpose of each field in the `manifest.json` file for the Chrome extension project.

---

## 1. `manifest_version`

- **Purpose:** Specifies the version of the manifest file format being used.
- **Value:** `3`
- **Details:** Chrome currently supports manifest version 3 as the latest standard for extension development.

---

## 2. `name`

- **Purpose:** The display name of your extension as seen by users in the Chrome Extensions page and Chrome Web Store.
- **Value:** `"Huy Bui - Basic Extension"`

---

## 3. `version`

- **Purpose:** The version number of your extension.
- **Value:** `"0.0.1"`
- **Details:** Follows semantic versioning (`major.minor.patch`). Increment this value when you release updates.

---

## 4. `description`

- **Purpose:** A short description of your extension's functionality.
- **Value:** `"A basic example extension for Chrome"`

---

## 5. `icons`

- **Purpose:** Specifies icons for your extension in various sizes.
- **Structure:**
  ```json
  "icons": {
    "48": "assets/icons-48.png",
    "128": "assets/icons-128.png"
  }
  ```
- **Details:** 
  - The keys are icon sizes in pixels.
  - The values are paths to the icon image files relative to the manifest file.
  - These icons are used in the Chrome Extensions page, Chrome Web Store, and browser toolbar.

---

## 6. `action`

- **Purpose:** Defines the default behavior and UI for the extension's toolbar button.
- **Structure:**
  ```json
  "action": {
    "default_popup": "index.html"
  }
  ```
- **Details:** 
  - `default_popup` specifies the HTML file to show when the extension icon is clicked.

---

## 7. `permissions`

- **Purpose:** Declares the permissions your extension needs.
- **Value:** `["scripting"]`
- **Details:** 
  - `"scripting"` allows the extension to inject scripts into web pages.

---

## 8. `host_permissions`

- **Purpose:** Specifies which sites your extension can interact with.
- **Value:** `["http://*/*", "https://*/*"]`
- **Details:** 
  - Grants access to all HTTP and HTTPS sites.
  - Required for script injection and other interactions with web pages.

---

## Example: Full `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Huy Bui - Basic Extension",
  "version": "0.0.1",
  "description": "A basic example extension for Chrome",
  "icons": {
    "48": "assets/icons-48.png",
    "128": "assets/icons-128.png"
  },
  "action": {
    "default_popup": "index.html"
  },
  "permissions": ["scripting"],
  "host_permissions": ["http://*/*", "https://*/*"]
}
```

---

## Additional Notes

- **File Location:** The `manifest.json` file must be in the root of your extension directory.
- **Editing:** Update fields as your extension evolves (e.g., version, permissions, icons).
- **Validation:** Use the Chrome Extensions page (`chrome://extensions/`) to load and test your manifest.

---
For more information, please refer to this: [Chrome's Manifest file format](https://developer.chrome.com/docs/extensions/reference/manifest)