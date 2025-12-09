/**
 * Feuerwerk-Animation
 * Erzeugt Feuerwerkseffekte mit konfigurierbaren Eigenschaften
 */

// Particle Pool für Performance-Optimierung
class ParticlePool {
    constructor(initialSize = 200) {
        this.pool = [];
        this.active = [];
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: 0,
            y: 0,
            radius: 1,
            color: '#ffffff',
            speed: 0,
            angle: 0,
            friction: 0.98,
            gravity: 0.1,
            alpha: 1,
            decay: 0.02,
            brightnessFactor: 100,
            active: false
        };
    }
    
    get() {
        let particle;
        if (this.pool.length > 0) {
            particle = this.pool.pop();
        } else {
            particle = this.createParticle();
        }
        particle.active = true;
        this.active.push(particle);
        return particle;
    }
    
    release(particle) {
        const index = this.active.indexOf(particle);
        if (index !== -1) {
            this.active.splice(index, 1);
            particle.active = false;
            this.pool.push(particle);
        }
    }
    
    updateAll() {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const particle = this.active[i];
            
            // Bewegung und Schwerkraft anwenden
            particle.speed *= particle.friction;
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed + particle.gravity;
            
            // Transparenz verringern
            particle.alpha -= particle.decay;
            
            // Partikel entfernen, wenn nicht mehr sichtbar
            if (particle.alpha <= 0.05) {
                this.release(particle);
            }
        }
    }
    
    drawAll(ctx) {
        this.active.forEach(particle => {
            ctx.globalAlpha = particle.alpha;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Leuchten um die Partikel
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, particle.radius * 0.5,
                particle.x, particle.y, particle.radius * 2
            );
            
            const glowColor = particle.color === '#FFFFFF' ? 'rgba(255, 255, 255, ' : 
                                (particle.color === '#FFF9C4' ? 'rgba(255, 249, 196, ' : 
                                particle.color.replace('rgb', 'rgba').replace(')', ', '));
                                
            gradient.addColorStop(0, glowColor + (particle.alpha * 0.6) + ')');
            gradient.addColorStop(1, glowColor + '0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}

class Firework {
    constructor(canvasId) {
        // Canvas einrichten
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Performance-Optimierungen
        this.particlePool = new ParticlePool(200);
        this.gradientCache = new Map();
        this.adaptiveQuality = new AdaptiveQuality();
        
        // Parameter mit Standardwerten
        this.rockets = [];
        this.frequency = 3; // 1-10
        this.particleSize = 100; // 20-200
        this.baseColor = '#cc5de8';
        this.lastRocket = 0;
        
        // Canvas-Größe anpassen
        this.resize();
        
        // Event-Listener
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.launchRocket(e.clientX, e.clientY));
        
        // Steuerelemente einrichten
        this.setupControls();
        
        // Animation starten
        this.animate();
    }
    
    resize() {
        // Canvas auf Elterngrößen anpassen
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    
    setupControls() {
        // Steuerelemente für Häufigkeit
        const frequencySlider = document.getElementById('firework-frequency');
        if (frequencySlider) {
            frequencySlider.addEventListener('input', () => {
                this.frequency = parseInt(frequencySlider.value);
            });
        }
        
        // Steuerelemente für Partikelgröße
        const particleSlider = document.getElementById('firework-particles');
        if (particleSlider) {
            particleSlider.addEventListener('input', () => {
                this.particleSize = parseInt(particleSlider.value);
            });
        }
        
        // Steuerelemente für Grundfarbe
        const colorPicker = document.getElementById('firework-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.baseColor = colorPicker.value;
            });
        }
    }
    
    // Rakete an zufälliger Position starten
    createRandomRocket() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        
        return this.createRocket(x, y);
    }
    
    // Rakete an bestimmter Position erstellen
    createRocket(x, y) {
        const targetX = x;
        const targetY = Math.random() * (this.canvas.height * 0.5);
        
        const rocket = {
            x,
            y,
            targetX,
            targetY,
            color: this.getRandomColorVariation(),
            radius: 2,
            speed: Math.random() * 1 + 2,
            trail: [],
            maxTrailLength: 10,
            angle: Math.atan2(targetY - y, targetX - x),
            exploded: false
        };
        
        this.rockets.push(rocket);
        return rocket;
    }
    
    // Rakete auf Klick starten
    launchRocket(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = this.canvas.height;
        const targetY = clientY - rect.top;
        
        const rocket = this.createRocket(x, y);
        rocket.targetY = targetY;
        rocket.angle = Math.atan2(targetY - y, 0);
    }
    
    // Funktion zur Farbvariation
    getRandomColorVariation() {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.baseColor);
        if (!result) return '#cc5de8';
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        // Zufällige Variation der Grundfarbe
        const variation = 50;
        const newR = Math.min(255, Math.max(0, r + Math.floor(Math.random() * variation * 2) - variation));
        const newG = Math.min(255, Math.max(0, g + Math.floor(Math.random() * variation * 2) - variation));
        const newB = Math.min(255, Math.max(0, b + Math.floor(Math.random() * variation * 2) - variation));
        
        return `rgb(${newR}, ${newG}, ${newB})`;
    }
    
