/**
 * Blended Investor Background (Metatron + NatureNLP)
 * A fusion of sacred geometry and organic growth.
 * 
 * Base: Metatron Hexagonal Grid
 * Detail: Organic Leaf Veins following Hex Paths
 * Effects: Glowing data pulses (Golden/Cyan) + Morning Dew Droplets (Nature)
 */

class BlendedInvestorBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.droplets = [];
        this.time = 0;
        this.animationId = null;

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.setupCanvas();
        this.initNetwork();

        if (!this.reducedMotion) {
            this.animate();
        } else {
            this.renderStatic();
        }

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.initNetwork();
            if (this.reducedMotion) this.renderStatic();
        });
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    initNetwork() {
        this.nodes = [];
        this.connections = [];
        this.droplets = [];

        const layers = window.innerWidth < 768 ? 2 : 3;
        const hexSize = Math.min(this.canvas.width, this.canvas.height) * 0.15;
        const spacing = hexSize * 1.5;

        // Root node
        this.nodes.push({ x: this.centerX, y: this.centerY, glow: 1 });

        // Hex Layers
        for (let l = 1; l <= layers; l++) {
            const radius = spacing * l;
            const nodesInLayer = 6 * l;
            for (let i = 0; i < nodesInLayer; i++) {
                const angle = (Math.PI * 2 * i) / nodesInLayer - Math.PI / 2;
                this.nodes.push({
                    x: this.centerX + radius * Math.cos(angle),
                    y: this.centerY + radius * Math.sin(angle),
                    glow: Math.random() * 0.5 + 0.5
                });
            }
        }

        // Connections (Organic Veins)
        this.nodes.forEach((node, i) => {
            // Find nearest neighbors to connect via "veins"
            const neighbors = this.nodes
                .map((other, j) => ({ index: j, dist: Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2) }))
                .filter(n => n.dist > 0 && n.dist < spacing * 1.8)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 3);

            neighbors.forEach(n => {
                const exists = this.connections.some(c => (c.from === i && c.to === n.index) || (c.from === n.index && c.to === i));
                if (!exists) {
                    this.connections.push({
                        from: i,
                        to: n.index,
                        progress: Math.random(),
                        speed: 0.005 + Math.random() * 0.01,
                        // Curvature for organic look
                        cpX: (this.nodes[i].x + this.nodes[n.index].x) / 2 + (Math.random() - 0.5) * 40,
                        cpY: (this.nodes[i].y + this.nodes[n.index].y) / 2 + (Math.random() - 0.5) * 40,
                        type: Math.random() > 0.5 ? 'gold' : 'green'
                    });
                }
            });

            // Random droplets on nodes
            if (Math.random() > 0.7) {
                this.droplets.push({
                    nodeIdx: i,
                    size: 2 + Math.random() * 4,
                    sparkle: Math.random() * Math.PI * 2
                });
            }
        });
    }

    drawConnection(conn) {
        const from = this.nodes[conn.from];
        const to = this.nodes[conn.to];
        const ctx = this.ctx;

        // Draw Curved Veins
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(conn.cpX, conn.cpY, to.x, to.y);

        const alpha = 0.08;
        ctx.strokeStyle = conn.type === 'gold' ?
            `rgba(255, 215, 0, ${alpha})` :
            `rgba(76, 175, 80, ${alpha})`;

        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Flowing Pulse
        if (!this.reducedMotion) {
            const t = conn.progress;
            // Calculate point on quadratic curve
            const px = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * conn.cpX + t ** 2 * to.x;
            const py = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * conn.cpY + t ** 2 * to.y;

            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = conn.type === 'gold' ? 'rgba(255, 215, 0, 0.4)' : 'rgba(76, 175, 80, 0.4)';
            ctx.fill();

            conn.progress += conn.speed;
            if (conn.progress > 1) conn.progress = 0;
        }
    }

    drawDroplet(droplet) {
        const node = this.nodes[droplet.nodeIdx];
        const ctx = this.ctx;
        const sparkle = Math.sin(this.time * 0.02 + droplet.sparkle) * 0.2 + 0.8;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, droplet.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * sparkle})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, droplet.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMetatronCircles() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = 0.03;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;

        // 13 Circle Pattern
        const baseRadius = 60;
        const circles = [
            { x: this.centerX, y: this.centerY }, // Center
            ...Array.from({ length: 6 }, (_, i) => { // Inner
                const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                return { x: this.centerX + baseRadius * Math.cos(a), y: this.centerY + baseRadius * Math.sin(a) };
            }),
            ...Array.from({ length: 6 }, (_, i) => { // Outer
                const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                return { x: this.centerX + (baseRadius * 2) * Math.cos(a), y: this.centerY + (baseRadius * 2) * Math.sin(a) };
            })
        ];

        circles.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, baseRadius, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Connect all circles to all other circles (Metatron's Cube)
        ctx.globalAlpha = 0.01;
        circles.forEach((c1, i) => {
            circles.slice(i + 1).forEach(c2 => {
                ctx.beginPath();
                ctx.moveTo(c1.x, c1.y);
                ctx.lineTo(c2.x, c2.y);
                ctx.stroke();
            });
        });

        ctx.restore();
    }

    animate() {
        this.time += 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Metatron Base
        this.drawMetatronCircles();

        // Draw Connections First
        this.connections.forEach(c => this.drawConnection(c));

        // Draw Nodes (Small hints)
        this.nodes.forEach(n => {
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            this.ctx.fill();
        });

        // Draw Droplets on top
        this.droplets.forEach(d => this.drawDroplet(d));

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    renderStatic() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMetatronCircles();
        this.connections.forEach(c => this.drawConnection(c));
        this.droplets.forEach(d => this.drawDroplet(d));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BlendedInvestorBackground('investor-canvas');
});
