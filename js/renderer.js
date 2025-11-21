/**
 * Easing function for smooth animation.
 * @param {number} t - Progress from 0 to 1.
 * @returns {number} Eased value.
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Renders the particles on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {Array<Object>} particles - List of particles.
 * @param {number} progress - Animation progress (0 to 1).
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 */
export function drawParticles(ctx, particles, progress, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate eased progress
    const t = easeInOutCubic(progress);

    for (const p of particles) {
        // Interpolate position
        const x = p.startX + (p.endX - p.startX) * t;
        const y = p.startY + (p.endY - p.startY) * t;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.fillRect(x, y, 1, 1);
    }
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
