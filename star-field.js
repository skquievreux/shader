/**
 * Star Field Animation
 * Erzeugt ein kosmisches Sternenfeld mit Parallax-Effekt und Sternschnuppen
 */

class StarField {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastMeteorUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.stars = [];
        this.meteors = [];
        this.nebulaClouds = [];
        this.config = {
            starCount: 800,
            meteorFrequency: 0.02,
            parallaxStrength: 0.5,
            nebulaOpacity: 0.3,
            starColors: ['#ffffff', '#ffe9c4', '#d4e4ff', '#ffd4d4'],
            meteorColor: '#ffffff',
            backgroundColor: '#000814'
        };
        
        // Maus-Tracking für Parallax
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createStars();
        this.createNebula();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    createStars() {
        this.stars = [];
        const layers = 3; // Drei Schichten für Parallax
        
        for (let layer = 0; layer < layers; layer++) {
            const layerStars = Math.floor(this.config.starCount / layers);
            const depth = (layer + 1) / layers; // Tiefe für Parallax
            
            for (let i = 0; i < layerStars; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    z: depth, // Tiefe für Parallax-Effekt
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                    color: this.config.starColors[Math.floor(Math.random() * this.config.starColors.length)]
                });
            }
        }
    }
    
    createNebula() {
        this.nebulaClouds = [];
        const cloudCount = 5;
        
        for (let i = 0; i < cloudCount; i++) {
            this.nebulaClouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 200 + 100,
                color: `hsla(${Math.random() * 60 + 240}, 70%, 50%, ${this.config.nebulaOpacity})`,
                drift: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2
                }
            });
        }
    }
    
    createGradientCache() {
        // Nebel-Gradienten für Performance zwischenspeichern
        this.nebulaClouds.forEach(cloud => {
            const key = `nebula_${cloud.radius}_${cloud.color}`;
            if (!this.gradientCache.has(key)) {
                const gradient = this.ctx.createRadialGradient(
                    cloud.x, cloud.y, 0,
                    cloud.x, cloud.y, cloud.radius
                );
                gradient.addColorStop(0, cloud.color);
                gradient.addColorStop(1, 'transparent');
                this.gradientCache.set(key, gradient);
            }
        });
    }
    
    createMeteor() {
        if (Math.random() < this.config.meteorFrequency) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height * 0.5;
            const angle = Math.random() * Math.PI / 4 + Math.PI / 4; // 45-90 Grad
            
            this.meteors.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * (Math.random() * 8 + 4),
                vy: Math.sin(angle) * (Math.random() * 8 + 4),
                length: Math.random() * 80 + 40,
                opacity: 1,
                trail: []
            });
        }
    }
    
    updateStars() {
        this.stars.forEach(star => {
            // Twinkle-Effekt
            star.twinklePhase += star.twinkleSpeed;
            star.currentBrightness = star.brightness * (0.5 + 0.5 * Math.sin(star.twinklePhase));
            
            // Langsame Drift-Bewegung
            star.x += Math.sin(star.twinklePhase * 0.1) * 0.1;
            star.y += Math.cos(star.twinklePhase * 0.1) * 0.05;
            
            // Wrap-around bei Bildschirmrändern
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;
        });
    }
    
    updateMeteors() {
        // Neue Meteore erstellen
        this.createMeteor();
        
        // Bestehende Meteore aktualisieren
        this.meteors = this.meteors.filter(meteor => {
            // Trail aktualisieren
            meteor.trail.push({ x: meteor.x, y: meteor.y, opacity: meteor.opacity });
            if (meteor.trail.length > 20) {
                meteor.trail.shift();
            }
            
            // Position aktualisieren
            meteor.x += meteor.vx;
            meteor.y += meteor.vy;
            meteor.opacity -= 0.02;
            
            // Meteor entfernen wenn außerhalb oder unsichtbar
            return meteor.opacity > 0 && 
                   meteor.x < this.canvas.width + 100 && 
                   meteor.y < this.canvas.height + 100;
        });
    }
    
    updateNebula() {
        this.nebulaClouds.forEach(cloud => {
            // Langsame Nebel-Bewegung
            cloud.x += cloud.drift.x;
            cloud.y += cloud.drift.y;
            
            // Wrap-around
            if (cloud.x < -cloud.radius) cloud.x = this.canvas.width + cloud.radius;
            if (cloud.x > this.canvas.width + cloud.radius) cloud.x = -cloud.radius;
            if (cloud.y < -cloud.radius) cloud.y = this.canvas.height + cloud.radius;
            if (cloud.y > this.canvas.height + cloud.radius) cloud.y = -cloud.radius;
        });
    }
    
    updateMouse() {
        // Sanfte Maus-Bewegung für Parallax
        this.targetMouse.x = this.mouse.x;
        this.targetMouse.y = this.mouse.y;
        
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;
    }
    
    drawBackground() {
        // Tiefblauer Weltraum-Hintergrund
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000814');
        gradient.addColorStop(0.5, '#001d3d');
        gradient.addColorStop(1, '#000814');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawNebula() {
        this.nebulaClouds.forEach(cloud => {
            const key = `nebula_${cloud.radius}_${cloud.color}`;
            let gradient = this.gradientCache.get(key);
            
            if (!gradient) {
                gradient = this.ctx.createRadialGradient(
                    cloud.x, cloud.y, 0,
                    cloud.x, cloud.y, cloud.radius
                );
                gradient.addColorStop(0, cloud.color);
                gradient.addColorStop(1, 'transparent');
                this.gradientCache.set(key, gradient);
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                cloud.x - cloud.radius, 
                cloud.y - cloud.radius, 
                cloud.radius * 2, 
                cloud.radius * 2
            );
        });
    }
    
    drawStars() {
        this.stars.forEach(star => {
            // Parallax-Effekt basierend auf Mausposition
            const parallaxX = (this.mouse.x - this.centerX) * star.z * this.config.parallaxStrength;
            const parallaxY = (this.mouse.y - this.centerY) * star.z * this.config.parallaxStrength;
            
            const x = star.x + parallaxX;
            const y = star.y + parallaxY;
            
            // Stern zeichnen
            this.ctx.save();
            this.ctx.globalAlpha = star.currentBrightness;
            this.ctx.fillStyle = star.color;
            this.ctx.shadowBlur = star.size * 2;
            this.ctx.shadowColor = star.color;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow-Effekt für größere Sterne
            if (star.size > 1.5) {
                this.ctx.globalAlpha = star.currentBrightness * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    drawMeteors() {
        this.meteors.forEach(meteor => {
            // Trail zeichnen
            meteor.trail.forEach((point, index) => {
                const opacity = (index / meteor.trail.length) * meteor.opacity * 0.5;
                this.ctx.save();
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = this.config.meteorColor;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = this.config.meteorColor;
                
                const size = (index / meteor.trail.length) * 2;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
            
            // Meteor-Kopf zeichnen
            this.ctx.save();
            this.ctx.globalAlpha = meteor.opacity;
            this.ctx.fillStyle = this.config.meteorColor;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = this.config.meteorColor;
            
            this.ctx.beginPath();
            this.ctx.arc(meteor.x, meteor.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    update() {
        this.updateMouse();
        this.updateStars();
        this.updateMeteors();
        this.updateNebula();
    }
    
    draw() {
        this.drawBackground();
        this.drawNebula();
        this.drawStars();
        this.drawMeteors();
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
        // Maus-Events für Parallax
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.targetMouse.x = e.clientX - rect.left;
            this.targetMouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.targetMouse.x = this.centerX;
            this.targetMouse.y = this.centerY;
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.targetMouse.x = touch.clientX - rect.left;
            this.targetMouse.y = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.targetMouse.x = this.centerX;
            this.targetMouse.y = this.centerY;
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
            this.createNebula();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('star-field', this);
        }
    }
    
    // Steuerungsmethoden
    setStarCount(count) {
        this.config.starCount = Math.max(100, Math.min(2000, count));
        this.createStars();
    }
    
    setMeteorFrequency(frequency) {
        this.config.meteorFrequency = Math.max(0, Math.min(0.1, frequency));
    }
    
    setParallaxStrength(strength) {
        this.config.parallaxStrength = Math.max(0, Math.min(2, strength));
    }
    
    setNebulaOpacity(opacity) {
        this.config.nebulaOpacity = Math.max(0, Math.min(1, opacity));
        this.createNebula();
    }
    
    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Event-Listener entfernen
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);
        
        // Cache leeren
        this.gradientCache.clear();
        
        // Arrays leeren
        this.stars = [];
        this.meteors = [];
        this.nebulaClouds = [];
    }
}

// Globale Initialisierungsfunktion
function initStarField(canvasId) {
    return new StarField(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StarField, initStarField };
}