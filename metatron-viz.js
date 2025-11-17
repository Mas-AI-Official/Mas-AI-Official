/**
 * Metatron's Cube Visualization with Flowing Light Lines
 * 
 * Creates the sacred geometry pattern with 13 circles (1 center + 6 inner + 6 outer)
 * Connected with flowing/running golden light lines
 * Shiny circular nodes at each intersection
 */

class MetatronViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Metatron container not found:', containerId);
            return;
        }
        this.svg = null;
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.calculateMetatronStructure();
        this.drawNodes();
        this.drawConnections();
        this.startAnimation();
    }
    
    createSVG() {
        // Clear container
        this.container.innerHTML = '';
        
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', '0 0 1000 1000');
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        this.svg.style.zIndex = '5';
        this.svg.style.overflow = 'visible';
        
        // Add defs for filters and gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        this.createFilters(defs);
        this.createGradients(defs);
        this.svg.appendChild(defs);
        
        this.container.appendChild(this.svg);
    }
    
    createFilters(defs) {
        // Glow filter for nodes
        const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        glowFilter.setAttribute('id', 'nodeGlow');
        glowFilter.setAttribute('x', '-50%');
        glowFilter.setAttribute('y', '-50%');
        glowFilter.setAttribute('width', '200%');
        glowFilter.setAttribute('height', '200%');
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '4');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        glowFilter.appendChild(feGaussianBlur);
        
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        feMerge.appendChild(this.createElement('feMergeNode', { in: 'coloredBlur' }));
        feMerge.appendChild(this.createElement('feMergeNode', { in: 'SourceGraphic' }));
        glowFilter.appendChild(feMerge);
        
        defs.appendChild(glowFilter);
        
        // Strong glow for center node
        const centerGlow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        centerGlow.setAttribute('id', 'centerGlow');
        centerGlow.setAttribute('x', '-100%');
        centerGlow.setAttribute('y', '-100%');
        centerGlow.setAttribute('width', '300%');
        centerGlow.setAttribute('height', '300%');
        
        const centerBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        centerBlur.setAttribute('stdDeviation', '8');
        centerBlur.setAttribute('result', 'coloredBlur');
        centerGlow.appendChild(centerBlur);
        
        const centerMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        centerMerge.appendChild(this.createElement('feMergeNode', { in: 'coloredBlur' }));
        centerMerge.appendChild(this.createElement('feMergeNode', { in: 'SourceGraphic' }));
        centerGlow.appendChild(centerMerge);
        
        defs.appendChild(centerGlow);
    }
    
    createGradients(defs) {
        // Golden gradient for flowing lines
        const flowGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        flowGradient.setAttribute('id', 'flowGradient');
        flowGradient.setAttribute('x1', '0%');
        flowGradient.setAttribute('y1', '0%');
        flowGradient.setAttribute('x2', '100%');
        flowGradient.setAttribute('y2', '0%');
        flowGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        
        flowGradient.appendChild(this.createStop('0%', '#ffd700', '0'));
        flowGradient.appendChild(this.createStop('20%', '#ffed4e', '0.3'));
        flowGradient.appendChild(this.createStop('50%', '#ffd700', '1'));
        flowGradient.appendChild(this.createStop('80%', '#ffed4e', '0.3'));
        flowGradient.appendChild(this.createStop('100%', '#ffd700', '0'));
        
        defs.appendChild(flowGradient);
        
        // Radial gradient for node shine
        const nodeGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        nodeGradient.setAttribute('id', 'nodeGradient');
        nodeGradient.setAttribute('cx', '50%');
        nodeGradient.setAttribute('cy', '50%');
        nodeGradient.setAttribute('r', '50%');
        
        nodeGradient.appendChild(this.createStop('0%', '#ffffff', '1'));
        nodeGradient.appendChild(this.createStop('30%', '#ffed4e', '1'));
        nodeGradient.appendChild(this.createStop('60%', '#ffd700', '0.8'));
        nodeGradient.appendChild(this.createStop('100%', '#ffa500', '0.3'));
        
        defs.appendChild(nodeGradient);
    }
    
    createElement(name, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', name);
        Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
        return el;
    }
    
    createStop(offset, color, opacity) {
        return this.createElement('stop', {
            offset: offset,
            'stop-color': color,
            'stop-opacity': opacity
        });
    }
    
    calculateMetatronStructure() {
        const centerX = 500;
        const centerY = 500;
        
        // Radius for inner hexagon (6 circles around center)
        const innerRadius = 150;
        
        // Radius for outer hexagon (6 circles around inner)
        const outerRadius = 300;
        
        // Center node
        this.nodes.push({
            id: 'center',
            x: centerX,
            y: centerY,
            radius: 30,
            isCenter: true
        });
        
        // Inner 6 nodes (forming hexagon around center)
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 - Math.PI / 2; // Start from top
            this.nodes.push({
                id: `inner_${i}`,
                x: centerX + innerRadius * Math.cos(angle),
                y: centerY + innerRadius * Math.sin(angle),
                radius: 25,
                isCenter: false
            });
        }
        
        // Outer 6 nodes (forming larger hexagon)
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 - Math.PI / 2 + Math.PI / 6; // Offset by 30 degrees
            this.nodes.push({
                id: `outer_${i}`,
                x: centerX + outerRadius * Math.cos(angle),
                y: centerY + outerRadius * Math.sin(angle),
                radius: 25,
                isCenter: false
            });
        }
        
        // Calculate all connections (Metatron's Cube pattern)
        this.calculateConnections();
    }
    
    calculateConnections() {
        this.connections = [];
        
        // Connect center to all inner nodes
        for (let i = 1; i <= 6; i++) {
            this.connections.push({
                from: 0, // center
                to: i,   // inner nodes
                speed: 0.5 + Math.random() * 0.3
            });
        }
        
        // Connect inner nodes to each other (hexagon)
        for (let i = 1; i <= 6; i++) {
            const next = i === 6 ? 1 : i + 1;
            this.connections.push({
                from: i,
                to: next,
                speed: 0.4 + Math.random() * 0.2
            });
        }
        
        // Connect inner nodes to outer nodes
        for (let i = 1; i <= 6; i++) {
            // Each inner node connects to 2 outer nodes
            const outer1 = 6 + ((i - 1) % 6) + 1;
            const outer2 = 6 + (i % 6) + 1;
            this.connections.push({
                from: i,
                to: outer1,
                speed: 0.6 + Math.random() * 0.2
            });
            this.connections.push({
                from: i,
                to: outer2,
                speed: 0.6 + Math.random() * 0.2
            });
        }
        
        // Connect outer nodes to each other (outer hexagon)
        for (let i = 7; i <= 12; i++) {
            const next = i === 12 ? 7 : i + 1;
            this.connections.push({
                from: i,
                to: next,
                speed: 0.5 + Math.random() * 0.3
            });
        }
        
        // Additional geometric connections (triangles, etc.)
        // Connect outer nodes to center through inner nodes (creates star pattern)
        for (let i = 7; i <= 12; i++) {
            const innerIndex = ((i - 7) % 6) + 1;
            if (!this.connections.find(c => c.from === innerIndex && c.to === i)) {
                this.connections.push({
                    from: innerIndex,
                    to: i,
                    speed: 0.7 + Math.random() * 0.2
                });
            }
        }
    }
    
    drawNodes() {
        const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodesGroup.setAttribute('id', 'nodes-group');
        
        this.nodes.forEach((node, index) => {
            const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeGroup.setAttribute('id', `node-${node.id}`);
            nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            
            // Outer glow circle
            const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glowCircle.setAttribute('r', node.radius * 1.5);
            glowCircle.setAttribute('fill', 'url(#nodeGradient)');
            glowCircle.setAttribute('opacity', '0.4');
            glowCircle.setAttribute('filter', node.isCenter ? 'url(#centerGlow)' : 'url(#nodeGlow)');
            nodeGroup.appendChild(glowCircle);
            
            // Main shiny circle
            const mainCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            mainCircle.setAttribute('r', node.radius);
            mainCircle.setAttribute('fill', 'url(#nodeGradient)');
            mainCircle.setAttribute('stroke', '#ffd700');
            mainCircle.setAttribute('stroke-width', '2');
            mainCircle.setAttribute('filter', node.isCenter ? 'url(#centerGlow)' : 'url(#nodeGlow)');
            nodeGroup.appendChild(mainCircle);
            
            // Inner bright center (star-like point)
            const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            innerCircle.setAttribute('r', node.radius * 0.3);
            innerCircle.setAttribute('fill', '#ffffff');
            innerCircle.setAttribute('opacity', '1');
            nodeGroup.appendChild(innerCircle);
            
            // Add pulsing animation
            if (node.isCenter) {
                mainCircle.style.animation = 'nodePulse 2s ease-in-out infinite';
                glowCircle.style.animation = 'nodePulse 2s ease-in-out infinite';
            }
            
            nodesGroup.appendChild(nodeGroup);
        });
        
        this.svg.appendChild(nodesGroup);
    }
    
    drawConnections() {
        const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        connectionsGroup.setAttribute('id', 'connections-group');
        
        this.connections.forEach((conn, index) => {
            const fromNode = this.nodes[conn.from];
            const toNode = this.nodes[conn.to];
            
            // Create path for flowing line
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
            path.setAttribute('d', pathData);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#ffd700');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('opacity', '0.6');
            path.setAttribute('filter', 'url(#nodeGlow)');
            path.setAttribute('data-connection-index', index);
            path.setAttribute('data-speed', conn.speed);
            
            // Add dash array for flowing effect
            const pathLength = Math.sqrt(
                Math.pow(toNode.x - fromNode.x, 2) + 
                Math.pow(toNode.y - fromNode.y, 2)
            );
            path.setAttribute('stroke-dasharray', `${pathLength * 0.3} ${pathLength * 0.7}`);
            
            connectionsGroup.appendChild(path);
        });
        
        this.svg.appendChild(connectionsGroup);
    }
    
    startAnimation() {
        const animate = () => {
            this.time += 0.016; // ~60fps
            
            // Animate flowing lines
            const paths = this.svg.querySelectorAll('#connections-group path');
            paths.forEach((path, index) => {
                const speed = parseFloat(path.getAttribute('data-speed')) || 0.5;
                const pathLength = path.getTotalLength();
                const offset = (this.time * speed * 100) % (pathLength * 2);
                
                // Update dash offset for flowing effect
                path.setAttribute('stroke-dashoffset', -offset);
                
                // Vary opacity for flowing effect
                const opacity = 0.4 + Math.sin(this.time * 2 + index) * 0.3;
                path.setAttribute('opacity', Math.max(0.3, Math.min(0.9, opacity)));
            });
            
            // Animate node glow
            const nodes = this.svg.querySelectorAll('#nodes-group circle');
            nodes.forEach((node, index) => {
                const pulse = Math.sin(this.time * 2 + index * 0.5) * 0.2 + 0.8;
                const currentOpacity = parseFloat(node.getAttribute('opacity')) || 0.4;
                node.setAttribute('opacity', currentOpacity * pulse);
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Add CSS animations
if (!document.getElementById('metatron-viz-styles')) {
    const style = document.createElement('style');
    style.id = 'metatron-viz-styles';
    style.textContent = `
        @keyframes nodePulse {
            0%, 100% {
                opacity: 0.8;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.1);
            }
        }
        
        #metatron-container svg {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
}

// Auto-initialize if container exists
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('metatron-container');
        if (container) {
            window.metatronViz = new MetatronViz('metatron-container');
        }
    });
} else {
    const container = document.getElementById('metatron-container');
    if (container) {
        window.metatronViz = new MetatronViz('metatron-container');
    }
}

