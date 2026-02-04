/**
 * MAS-AI Unified Background System
 * Blends Metatron Sacred Geometry (Layer A) with NatureNLP Particles (Layer B)
 * Handles 'prefers-reduced-motion' automatically.
 */

const CONFIG = {
    colors: {
        gold: '#FFD700',
        cyan: '#00BCD4',
        green: '#4CAF50',
        text: '#eaf0ff'
    },
    layerA: { // Metatron
        opacity: 0.08,
        speed: 0.05
    },
    layerB: { // NatureNLP
        particleCount: 80,
        connectionDistance: 120,
        opacity: 0.15,
        speed: 0.2
    }
};

class MasBackground {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'mas-ai-background-system';
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-5',
            pointerEvents: 'none',
            overflow: 'hidden'
        });
        document.body.prepend(this.container);

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.metatronAngle = 0;
        this.particles = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.initNatureParticles();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        // Re-init particles on resize to avoid clustering
        this.initNatureParticles();
        if (this.reducedMotion) this.drawStatic();
    }

    initNatureParticles() {
        this.particles = [];
        const count = this.width < 768 ? CONFIG.layerB.particleCount / 2 : CONFIG.layerB.particleCount;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * CONFIG.layerB.speed,
                vy: (Math.random() - 0.5) * CONFIG.layerB.speed,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? CONFIG.colors.cyan : CONFIG.colors.green
            });
        }
    }

    drawMetatron(ctx) {
        // Layer A: Metatron Geometry (Subtle, large scale)
        // Draw a rotating hex grid or sacred geometry pattern
        const cx = this.width / 2;
        const cy = this.height / 2;
        const size = Math.min(this.width, this.height) * 0.4;

        ctx.save();
        ctx.translate(cx, cy);
        if (!this.reducedMotion) {
            ctx.rotate(this.metatronAngle);
        }
        ctx.strokeStyle = CONFIG.colors.gold;
        ctx.lineWidth = 1;
        ctx.globalAlpha = CONFIG.layerA.opacity;

        // Simple Sacred Geometry: 6 circles around 1
        const r = size / 3;

        // Center
        ctx.beginPath();
        // ctx.arc(0, 0, r, 0, Math.PI * 2); 
        // ctx.stroke();

        // Surrounding 6
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();

            // Connect to center
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Outer ring connections
            const nextAngle = (Math.PI / 3) * ((i + 1) % 6);
            const nextX = Math.cos(nextAngle) * r;
            const nextY = Math.sin(nextAngle) * r;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawNature(ctx) {
        // Layer B: NatureNLP Wave/Particles
        ctx.globalAlpha = CONFIG.layerB.opacity;

        // Update and draw particles
        this.particles.forEach(p => {
            if (!this.reducedMotion) {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        // Draw connections (Flowing Network)
        ctx.lineWidth = 0.5;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.layerB.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = this.particles[i].color; // Gradient feel
                    ctx.globalAlpha = (1 - dist / CONFIG.layerB.connectionDistance) * CONFIG.layerB.opacity;
                    ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    drawStatic() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawMetatron(this.ctx);
        this.drawNature(this.ctx);
    }

    animate() {
        if (!this.reducedMotion) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.metatronAngle += CONFIG.layerA.speed * 0.005;
            this.drawMetatron(this.ctx);
            this.drawNature(this.ctx);
            requestAnimationFrame(() => this.animate());
        } else {
            this.drawStatic();
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new MasBackground();
});
