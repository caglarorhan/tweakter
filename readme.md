# Tweakter: Twitter Tweaker Extension

Tweakter is a browser extension designed to enhance your Twitter (X) web experience by providing various tweaks and customizations. This extension allows users to hide ads, remove the "For You" tab, and more, making your Twitter browsing more enjoyable and less cluttered.

## Features/TODOs

- **Hide Ads**: Automatically removes ads from your Twitter feed. ✅
- **Hide "For You" Tab**: Removes the "For You" tab from the Twitter interface.✅
- **Auto Thread**: Auto thread feature from your long texts. 
- **Summarize Any Tab**: Summarize the day (any tab) feature. 
- **Auto Thread**: Writing Bold, Italic, Underlined. 

## Installation

### From Source (GitHub Repo)

1. Clone the repository:
    ```sh
    git clone https://github.com/caglarorhan/tweakter.git
    ```

2. Open your browser and navigate to the extensions page:
    - **Chrome**: `chrome://extensions/`
    - **Firefox**: `about:addons`

3. Enable "Developer mode" (Chrome) or "Debug mode" (Firefox).

4. Click "Load unpacked" (Chrome) or "Load Temporary Add-on" (Firefox) and select the cloned repository folder.

### From Web Store

- **Chrome Web Store**: [Link to Chrome Web Store](#) /not ready
- **Firefox Add-ons**: [Link to Firefox Add-ons](#) / not ready

## Usage

1. Once installed, click on the Tweakter icon in your browser toolbar.
2. Use the popup interface to enable or disable various tweaks.
3. The changes will be applied immediately to your Twitter (X) web page.

## Project Structure

tweakter/ 
├── css/ 

│ 

└── index.css 

├── js/ 

│ 

├── content.js 

│ 

├── index.js 

│ 

└── background.js 

├── images/ 

│ 

├── icon16.png 

│ 

├── icon48.png 

│ 

└── icon128.png 

├── manifest.json 

├── popup.html 

└── README.md


## Code Overview

### manifest.json

The manifest file defines the extension's permissions, background scripts, content scripts, and other metadata.

### content.js

This script contains the logic for applying tweaks to the Twitter (X) web page.

### index.js

This script handles the communication between the popup interface and the content script.

### background.js

This script runs in the background and manages the extension's lifecycle events.

### popup.html

The HTML file for the extension's popup interface.

### index.css

The CSS file for styling the popup interface.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue or contact us at [caglaror@gmail.com](mailto:caglaror@gmail.com).

---

Thank you for using Tweakter! We hope it enhances your Twitter (X) experience.