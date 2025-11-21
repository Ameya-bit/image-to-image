/**
 * Converts ImageData into an array of pixel objects.
 * @param {ImageData} imageData - The image data to process.
 * @returns {Array<Object>} Array of pixel objects {r, g, b, x, y, brightness}.
 */
export function createPixelList(imageData) {
    const pixels = [];
    const { width, height, data } = imageData;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            // Calculate brightness using standard luminance formula
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            pixels.push({
                r, g, b,
                x, y,
                brightness
            });
        }
    }
    return pixels;
}

/**
 * Sorts a list of pixels by brightness.
 * @param {Array<Object>} pixelList - The list of pixels to sort.
 * @returns {Array<Object>} The sorted list (in-place or new, depending on implementation).
 */
export function sortPixelList(pixelList) {
    // Sort in ascending order of brightness
    return pixelList.sort((a, b) => a.brightness - b.brightness);
}

/**
 * Generates a mapping between source and target pixels.
 * Assumes both lists are sorted by brightness.
 * @param {Array<Object>} sourcePixels - Sorted source pixels.
 * @param {Array<Object>} targetPixels - Sorted target pixels.
 * @returns {Array<Object>} Array of particles with start and end positions.
 */
export function generatePixelMapping(sourcePixels, targetPixels) {
    const mapping = [];
    const count = Math.min(sourcePixels.length, targetPixels.length);

    for (let i = 0; i < count; i++) {
        const source = sourcePixels[i];
        const target = targetPixels[i];

        mapping.push({
            color: `rgb(${source.r}, ${source.g}, ${source.b})`,
            startX: source.x,
            startY: source.y,
            endX: target.x,
            endY: target.y,
            currentX: source.x,
            currentY: source.y
        });
    }
    return mapping;
}
