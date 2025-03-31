# Word Translator Add-in

A Microsoft Word add-in that provides intelligent text translation using Google's Gemini API. This add-in allows you to translate selected text in Word documents with customizable translation settings and creativity levels.

## Features

- 🔄 Real-time text selection from Word documents
- 🌍 Support for multiple languages:
  - Chinese (zh)
  - English (en)
  - French (fr)
  - German (de)
  - Italian (it)
  - Japanese (ja)
  - Korean (ko)
  - Portuguese (pt)
  - Russian (ru)
  - Spanish (es)
- 🎚️ Adjustable creativity level for translations
- ⚡ Powered by Google's Gemini API
- 🎨 Modern and intuitive user interface
- 🔒 Secure API key management

## Tech Stack

- **Frontend Framework**: Vue.js 3
- **TypeScript**: For type-safe development
- **API**: Google Gemini API
- **Office Add-in Framework**: Office.js
- **Build Tools**: Vite
- **Styling**: CSS3 with scoped styles

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Microsoft Word (desktop version)
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone [https://github.com/nttrung2406/word-translator.git](https://github.com/nttrung2406/translation_tool.git)
cd word-translator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## Development

1. Start the development server:
```bash
npm run serve
# or
wordgpt.bat
```

2. The add-in will be available at `http://localhost:3020`

## Adding to Microsoft Word

1. Open Microsoft Word
2. Go to the "Insert" tab
3. Click on "My Add-ins"
4. Select "Get My Add-ins"
5. Click on "Upload My Add-in"
6. Browse to the `manifest.xml` file in your project
7. Click "Upload"

The add-in will now appear in your Word task pane.

## Usage

1. Select text in your Word document
2. The selected text will automatically appear in the input field
3. Choose your target language from the dropdown
4. Adjust the creativity level using the slider:
   - Lower values (0.0-0.3): More literal translations
   - Medium values (0.4-0.6): Balanced translations
   - Higher values (0.7-1.0): More creative translations
5. Click "Translate"
6. The translated text will appear in the output field

## Project Structure

```
word-translator/
├── src/
│   ├── api/
│   │   ├── gemini.ts         # Gemini API integration
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # Utility functions
│   ├── components/
│   │   └── Translator.vue    # Main translation component
│   └── App.vue              # Root component
├── manifest.xml             # Office Add-in manifest
├── package.json            # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── .env                   # Environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for providing the translation capabilities
- Microsoft Office Add-in platform
- Vue.js team for the excellent framework

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
