# PixelRearrange

A visually stunning web application that rearranges pixels from a source image to match a target image, creating a mesmerizing animation of particles moving into place.

![Demo](target.jpg)

## What It Does

PixelRearrange takes two images:
- **Source Image**: The image you upload (can be any photo)
- **Target Image**: A preset image (`target.jpg`) that defines the final arrangement

The application extracts pixels from both images, intelligently maps them based on color and edge characteristics, and animates the transformation. The result is a smooth, particle-based morphing effect where the source image's pixels rearrange themselves to form the target image.

## How It Works

### 1. **Image Loading & Processing** (`js/imageUtils.js`)
- Loads and resizes images to a consistent resolution (800px default)
- Converts images to canvas-compatible format for pixel manipulation
- Maintains aspect ratios while ensuring optimal performance

### 2. **Intelligent Pixel Mapping** (`js/pixelProcessor.js`)
The core algorithm uses a **two-pass edge-prioritization strategy**:

```
Source Pixels ──────┐
                    ├──► Edge Detection
Target Pixels ──────┘

         ↓
    
Split into:
├─ Edges (top 25% by gradient strength)
└─ Body (remaining 75%)

         ↓

Sort by brightness:
├─ Edge pixels matched (source → target)
└─ Body pixels matched (source → target)

         ↓

Combined mapping with preserved detail
```

**Key Features:**
- **Edge Detection**: Calculates gradient strength to identify important details (faces, outlines, etc.)
- **Brightness Sorting**: Matches pixels with similar luminance values
- **Detail Preservation**: Prioritizes target image edges to maintain sharpness in the final result

### 3. **Smooth Animation** (`js/renderer.js`)
- Uses `ImageData` API for high-performance pixel rendering
- Cubic easing function for natural motion
- 60 FPS animation loop via `requestAnimationFrame`
- Direct pixel buffer manipulation for smooth animations even with high-resolution images

### 4. **Orchestration** (`js/main.js`)
- Manages application state and user interactions
- Coordinates the pipeline: Load → Process → Animate
- Handles UI updates and user feedback

## How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Python 3 installed (for local server)

### Quick Start

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd image-to-image
   ```

2. **Start a local web server**
   
   On Windows:
   ```bash
   start.bat
   ```
   
   Or manually:
   ```bash
   python -m http.server 8000
   ```

3. **Open in your browser**
   ```
   http://localhost:8000
   ```

4. **Use the application**
   - Click **"Upload Image"** to select your source image
   - Click **"Start Magic"** to watch the transformation
   - The pixels will animate from your source image into the target image configuration

### Changing the Target Image

Replace `target.jpg` with any image you want to use as the target. The application will automatically use it on the next run.

## Project Structure

```
image-to-image/
├── index.html              # Main UI (White Minimalist theme)
├── target.jpg              # Default target image
├── start.bat               # Quick-start script for Windows
├── js/
│   ├── main.js             # Application orchestrator
│   ├── imageUtils.js       # Image loading & resizing
│   ├── pixelProcessor.js   # Pixel mapping algorithm
│   └── renderer.js         # Animation & rendering engine
└── README.md               # This file
```

## Technical Highlights

- **Pure JavaScript**: No frameworks, just vanilla JS and Web APIs
- **ES6 Modules**: Clean, modular code architecture
- **Performance Optimized**: Direct pixel buffer manipulation for smooth 60 FPS
- **Edge Prioritization**: Intelligent algorithm preserves facial features and important details
- **Responsive UI**: Modern glassmorphism design with animated oil-spill accents

## Browser Compatibility

Works on all modern browsers supporting:
- Canvas API
- ES6 Modules
- CSS Backdrop Filter
- RequestAnimationFrame

## License

MIT License - Feel free to use and modify!

## Credits

Built with attention to detail, performance, and visual aesthetics.
