import { loadImage, getResizedImageData } from './imageUtils.js';
import { createPixelList, sortPixelList, generatePixelMapping } from './pixelProcessor.js';
import { ParticleRenderer } from './renderer.js';

// Configuration
// MAX_WIDTH and MAX_HEIGHT are now determined dynamically


// State
let targetImage = null;
let sourceImage = null;
let renderer = null;

// UI Elements
const fileInput = document.getElementById('fileInput');
const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('statusText');
const canvas = document.getElementById('mainCanvas');

async function init() {
    try {
        statusText.textContent = "Loading target image...";
        targetImage = await loadImage('./target.jpg');
        statusText.textContent = "Target image loaded. Please upload a source image.";
        
        renderer = new ParticleRenderer(canvas);
        
        // Enable controls
        fileInput.addEventListener('change', handleFileUpload);
        startBtn.addEventListener('click', startRearrangement);
        
    } catch (err) {
        console.error(err);
        statusText.textContent = "Error loading target image. Check console.";
    }
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        statusText.textContent = "Loading source image...";
        const url = URL.createObjectURL(file);
        sourceImage = await loadImage(url);
        statusText.textContent = "Source image loaded. Ready to rearrange.";
        startBtn.disabled = false;
    } catch (err) {
        console.error(err);
        statusText.textContent = "Error loading source image.";
    }
}

function startRearrangement() {
    if (!sourceImage || !targetImage) return;

    statusText.textContent = "Processing pixels...";
    startBtn.disabled = true;

    // Use setTimeout to allow UI to update before heavy processing
    setTimeout(() => {
        try {
            // Default to High Resolution
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;

            // 1. Resize and get data for both images
            // We use the same dimensions for both to ensure 1:1 pixel mapping works best
            // or at least they are comparable.
            const targetData = getResizedImageData(targetImage, MAX_WIDTH, MAX_HEIGHT);
            const sourceData = getResizedImageData(sourceImage, MAX_WIDTH, MAX_HEIGHT);

            // 2. Create pixel lists
            const targetPixels = createPixelList(targetData);
            const sourcePixels = createPixelList(sourceData);

            // 3. Sort pixels by brightness
            // Moved inside generatePixelMapping for Edge Prioritization logic
            // sortPixelList(targetPixels);
            // sortPixelList(sourcePixels);

            // 4. Generate mapping
            const particles = generatePixelMapping(sourcePixels, targetPixels);

            // 5. Initialize Renderer
            // Canvas size should match the processed data size
            renderer.setParticles(particles, targetData.width, targetData.height);

            // 6. Start Animation
            statusText.textContent = "Animating...";
            renderer.start(() => {
                statusText.textContent = "Done!";
                startBtn.disabled = false;
            });

        } catch (err) {
            console.error(err);
            statusText.textContent = "Error during processing.";
            startBtn.disabled = false;
        }
    }, 100);
}

// Start the app
init();