// Gradient-Caching für Performance
    getCachedGradient(type, x1, y1, x2, y2, colors) {
        const key = `${type}-${x1}-${y1}-${x2}-${y2}-${JSON.stringify(colors)}`;
        if (!this.gradientCache.has(key)) {
            const gradient = type === 'linear' 
                ? this.ctx.createLinearGradient(x1, y1, x2, y2)
                : this.ctx.createRadialGradient(x1, y1, colors[0].radius || 0, x2, y2, colors[0].radius || 100);
            
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color.color);
            });
            
            this.gradientCache.set(key, gradient);
            
            // Cache begrenzen
            if (this.gradientCache.size > 30) {
                const firstKey = this.gradientCache.keys().next().value;
                this.gradientCache.delete(firstKey);
            }
        }
        return this.gradientCache.get(key);
    }

    // Rakete explodieren lassen
    explodeRocket(rocket) {
        const baseParticleCount = Math.floor(this.particleSize / 10) + 10;
        const particleCount = Math.floor(baseParticleCount * this.adaptiveQuality.getParticleMultiplier());
        
        // Basisfarbe für die Explosion
        const mainColor = rocket.color;
        
        // Verschiedene Partikelarten erzeugen mit Pooling
        for (let i = 0; i < particleCount; i++) {
            const speed = Math.random() * 3 + 2;
            const angle = Math.random() * Math.PI * 2;
            
            // Hauptpartikel
            const particle1 = this.particlePool.get();
            particle1.x = rocket.x;
            particle1.y = rocket.y;
            particle1.radius = Math.random() * 2 + 1;
            particle1.color = i % 3 === 0 ? '#FFFFFF' : mainColor;
            particle1.speed = speed;
            particle1.angle = angle;
            particle1.friction = 0.98;
            particle1.gravity = 0.1;
            particle1.alpha = 1;
            particle1.decay = Math.random() * 0.01 + 0.02;
            particle1.brightnessFactor = Math.random() * 50 + 50;
            
            // Zweite Schicht von Partikeln (weniger, schneller verblassend)
            if (i % 3 === 0) {
                const particle2 = this.particlePool.get();
                particle2.x = rocket.x;
                particle2.y = rocket.y;
                particle2.radius = Math.random() * 1.5 + 0.5;
                particle2.color = i % 2 === 0 ? '#FFF9C4' : this.getRandomColorVariation();
                particle2.speed = speed * 1.3;
                particle2.angle = angle + (Math.random() * 0.2 - 0.1);
                particle2.friction = 0.95;
                particle2.gravity = 0.1;
                particle2.alpha = 1;
                particle2.decay = Math.random() * 0.02 + 0.03;
                particle2.brightnessFactor = Math.random() * 30 + 70;
            }
        }
        
        // Soundeffekt hinzufügen, wenn gewünscht
        // this.playExplosionSound();
        
        rocket.exploded = true;
    }
    
update() {
        this.adaptiveQuality.update();
        
        // Frame überspringen bei niedriger Qualität
        if (this.adaptiveQuality.shouldSkipFrame()) return;
        
        // Aktuelle Zeit ermitteln
        const now = Date.now();
        
        // Neue Rakete basierend auf Frequenz starten
        if (now - this.lastRocket > (11 - this.frequency) * 300) {
            this.createRandomRocket();
            this.lastRocket = now;
        }
        
        // Raketen aktualisieren
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const rocket = this.rockets[i];
            
            // Weg zur Zielposition berechnen
            const dx = rocket.targetX - rocket.x;
            const dy = rocket.targetY - rocket.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Wenn die Rakete ihr Ziel erreicht hat oder zu lange fliegt
            if (distance < 5 || rocket.y < rocket.targetY) {
                if (!rocket.exploded) {
                    this.explodeRocket(rocket);
                }
                this.rockets.splice(i, 1);
                continue;
            }
            
            // Raketenbewegung
            rocket.x += Math.cos(rocket.angle) * rocket.speed;
            rocket.y += Math.sin(rocket.angle) * rocket.speed;
            
            // Trail speichern
            rocket.trail.push({ x: rocket.x, y: rocket.y });
            if (rocket.trail.length > rocket.maxTrailLength) {
                rocket.trail.shift();
            }
        }
        
// Partikel mit Pooling aktualisieren
        this.particlePool.updateAll();
    }
    
draw() {
        this.ctx.save();
        
        // Canvas löschen mit leichter Transparenz für Nachleuchten
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Raketen zeichnen
        this.rockets.forEach(rocket => {
            // Raketenkörper
            this.ctx.beginPath();
            this.ctx.arc(rocket.x, rocket.y, rocket.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = rocket.color;
            this.ctx.fill();
            
            // Raketenschweif
            if (rocket.trail.length > 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
                
                for (let i = 1; i < rocket.trail.length; i++) {
                    const point = rocket.trail[i];
                    this.ctx.lineTo(point.x, point.y);
                }
                
                this.ctx.strokeStyle = rocket.color;
                this.ctx.lineWidth = rocket.radius * 0.7;
                this.ctx.stroke();
            }
        });
        
        // Partikel mit Pooling zeichnen
        this.particlePool.drawAll(this.ctx);
        
        this.ctx.restore();
    }
    
animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Cleanup Methode für Memory Management
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.gradientCache.clear();
        this.particlePool.active.forEach(particle => {
            this.particlePool.release(particle);
        });
        window.removeEventListener('resize', () => this.resize());
        this.canvas.removeEventListener('click', (e) => this.launchRocket(e.clientX, e.clientY));
    }
}

// Funktion zum Initialisieren der Animation
function initFirework(canvasId) {
    return new Firework(canvasId);
}

// Automatische Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('firework-canvas');
    if (canvas) {
        console.log('Firework canvas found, initializing animation...');
        try {
            window.fireworkAnimation = initFirework('firework-canvas');
        } catch (e) {
            console.error('Error initializing firework animation:', e);
        }
    } else {
        console.error('Firework canvas element not found');
    }
});