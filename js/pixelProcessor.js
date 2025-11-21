/**
 * Converts ImageData into an array of pixel objects.
 * @param {ImageData} imageData - The image data to process.
 * @returns {Array<Object>} Array of pixel objects {r, g, b, x, y, brightness}.
 */
/**
 * Converts ImageData into an array of pixel objects with edge detection.
 * @param {ImageData} imageData - The image data to process.
 * @returns {Array<Object>} Array of pixel objects {r, g, b, x, y, brightness, edgeStrength}.
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
            
            // Calculate brightness
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            // Calculate Edge Strength (Simple Gradient)
            // Compare with right and bottom neighbors
            let edgeStrength = 0;
            
            // Right neighbor
            if (x < width - 1) {
                const rightIndex = index + 4;
                const r2 = data[rightIndex];
                const g2 = data[rightIndex + 1];
                const b2 = data[rightIndex + 2];
                const b2_val = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
                edgeStrength += Math.abs(brightness - b2_val);
            }

            // Bottom neighbor
            if (y < height - 1) {
                const bottomIndex = index + width * 4;
                const r3 = data[bottomIndex];
                const g3 = data[bottomIndex + 1];
                const b3 = data[bottomIndex + 2];
                const b3_val = 0.299 * r3 + 0.587 * g3 + 0.114 * b3;
                edgeStrength += Math.abs(brightness - b3_val);
            }

            pixels.push({
                r, g, b,
                x, y,
                brightness,
                edgeStrength
            });
        }
    }
    return pixels;
}

/**
 * Sorts a list of pixels by brightness.
 * @param {Array<Object>} pixelList - The list of pixels to sort.
 * @returns {Array<Object>} The sorted list.
 */
export function sortPixelList(pixelList) {
    return pixelList.sort((a, b) => a.brightness - b.brightness);
}

/**
 * Generates a mapping between source and target pixels using Edge Prioritization.
 * @param {Array<Object>} sourcePixels - Unsorted source pixels.
 * @param {Array<Object>} targetPixels - Unsorted target pixels.
 * @returns {Array<Object>} Array of particles with start and end positions.
 */
export function generatePixelMapping(sourcePixels, targetPixels) {
    // Helper to split pixels into Edges and Body
    // We take the top 25% strongest edges as "Edges"
    const splitPixels = (pixels) => {
        // Sort by edge strength descending
        const sortedByEdge = [...pixels].sort((a, b) => b.edgeStrength - a.edgeStrength);
        const splitIndex = Math.floor(pixels.length * 0.25);
        
        const edges = sortedByEdge.slice(0, splitIndex);
        const body = sortedByEdge.slice(splitIndex);
        
        return { edges, body };
    };

    const sourceParts = splitPixels(sourcePixels);
    const targetParts = splitPixels(targetPixels);

    // Sort each part by brightness for matching
    sortPixelList(sourceParts.edges);
    sortPixelList(sourceParts.body);
    sortPixelList(targetParts.edges);
    sortPixelList(targetParts.body);

    const mapping = [];

    // 1. Map Edges to Edges
    const edgeCount = Math.min(sourceParts.edges.length, targetParts.edges.length);
    for (let i = 0; i < edgeCount; i++) {
        const source = sourceParts.edges[i];
        const target = targetParts.edges[i];
        mapping.push(createParticle(source, target));
    }

    // 2. Map Body to Body
    // Note: If counts differ significantly, we might leave some pixels unused or double mapped,
    // but for same-sized images, it should be roughly equal.
    const bodyCount = Math.min(sourceParts.body.length, targetParts.body.length);
    for (let i = 0; i < bodyCount; i++) {
        const source = sourceParts.body[i];
        const target = targetParts.body[i];
        mapping.push(createParticle(source, target));
    }

    return mapping;
}

function createParticle(source, target) {
    return {
        r: source.r,
        g: source.g,
        b: source.b,
        startX: source.x,
        startY: source.y,
        endX: target.x,
        endY: target.y,
        currentX: source.x,
        currentY: source.y
    };
}
