/**
 * Metatron's Cube Hexagonal Node Network - Optimized
 * Creates a perfect hexagonal pattern with animated glowing connections
 * Performance optimizations: lower intensity on mobile, pause on tab hidden
 */

class MetatronHexNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.isVisible = true;
        this.isMobile = window.innerWidth <= 768;
        this.intensity = this.isMobile ? 0.3 : 1.0; // Lower intensity on mobile
        
        this.setupCanvas();
        this.createHexagonalNetwork();
        this.setupVisibilityHandlers();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.intensity = this.isMobile ? 0.3 : 1.0;
            this.setupCanvas();
            this.createHexagonalNetwork();
        });
    }
    
    setupVisibilityHandlers() {
        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.animate();
            } else {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            }
        });
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    createHexagonalNetwork() {
        this.nodes = [];
        this.connections = [];
        
        // Create perfect hexagonal pattern
        const layers = this.isMobile ? 2 : 3; // Fewer layers on mobile
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * 0.12;
        const hexSpacing = baseRadius * 1.8;
        
        // Central node
        this.nodes.push({
            x: this.centerX,
            y: this.centerY,
            radius: 8,
            glow: 1,
            connections: [],
            layer: 0,
            index: 0
        });
        
        // Create hexagonal layers
        for (let layer = 1; layer <= layers; layer++) {
            const radius = hexSpacing * layer;
            const nodesInLayer = 6 * layer;
            
            for (let i = 0; i < nodesInLayer; i++) {
                const angle = (Math.PI * 2 * i) / nodesInLayer - Math.PI / 2;
                const x = this.centerX + radius * Math.cos(angle);
                const y = this.centerY + radius * Math.sin(angle);
                
                this.nodes.push({
                    x: x,
                    y: y,
                    radius: 6,
                    glow: 0.7,
                    connections: [],
                    layer: layer,
                    index: this.nodes.length
                });
            }
        }
        
        // Create connections - each node connects to exactly 5 nearest nodes
        this.nodes.forEach((node, index) => {
            const distances = this.nodes.map((other, otherIndex) => ({
                node: other,
                index: otherIndex,
                distance: Math.sqrt(
                    Math.pow(node.x - other.x, 2) + 
                    Math.pow(node.y - other.y, 2)
                )
            }));
            
            distances.sort((a, b) => a.distance - b.distance);
            const connections = distances.slice(1, 6);
            
            connections.forEach(conn => {
                const exists = this.connections.some(c => 
                    (c.from === index && c.to === conn.index) ||
                    (c.from === conn.index && c.to === index)
                );
                
                if (!exists) {
                    this.connections.push({
                        from: index,
                        to: conn.index,
                        progress: Math.random(),
                        speed: 0.008 + Math.random() * 0.015,
                        glow: (0.4 + Math.random() * 0.5) * this.intensity
                    });
                    
                    node.connections.push(conn.index);
                }
            });
        });
    }
    
    drawConnection(conn) {
        const fromNode = this.nodes[conn.from];
        const toNode = this.nodes[conn.to];
        
        if (!fromNode || !toNode) return;
        
        const ctx = this.ctx;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        const progress = conn.progress;
        const x = fromNode.x + dx * progress;
        const y = fromNode.y + dy * progress;
        
        // Apply intensity multiplier
        const glowIntensity = conn.glow * this.intensity;
        
        const gradient = ctx.createLinearGradient(
            fromNode.x, fromNode.y,
            toNode.x, toNode.y
        );
        
        gradient.addColorStop(0, `rgba(255, 215, 0, 0)`);
        gradient.addColorStop(Math.max(0, progress - 0.2), `rgba(255, 215, 0, 0)`);
        gradient.addColorStop(progress, `rgba(255, 215, 0, ${glowIntensity})`);
        gradient.addColorStop(Math.min(1, progress + 0.2), `rgba(0, 188, 212, ${glowIntensity * 0.8})`);
        gradient.addColorStop(1, `rgba(0, 188, 212, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15 * this.intensity;
        ctx.shadowColor = '#FFD700';
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
        
        // Draw flowing particle
        ctx.fillStyle = `rgba(255, 215, 0, ${glowIntensity})`;
        ctx.shadowBlur = 20 * this.intensity;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Update progress
        conn.progress += conn.speed;
        if (conn.progress > 1) {
            conn.progress = 0;
        }
    }
    
    drawNode(node, index) {
        const ctx = this.ctx;
        const glowIntensity = node.glow * this.intensity;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 3
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(0, 188, 212, ${glowIntensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node circle
        ctx.fillStyle = `rgba(255, 215, 0, ${glowIntensity})`;
        ctx.shadowBlur = 15 * this.intensity;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulsing effect
        node.glow = 0.6 + Math.sin(Date.now() * 0.003 + index) * 0.4;
        
        ctx.shadowBlur = 0;
    }
    
    animate() {
        if (!this.isVisible) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            this.drawConnection(conn);
        });
        
        // Draw nodes
        this.nodes.forEach((node, index) => {
            this.drawNode(node, index);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.metatronHexNetwork = new MetatronHexNetwork('metatron-hex-canvas');
    });
} else {
    window.metatronHexNetwork = new MetatronHexNetwork('metatron-hex-canvas');
}
