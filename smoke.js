/**
 * Smoke Animation
 * Erzeugt realistische Rauchsimulation mit Partikelphysik und Windeinfluss
 */

class Smoke {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastSmokeUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.particles = [];
        this.sources = [];
        this.config = {
            particleCount: 150,
            emissionRate: 3,
            windForce: { x: 0.5, y: -0.2 },
            turbulence: 0.8,
            smokeColor: { r: 100, g: 100, b: 100 },
            backgroundColor: '#1a1a1a',
            fadeOutSpeed: 0.005,
            particleSize: 3
        };
        
        // Physik-Konstanten
        this.gravity = -0.05; // Rauch steigt auf
        this.airResistance = 0.98;
        this.turbulenceScale = 0.02;
        this.maxVelocity = 2;
        
        // Zeit für Turbulenz
        this.time = 0;
        
        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createSmokeSources();
        this.createGradientCache();
    }
    
    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    
    createSmokeSources() {
        this.sources = [
            {
                x: this.canvas.width * 0.3,
                y: this.canvas.height * 0.8,
                radius: 15,
                intensity: 1.0,
                color: { r: 120, g: 120, b: 120 }
            },
            {
                x: this.canvas.width * 0.7,
                y: this.canvas.height * 0.75,
                radius: 20,
                intensity: 0.8,
                color: { r: 100, g: 100, b: 100 }
            }
        ];
    }
    
    createGradientCache() {
        // Rauch-Gradienten für verschiedene Dichten vorbereiten
        for (let density = 0.1; density <= 1; density += 0.1) {
            const key = `smoke_${density.toFixed(1)}`;
            if (!this.gradientCache.has(key)) {
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
                const alpha = density * 0.3;
                gradient.addColorStop(0, `rgba(${this.config.smokeColor.r}, ${this.config.smokeColor.g}, ${this.config.smokeColor.b}, ${alpha})`);
                gradient.addColorStop(0.4, `rgba(${this.config.smokeColor.r}, ${this.config.smokeColor.g}, ${this.config.smokeColor.b}, ${alpha * 0.5})`);
                gradient.addColorStop(0.7, `rgba(${this.config.smokeColor.r}, ${this.config.smokeColor.g}, ${this.config.smokeColor.b}, ${alpha * 0.2})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.gradientCache.set(key, gradient);
            }
        }
    }
    
    createParticle(source) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * source.radius;
        
        return {
            x: source.x + Math.cos(angle) * distance,
            y: source.y + Math.sin(angle) * distance * 0.3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 1 - 0.5, // Aufwärtsbewegung
            size: Math.random() * this.config.particleSize + 1,
            life: 1.0,
            maxLife: Math.random() * 100 + 100,
            density: Math.random() * 0.5 + 0.5,
            color: {
                r: source.color.r + (Math.random() - 0.5) * 20,
                g: source.color.g + (Math.random() - 0.5) * 20,
                b: source.color.b + (Math.random() - 0.5) * 20
            },
            turbulence: {
                x: Math.random() * Math.PI * 2,
                y: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            }
        };
    }
    
    updateParticles() {
        // Neue Partikel von Quellen erzeugen
        this.sources.forEach(source => {
            const emissionCount = Math.floor(this.config.emissionRate * source.intensity);
            for (let i = 0; i < emissionCount; i++) {
                if (this.particles.length < this.config.particleCount) {
                    this.particles.push(this.createParticle(source));
                }
            }
        });
        
        // Bestehende Partikel aktualisieren
        this.particles = this.particles.filter(particle => {
            // Turbulenz anwenden
            const turbulenceX = Math.sin(this.time * particle.turbulence.speed + particle.turbulence.x) * this.config.turbulence;
            const turbulenceY = Math.cos(this.time * particle.turbulence.speed + particle.turbulence.y) * this.config.turbulence;
            
            // Physik aktualisieren
            particle.vx += this.config.windForce.x * 0.01 + turbulenceX * 0.1;
            particle.vy += this.gravity + this.config.windForce.y * 0.01 + turbulenceY * 0.1;
            
            // Luftwiderstand
            particle.vx *= this.airResistance;
            particle.vy *= this.airResistance;
            
            // Geschwindigkeit begrenzen
            particle.vx = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, particle.vx));
            particle.vy = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, particle.vy));
            
            // Position aktualisieren
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Partikel wachsen lassen (Rauch breitet sich aus)
            particle.size += 0.05;
            
            // Leben reduzieren
            particle.life -= this.config.fadeOutSpeed;
            
            // Dichte reduzieren (Rauch wird durchsichtiger)
            particle.density *= 0.995;
            
            // Partikel entfernen wenn tot oder außerhalb
            return particle.life > 0 && 
                   particle.density > 0.01 &&
                   particle.x > -50 && particle.x < this.canvas.width + 50 &&
                   particle.y > -50 && particle.y < this.canvas.height + 50;
        });
    }
    
    updateSources() {
        // Quellen leicht pulsieren lassen
        this.sources.forEach(source => {
            source.intensity = 0.8 + Math.sin(this.time * 0.02) * 0.2;
        });
    }
    
    drawBackground() {
        // Dunkler Hintergrund mit leichtem Gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, this.config.backgroundColor);
        gradient.addColorStop(1, '#0f0f0f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawSources() {
        this.sources.forEach(source => {
            // Quelle als glühender Punkt zeichnen
            this.ctx.save();
            
            // Glow-Effekt
            const glowGradient = this.ctx.createRadialGradient(
                source.x, source.y, 0,
                source.x, source.y, source.radius * 2
            );
            glowGradient.addColorStop(0, `rgba(255, 100, 50, ${source.intensity * 0.8})`);
            glowGradient.addColorStop(0.5, `rgba(255, 50, 0, ${source.intensity * 0.3})`);
            glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(source.x, source.y, source.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Kern
            this.ctx.fillStyle = `rgba(255, 200, 150, ${source.intensity})`;
            this.ctx.beginPath();
            this.ctx.arc(source.x, source.y, source.radius * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        // Partikel sortieren für richtige Überlappung (hinten nach vorne)
        this.particles.sort((a, b) => a.y - b.y);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Gradient für Partikel-Dichte
            const densityKey = `smoke_${particle.density.toFixed(1)}`;
            let gradient = this.gradientCache.get(densityKey);
            
            if (!gradient) {
                // Fallback-Gradient erstellen
                gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 10);
                const alpha = particle.density * particle.life * 0.3;
                gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
                gradient.addColorStop(0.4, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`);
                gradient.addColorStop(0.7, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.2})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            
            this.ctx.globalAlpha = particle.life * particle.density;
            this.ctx.fillStyle = gradient;
            
            // Transformieren für Partikel-Position
            this.ctx.translate(particle.x, particle.y);
            
            // Rauch-Wolke zeichnen
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size * 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Dichtere Mitte für realistischeren Look
            if (particle.density > 0.3) {
                this.ctx.globalAlpha = particle.life * particle.density * 1.5;
                this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.life * 0.2})`;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    update() {
        this.time += 0.1;
        this.updateSources();
        this.updateParticles();
    }
    
    draw() {
        this.drawBackground();
        this.drawSources();
        this.drawParticles();
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
            const mouseY = e.clientY - rect.top;
            
            // Wind basierend auf Mausposition
            this.config.windForce.x = (mouseX - this.canvas.width / 2) / (this.canvas.width / 2) * 2;
            this.config.windForce.y = (mouseY - this.canvas.height / 2) / (this.canvas.height / 2) * 1;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.config.windForce.x = 0.5;
            this.config.windForce.y = -0.2;
        });
        
        // Klick für neue Rauchquelle
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Neue Quelle hinzufügen (max 5 Quellen)
            if (this.sources.length < 5) {
                this.sources.push({
                    x: x,
                    y: y,
                    radius: Math.random() * 10 + 10,
                    intensity: 1.0,
                    color: { 
                        r: this.config.smokeColor.r + (Math.random() - 0.5) * 30,
                        g: this.config.smokeColor.g + (Math.random() - 0.5) * 30,
                        b: this.config.smokeColor.b + (Math.random() - 0.5) * 30
                    }
                });
            }
        });
        
        // Touch-Events für Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            this.config.windForce.x = (touchX - this.canvas.width / 2) / (this.canvas.width / 2) * 2;
            this.config.windForce.y = (touchY - this.canvas.height / 2) / (this.canvas.height / 2) * 1;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.config.windForce.x = 0.5;
            this.config.windForce.y = -0.2;
        });
        
        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createSmokeSources();
        });
        
        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('smoke', this);
        }
    }
    
    // Steuerungsmethoden
    setParticleCount(count) {
        this.config.particleCount = Math.max(50, Math.min(500, count));
    }
    
    setEmissionRate(rate) {
        this.config.emissionRate = Math.max(1, Math.min(10, rate));
    }
    
    setWindForce(x, y) {
        this.config.windForce.x = Math.max(-5, Math.min(5, x));
        this.config.windForce.y = Math.max(-5, Math.min(5, y));
    }
    
    setTurbulence(turbulence) {
        this.config.turbulence = Math.max(0, Math.min(2, turbulence));
    }
    
    setSmokeColor(r, g, b) {
        this.config.smokeColor = { r, g, b };
        this.createGradientCache(); // Cache neu erstellen
    }
    
    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Event-Listener entfernen
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);
        
        // Cache leeren
        this.gradientCache.clear();
        
        // Arrays leeren
        this.particles = [];
        this.sources = [];
    }
}

// Globale Initialisierungsfunktion
function initSmoke(canvasId) {
    return new Smoke(canvasId);
}

// Export für Module-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Smoke, initSmoke };
}