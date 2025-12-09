/**
 * Rain Animation
 * Erzeugt realistischen Regen mit Splash-Effekten und Windeinfluss
 */

class Rain {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastSplashUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.raindrops = [];
        this.splashes = [];
        this.puddles = [];
        this.config = {
            rainIntensity: 500, // Anzahl der Regentropfen
            dropSpeed: 15,
            windForce: 0,
            splashIntensity: 0.8,
            puddleFormation: true,
            backgroundColor: '#1a1a2e',
            rainColor: 'rgba(174, 194, 224, 0.6)',
            splashColor: 'rgba(174, 194, 224, 0.4)'
        };
        
        // Physik-Konstanten
        this.gravity = 0.5;
        this.windResistance = 0.98;
        this.splashVelocity = 3;
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createRaindrops();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.groundLevel = this.canvas.height * 0.9; // Boden bei 90% der Höhe
    }
    
    createRaindrops() {
        this.raindrops = [];
        for (let i = 0; i < this.config.rainIntensity; i++) {
            this.raindrops.push(this.createRaindrop(true));
        }
    }
    
    createRaindrop(initial = false) {
        return {
            x: Math.random() * this.canvas.width,
            y: initial ? Math.random() * this.canvas.height : -10,
            vx: this.config.windForce + (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 2 + this.config.dropSpeed,
            length: Math.random() * 15 + 10,
            width: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.3,
            mass: Math.random() * 0.5 + 0.5
        };
    }
    
    createSplash(x, y, intensity) {
        const particleCount = Math.floor(intensity * 8 + 4);
        const splash = {
            x: x,
            y: y,
            particles: [],
            life: 1.0
        };
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const velocity = Math.random() * this.splashVelocity * intensity + 1;
            
            splash.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - Math.random() * 2,
                size: Math.random() * 2 + 1,
                life: 1.0,
                gravity: this.gravity * 0.5
            });
        }
        
        return splash;
    }
    
    createPuddle(x, y) {
        if (!this.config.puddleFormation) return null;
        
        // Prüfen ob in der Nähe bereits eine Pfütze existiert
        const nearbyPuddle = this.puddles.find(puddle => {
            const distance = Math.sqrt((puddle.x - x) ** 2 + (puddle.y - y) ** 2);
            return distance < 30;
        });
        
        if (nearbyPuddle) {
            // Bestehende Pfütze vergrößern
            nearbyPuddle.radius = Math.min(nearbyPuddle.radius + 0.5, 20);
            nearbyPuddle.opacity = Math.min(nearbyPuddle.opacity + 0.02, 0.3);
            return null;
        }
        
        return {
            x: x,
            y: y,
            radius: Math.random() * 5 + 3,
            opacity: 0.1,
            maxRadius: Math.random() * 15 + 10,
            growthRate: Math.random() * 0.1 + 0.05
        };
    }
    
    createGradientCache() {
        // Hintergrund-Gradient für Performance zwischenspeichern
        const bgKey = `background_${this.canvas.width}_${this.canvas.height}`;
        if (!this.gradientCache.has(bgKey)) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#0f0f1e');
            gradient.addColorStop(0.5, this.config.backgroundColor);
            gradient.addColorStop(1, '#0a0a15');
            this.gradientCache.set(bgKey, gradient);
        }
        
        // Pfützen-Gradient
        const puddleKey = 'puddle_gradient';
        if (!this.gradientCache.has(puddleKey)) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
            gradient.addColorStop(0, 'rgba(174, 194, 224, 0.3)');
            gradient.addColorStop(0.5, 'rgba(174, 194, 224, 0.2)');
            gradient.addColorStop(1, 'rgba(174, 194, 224, 0)');
            this.gradientCache.set(puddleKey, gradient);
        }
    }
    
    updateRaindrops() {
        // Neue Regentropfen erstellen bei Bedarf
        while (this.raindrops.length < this.config.rainIntensity) {
            this.raindrops.push(this.createRaindrop());
        }
        
        // Regentropfen aktualisieren
        this.raindrops = this.raindrops.filter(drop => {
            // Physik aktualisieren
            drop.vy += this.gravity;
            drop.vx += this.config.windForce * 0.01;
            drop.vx *= this.windResistance;
            
            // Position aktualisieren
            drop.x += drop.vx;
            drop.y += drop.vy;
            
            // Splash-Erstellung bei Bodenkollision
            if (drop.y >= this.groundLevel) {
                // Splash erstellen
                const splashIntensity = drop.mass * this.config.splashIntensity;
                this.splashes.push(this.createSplash(drop.x, this.groundLevel, splashIntensity));
                
                // Pfütze erstellen (selten)
                if (Math.random() < 0.05 && this.config.puddleFormation) {
                    const puddle = this.createPuddle(drop.x, this.groundLevel);
                    if (puddle) {
                        this.puddles.push(puddle);
                    }
                }
                
                return false; // Regentropfen entfernen
            }
            
            // Entfernen wenn außerhalb des Bildschirms
            return drop.y < this.canvas.height + 10 && 
                   drop.x > -10 && drop.x < this.canvas.width + 10;
        });
    }
    
    updateSplashes() {
        this.splashes = this.splashes.filter(splash => {
            splash.life -= 0.02;
            
            // Partikel aktualisieren
            splash.particles.forEach(particle => {
                particle.vy += particle.gravity;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98; // Luftwiderstand
                particle.life -= 0.03;
            });
            
            // Tote Partikel entfernen
            splash.particles = splash.particles.filter(particle => particle.life > 0);
            
            return splash.life > 0 && splash.particles.length > 0;
        });
    }
    
    updatePuddles() {
        this.puddles = this.puddles.filter(puddle => {
            // Pfützen wachsen lassen
            if (puddle.radius < puddle.maxRadius) {
                puddle.radius += puddle.growthRate;
            }
            
            // Langsames Verschwinden
            puddle.opacity -= 0.0005;
            puddle.radius *= 0.999; // Langsames Schrumpfen
            
            return puddle.opacity > 0.01 && puddle.radius > 1;
        });
    }
    
    drawBackground() {
        const bgKey = `background_${this.canvas.width}_${this.canvas.height}`;
        const gradient = this.gradientCache.get(bgKey);
        
        this.ctx.fillStyle = gradient || this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Bodenebene
        const groundGradient = this.ctx.createLinearGradient(0, this.groundLevel, 0, this.canvas.height);
        groundGradient.addColorStop(0, 'rgba(26, 26, 46, 0.8)');
        groundGradient.addColorStop(1, 'rgba(10, 10, 21, 0.9)');
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.groundLevel, this.canvas.width, this.canvas.height - this.groundLevel);
    }
    
    drawRaindrops() {
        this.ctx.save();
        this.ctx.lineCap = 'round';
        
        this.raindrops.forEach(drop => {
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.strokeStyle = this.config.rainColor;
            this.ctx.lineWidth = drop.width;
            
            // Regentropfen als Linie zeichnen
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - drop.vx * 0.5, drop.y - drop.length);
            this.ctx.stroke();
            
            // Leuchtspitze für schnellere Tropfen
            if (drop.vy > this.config.dropSpeed + 2) {
                this.ctx.globalAlpha = drop.opacity * 0.8;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.beginPath();
                this.ctx.arc(drop.x, drop.y, drop.width * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.ctx.restore();
    }
    
    drawSplashes() {
        this.splashes.forEach(splash => {
            splash.particles.forEach(particle => {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life * splash.life * 0.6;
                this.ctx.fillStyle = this.config.splashColor;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Kleiner Glow-Effekt
                this.ctx.globalAlpha = particle.life * splash.life * 0.2;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            });
        });
    }
    
    drawPuddles() {
        const puddleGradient = this.gradientCache.get('puddle_gradient');
        
        this.puddles.forEach(puddle => {
            this.ctx.save();
            this.ctx.globalAlpha = puddle.opacity;
            
            // Pfütze mit Gradient zeichnen
            this.ctx.fillStyle = puddleGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(puddle.x, puddle.y, puddle.radius, puddle.radius * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glitzern auf der Pfütze
            if (Math.random() < 0.1) {
                this.ctx.globalAlpha = puddle.opacity * 0.8;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                const sparkleX = puddle.x + (Math.random() - 0.5) * puddle.radius;
                const sparkleY = puddle.y + (Math.random() - 0.5) * puddle.radius * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    update() {
        this.updateRaindrops();
        this.updateSplashes();
        this.updatePuddles();
    }
    
    draw() {
        this.drawBackground();
        this.drawPuddles();
        this.drawRaindrops();
        this.drawSplashes();
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
        // Maus-Interaktion für Windeinfluss
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const targetWindForce = (mouseX - this.canvas.width / 2) / (this.canvas.width / 2) * 5;
            this.config.windForce += (targetWindForce - this.config.windForce) * 0.1;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.config.windForce = 0;
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const targetWindForce = (touchX - this.canvas.width / 2) / (this.canvas.width / 2) * 5;
            this.config.windForce += (targetWindForce - this.config.windForce) * 0.1;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.config.windForce = 0;
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createRaindrops();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('rain', this);
        }
    }
    
    // Steuerungsmethoden
    setRainIntensity(intensity) {
        this.config.rainIntensity = Math.max(50, Math.min(2000, intensity));
    }
    
    setWindForce(force) {
        this.config.windForce = Math.max(-10, Math.min(10, force));
    }
    
    setSplashIntensity(intensity) {
        this.config.splashIntensity = Math.max(0, Math.min(2, intensity));
    }
    
    setPuddleFormation(enabled) {
        this.config.puddleFormation = enabled;
        if (!enabled) {
            this.puddles = [];
        }
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
        this.raindrops = [];
        this.splashes = [];
        this.puddles = [];
    }
}

// Globale Initialisierungsfunktion
function initRain(canvasId) {
    return new Rain(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Rain, initRain };
}