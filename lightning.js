/**
 * Lightning Animation
 * Erzeugt dynamische Blitzelektrische Entladungen mit Verzweigungen
 */

class Lightning {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastLightningUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.bolts = [];
        this.thunderEffects = [];
        this.clouds = [];
        this.config = {
            boltFrequency: 0.02,
            boltComplexity: 0.7,
            branchProbability: 0.3,
            glowIntensity: 0.8,
            thunderDuration: 30,
            backgroundColor: '#0a0a15',
            boltColor: '#ffffff',
            glowColor: '#87ceeb',
            cloudColor: '#2a2a3e'
        };
        
        // Physik-Konstanten
        this.segmentLength = 15;
        this.maxBranches = 5;
        this.glowDecay = 0.92;
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createClouds();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.groundLevel = this.canvas.height * 0.85;
    }
    
    createClouds() {
        this.clouds = [];
        const cloudCount = 6;
        
        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.3 + 20,
                width: Math.random() * 200 + 100,
                height: Math.random() * 60 + 30,
                opacity: Math.random() * 0.3 + 0.2,
                drift: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: (Math.random() - 0.5) * 0.1
                }
            });
        }
    }
    
    createGradientCache() {
        // Blitz-Gradienten für Performance zwischenspeichern
        const glowKey = 'lightning_glow';
        if (!this.gradientCache.has(glowKey)) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.3, 'rgba(135, 206, 235, 0.6)');
            gradient.addColorStop(0.6, 'rgba(135, 206, 235, 0.3)');
            gradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
            this.gradientCache.set(glowKey, gradient);
        }
        
        // Wolken-Gradient
        const cloudKey = 'cloud_gradient';
        if (!this.gradientCache.has(cloudKey)) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
            gradient.addColorStop(0, 'rgba(42, 42, 62, 0.8)');
            gradient.addColorStop(0.5, 'rgba(42, 42, 62, 0.4)');
            gradient.addColorStop(1, 'rgba(42, 42, 62, 0)');
            this.gradientCache.set(cloudKey, gradient);
        }
    }
    
    createBolt(startX, startY, endX = null, endY = null, depth = 0) {
        if (endX === null) endX = startX + (Math.random() - 0.5) * 200;
        if (endY === null) endY = this.groundLevel;
        
        const bolt = {
            segments: [],
            branches: [],
            life: 1.0,
            maxLife: Math.random() * 10 + 5,
            thickness: Math.max(1, 4 - depth),
            glow: 1.0,
            color: this.config.boltColor
        };
        
        // Hauptblitz generieren
        this.generateBoltPath(startX, startY, endX, endY, bolt.segments, depth);
        
        // Verzweigungen erstellen
        if (depth < 2 && Math.random() < this.config.branchProbability) {
            const branchCount = Math.floor(Math.random() * this.maxBranches) + 1;
            for (let i = 0; i < branchCount; i++) {
                const segmentIndex = Math.floor(Math.random() * bolt.segments.length);
                const segment = bolt.segments[segmentIndex];
                
                if (segment) {
                    const branchEndX = segment.x + (Math.random() - 0.5) * 150;
                    const branchEndY = segment.y + Math.random() * 100 + 50;
                    const branch = this.createBolt(segment.x, segment.y, branchEndX, branchEndY, depth + 1);
                    bolt.branches.push(branch);
                }
            }
        }
        
        return bolt;
    }
    
    generateBoltPath(startX, startY, endX, endY, segments, depth) {
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const segmentCount = Math.floor(distance / this.segmentLength);
        
        let currentX = startX;
        let currentY = startY;
        
        for (let i = 0; i <= segmentCount; i++) {
            const progress = i / segmentCount;
            const targetX = startX + dx * progress;
            const targetY = startY + dy * progress;
            
            // Zufällige Abweichung für natürlichen Look
            const deviation = (Math.random() - 0.5) * 30 * (1 - progress) * this.config.boltComplexity;
            const perpX = -dy / distance * deviation;
            const perpY = dx / distance * deviation;
            
            currentX = targetX + perpX;
            currentY = targetY + perpY;
            
            segments.push({
                x: currentX,
                y: currentY,
                thickness: Math.max(0.5, 4 - depth - progress * 2)
            });
        }
    }
    
    createThunderEffect(x, y) {
        this.thunderEffects.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 200,
            opacity: 0.3,
            life: this.config.thunderDuration
        });
    }
    
    updateClouds() {
        this.clouds.forEach(cloud => {
            // Langsame Wolken-Bewegung
            cloud.x += cloud.drift.x;
            cloud.y += cloud.drift.y;
            
            // Wrap-around
            if (cloud.x < -cloud.width) cloud.x = this.canvas.width + cloud.width;
            if (cloud.x > this.canvas.width + cloud.width) cloud.x = -cloud.width;
            if (cloud.y < -cloud.height) cloud.y = this.canvas.height + cloud.height;
            if (cloud.y > this.canvas.height + cloud.height) cloud.y = -cloud.height;
        });
    }
    
    updateBolts() {
        // Neue Blitze erstellen
        if (Math.random() < this.config.boltFrequency) {
            const cloud = this.clouds[Math.floor(Math.random() * this.clouds.length)];
            const startX = cloud.x + (Math.random() - 0.5) * cloud.width;
            const startY = cloud.y + cloud.height / 2;
            
            const bolt = this.createBolt(startX, startY);
            this.bolts.push(bolt);
            
            // Donnereffekt erstellen
            this.createThunderEffect(startX, this.groundLevel);
        }
        
        // Bestehende Blitze aktualisieren
        this.bolts = this.bolts.filter(bolt => {
            bolt.life -= 1 / bolt.maxLife;
            bolt.glow *= this.glowDecay;
            
            // Verzweigungen aktualisieren
            bolt.branches = bolt.branches.filter(branch => {
                branch.life -= 1 / branch.maxLife;
                branch.glow *= this.glowDecay;
                return branch.life > 0;
            });
            
            return bolt.life > 0;
        });
    }
    
    updateThunderEffects() {
        this.thunderEffects = this.thunderEffects.filter(effect => {
            effect.life--;
            effect.radius += (effect.maxRadius - effect.radius) * 0.2;
            effect.opacity *= 0.9;
            
            return effect.life > 0;
        });
    }
    
    drawBackground() {
        // Dunkler stürmischer Himmel
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#050510');
        gradient.addColorStop(0.5, this.config.backgroundColor);
        gradient.addColorStop(1, '#0a0a15');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawClouds() {
        const cloudGradient = this.gradientCache.get('cloud_gradient');
        
        this.clouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.globalAlpha = cloud.opacity;
            
            // Wolke als Ellipse zeichnen
            this.ctx.fillStyle = this.config.cloudColor;
            this.ctx.beginPath();
            this.ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Weichere Kanten mit Gradient
            this.ctx.fillStyle = cloudGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawBolt(bolt) {
        this.ctx.save();
        this.ctx.globalAlpha = bolt.life;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Hauptblitz zeichnen
        this.ctx.strokeStyle = bolt.color;
        this.ctx.lineWidth = bolt.thickness;
        this.ctx.shadowBlur = 20 * bolt.glow;
        this.ctx.shadowColor = this.config.glowColor;
        
        this.ctx.beginPath();
        bolt.segments.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.moveTo(segment.x, segment.y);
            } else {
                this.ctx.lineTo(segment.x, segment.y);
            }
        });
        this.ctx.stroke();
        
        // Glow-Effekt
        this.ctx.globalAlpha = bolt.life * bolt.glow * 0.3;
        this.ctx.lineWidth = bolt.thickness * 3;
        this.ctx.shadowBlur = 40 * bolt.glow;
        this.ctx.stroke();
        
        // Inner Glow
        this.ctx.globalAlpha = bolt.life * bolt.glow * 0.6;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = bolt.thickness * 0.5;
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Verzweigungen zeichnen
        bolt.branches.forEach(branch => this.drawBolt(branch));
    }
    
    drawThunderEffects() {
        this.thunderEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity * (effect.life / this.config.thunderDuration);
            
            const gradient = this.ctx.createRadialGradient(
                effect.x, effect.y, 0,
                effect.x, effect.y, effect.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.1)');
            gradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.restore();
        });
    }
    
    update() {
        this.updateClouds();
        this.updateBolts();
        this.updateThunderEffects();
    }
    
    draw() {
        this.drawBackground();
        this.drawClouds();
        this.drawThunderEffects();
        this.bolts.forEach(bolt => this.drawBolt(bolt));
    }
    
    animate() {
        if (this.adaptiveQuality && this.adaptiveQuality.shouldSkipFrame()) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        // Klick für manuelle Blitzerzeugung
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const bolt = this.createBolt(x, 0, x, this.canvas.height);
            this.bolts.push(bolt);
            this.createThunderEffect(x, this.canvas.height);
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const bolt = this.createBolt(x, 0, x, this.canvas.height);
            this.bolts.push(bolt);
            this.createThunderEffect(x, this.canvas.height);
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createClouds();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('lightning', this);
        }
    }
    
    // Steuerungsmethoden
    setBoltFrequency(frequency) {
        this.config.boltFrequency = Math.max(0, Math.min(0.1, frequency));
    }
    
    setBoltComplexity(complexity) {
        this.config.boltComplexity = Math.max(0.1, Math.min(1, complexity));
    }
    
    setBranchProbability(probability) {
        this.config.branchProbability = Math.max(0, Math.min(1, probability));
    }
    
    setGlowIntensity(intensity) {
        this.config.glowIntensity = Math.max(0, Math.min(2, intensity));
    }
    
    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Event-Listener entfernen
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('resize', this.handleResize);
        
        // Cache leeren
        this.gradientCache.clear();
        
        // Arrays leeren
        this.bolts = [];
        this.thunderEffects = [];
        this.clouds = [];
    }
}

// Globale Initialisierungsfunktion
function initLightning(canvasId) {
    return new Lightning(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Lightning, initLightning };
}