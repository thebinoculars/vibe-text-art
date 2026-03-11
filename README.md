[![Netlify Status](https://api.netlify.com/api/v1/badges/5d5d86f4-478c-4d69-b186-2f2406121d71/deploy-status)](https://app.netlify.com/projects/text-art/deploys)

# Text Art

Transform your images into stunning text-based art. Text Art converts any image into typography art by replacing pixels with characters, creating unique visual effects.

Inspired by [lyricsposter.net](https://lyricsposter.net/).

## ✨ Features

- **Image to Text Conversion**: Upload any image and convert it to text-based art
- **Customizable Typography**: Choose from 14 system fonts and adjust size/spacing
- **High Resolution Output**: Generate up to 4000x4000px images
- **Real-time Preview**: See changes instantly with zoom/pan support
- **Image Adjustments**: Control brightness and contrast
- **Aspect Ratio Lock**: Maintain original image proportions
- **One-Click Download**: Export as PNG with a single click
- **Advanced Settings**: Collapsible panel for fine-tuning

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Yarn

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Build for production
npm run build
# or
yarn build
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Canvas API** - Image processing
- **System Fonts Only** - No external font dependencies

## 📖 How to Use

1. **Upload Image**: Drag and drop or click to upload an image
2. **Enter Text**: Paste your text content in the textarea
3. **Adjust Settings**: 
   - Set output dimensions (width/height) - default 4000x4000px
   - Toggle "Maintain Aspect Ratio" to preserve image proportions
   - Open "Advanced Settings" for more options:
     - Choose from 14 system fonts
     - Adjust font size and line height
     - Pick background color
     - Control brightness/contrast
4. **Generate**: Click "Generate" to create your art
5. **Download**: Save your creation as PNG

## 🎯 Default Settings

- **Canvas Size**: 4000x4000px (max frame, actual output fits image aspect ratio)
- **Font**: Arial
- **Font Size**: 26px
- **Line Height**: 28px
- **Background Color**: #0a0a0a (dark)
- **Brightness**: 100%
- **Contrast**: 100%

## 📝 Tips for Best Results

- Use high-contrast images for better text visibility
- Shorter text creates denser patterns
- Font size 24-30px works best for 4000px canvas
- Experiment with different fonts for unique styles
- Monospace fonts (Courier New, Monaco) create uniform grids
- The canvas automatically fits your image - no cropping!

## 🎨 Available Fonts

All fonts are system fonts (no downloads required):
- **Sans-serif**: Arial, Helvetica, Verdana, Tahoma, Trebuchet MS
- **Serif**: Times New Roman, Georgia, Garamond
- **Monospace**: Courier New, Courier, Lucida Console, Monaco
- **Display**: Impact, Comic Sans MS

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ using React + TypeScript + Canvas API
