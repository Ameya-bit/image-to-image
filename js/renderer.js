/**
 * Easing function for smooth animation.
 * @param {number} t - Progress from 0 to 1.
 * @returns {number} Eased value.
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Renders the particles on the canvas using ImageData for performance.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Array<Object>} particles - List of particles.
 * @param {number} progress - Animation progress (0 to 1).
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 */
export function drawParticles(ctx, particles, progress, width, height) {
    // Create ImageData buffer
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Calculate eased progress
    const t = easeInOutCubic(progress);

    for (const p of particles) {
        // Interpolate position
        const x = Math.round(p.startX + (p.endX - p.startX) * t);
        const y = Math.round(p.startY + (p.endY - p.startY) * t);

        // Boundary check
        if (x >= 0 && x < width && y >= 0 && y < height) {
            const index = (y * width + x) * 4;
            
            // Use direct RGB values
            data[index] = p.r;     // Red
            data[index + 1] = p.g; // Green
            data[index + 2] = p.b; // Blue
            data[index + 3] = 255; // Alpha
        }
    }

    // Blit to canvas
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Manages the animation state.
 */
export class ParticleRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.duration = 3000; // ms
        this.startTime = null;
        this.animationId = null;
        this.onComplete = null;
    }

    setParticles(particles, width, height) {
        this.particles = particles;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    start(onComplete) {
        this.onComplete = onComplete;
        this.startTime = performance.now();
        this.animate();
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        let progress = Math.min(elapsed / this.duration, 1);

        drawParticles(this.ctx, this.particles, progress, this.canvas.width, this.canvas.height);

        if (progress < 1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            if (this.onComplete) this.onComplete();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}
