/**
 * Loads an image from a source URL.
 * @param {string} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image.
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

/**
 * Resizes an image to fit within max dimensions and returns its ImageData.
 * @param {HTMLImageElement} image - The source image.
 * @param {number} maxWidth - Maximum width.
 * @param {number} maxHeight - Maximum height.
 * @returns {ImageData} The resized image data.
 */
export function getResizedImageData(image, maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    let width = image.width;
    let height = image.height;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    return ctx.getImageData(0, 0, width, height);
}
