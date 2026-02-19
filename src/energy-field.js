/**
 * Energiefeld-Animation
 * Erzeugt ein dynamisches Energiefeld mit bewegenden Partikeln
 */

// Spatial Grid für Performance-Optimierung
class SpatialGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    clear() {
        this.grid.clear();
    }

    addParticle(particle) {
        const key = this.getCellKey(particle.x, particle.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(particle);
    }

    getNearbyParticles(particle, maxDistance) {
        const nearby = [];
        const cellRadius = Math.ceil(maxDistance / this.cellSize);
        const particleCell = this.getCellKey(particle.x, particle.y);
        const [px, py] = particleCell.split(',').map(Number);

        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
            for (let dy = -cellRadius; dy <= cellRadius; dy++) {
                const key = `${px + dx},${py + dy}`;
                const cellParticles = this.grid.get(key);
                if (cellParticles) {
                    nearby.push(...cellParticles);
                }
            }
        }

        return nearby.filter(p => p !== particle);
    }
}

export class EnergyField {
    constructor(canvasOrId) {
        // Canvas einrichten
        if (typeof canvasOrId === 'string') {
            this.canvas = document.getElementById(canvasOrId);
        } else {
            this.canvas = canvasOrId;
        }
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Performance-Optimierungen
        this.spatialGrid = new SpatialGrid(70);
        this.gradientCache = new Map();
        this.adaptiveQuality = new AdaptiveQuality();

        // Parameter mit Standardwerten
        this.particles = [];
        this.particleCount = 200;
        this.speed = 5;
        this.baseColor = '#ff6b6b';
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 100;

        // Canvas-Größe anpassen
        this.resize();

        // Event-Listener
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));

        // Steuerelemente einrichten
        this.setupControls();

        // Animation initialisieren
        this.init();
        this.animate();
    }

    resize() {
        // Canvas auf Elterngrößen anpassen
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;

        // Bei Größenänderung Partikel neu initialisieren
        if (this.particles.length > 0) {
            this.init();
        }
    }

    init() {
        // Partikel erstellen (adaptive Anzahl)
        this.particles = [];
        const adaptiveCount = Math.floor(this.particleCount * this.adaptiveQuality.getParticleMultiplier());
        for (let i = 0; i < adaptiveCount; i++) {
            this.particles.push({
                id: i, // Eindeutige ID für Spatial Grid
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: Math.random() * this.speed - this.speed / 2,
                speedY: Math.random() * this.speed - this.speed / 2,
                lastX: 0,
                lastY: 0
            });
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
            e.preventDefault();
        }
    }

    setupControls() {
        // Steuerelemente für Partikelanzahl
        const particleSlider = document.getElementById('energy-particles');
        if (particleSlider) {
            particleSlider.addEventListener('input', () => {
                this.particleCount = parseInt(particleSlider.value);
                this.init();
            });
        }

        // Steuerelemente für Geschwindigkeit
        const speedSlider = document.getElementById('energy-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                this.speed = parseInt(speedSlider.value);
                this.init();
            });
        }

        // Steuerelemente für Farbe
        const colorPicker = document.getElementById('energy-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.baseColor = colorPicker.value;
            });
        }
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

    // Hilfsfunktion für Farbmanipulation mit Transparenz
    getColor(opacity) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.baseColor);
        if (!result) return `rgba(255, 107, 107, ${opacity})`;

        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    draw() {
        this.adaptiveQuality.update();

        // Frame überspringen bei niedriger Qualität
        if (this.adaptiveQuality.shouldSkipFrame()) return;

        this.ctx.save();

        // Canvas löschen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Spatial Grid aktualisieren
        this.spatialGrid.clear();
        this.particles.forEach(particle => {
            this.spatialGrid.addParticle(particle);
        });

        // Jedes Partikel zeichnen
        this.particles.forEach(particle => {
            // Aktuelle Position speichern
            particle.lastX = particle.x;
            particle.lastY = particle.y;

            // Position aktualisieren
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Prüfen, ob Partikel in der Nähe des Mauszeigers ist
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouseRadius) {
                // Partikel vom Mauszeiger abstoßen
                const angle = Math.atan2(dy, dx);
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                particle.speedX -= Math.cos(angle) * force * 0.5;
                particle.speedY -= Math.sin(angle) * force * 0.5;
            }

            // Geschwindigkeit begrenzen
            const maxSpeed = this.speed * 0.5;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
                particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }

            // Begrenzung am Rand des Canvas
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }

            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY = -particle.speedY;
            }

            // Partikel zeichnen
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.getColor(0.7);
            this.ctx.fill();

            // Linie zum letzten Punkt zeichnen
            const lineOpacity = Math.min(1, Math.sqrt(
                Math.pow(particle.x - particle.lastX, 2) +
                Math.pow(particle.y - particle.lastY, 2)
            ) / 5);

            if (lineOpacity > 0.1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.lastX, particle.lastY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = this.getColor(lineOpacity * 0.5);
                this.ctx.lineWidth = particle.radius * 0.5;
                this.ctx.stroke();
            }
        });

        // Verbindungen zwischen nahe gelegenen Partikeln zeichnen
        this.drawConnections();

        this.ctx.restore();
    }

    drawConnections() {
        // Maximale Distanz für Verbindungen
        const maxDistance = 70;

        // Spatial Grid für Performance verwenden
        this.particles.forEach(particle => {
            const nearbyParticles = this.spatialGrid.getNearbyParticles(particle, maxDistance);

            nearbyParticles.forEach(otherParticle => {
                // Vermeide doppelte Verbindungen
                if (particle.id < otherParticle.id) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Transparenz basierend auf Distanz
                        const opacity = (1 - distance / maxDistance) * 0.3;

                        // Linie zeichnen
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.strokeStyle = this.getColor(opacity);
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });
        });
    }

    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Cleanup Methode für Memory Management
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;

        this.gradientCache.clear();
        this.spatialGrid.clear();
        window.removeEventListener('resize', () => this.resize());
        this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.removeEventListener('touchmove', (e) => this.handleTouchMove(e));
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }

    resume() {
        if (!this.isRunning) {
            this.animate();
        }
    }
}

// Funktion zum Initialisieren der Animation
function initEnergyField(canvasId) {
    return new EnergyField(canvasId);
}

// Automatische Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('energy-field-canvas');
    if (canvas) {
        console.log('Energy field canvas found, initializing animation...');
        try {
            window.energyFieldAnimation = initEnergyField('energy-field-canvas');
        } catch (e) {
            console.error('Error initializing energy field animation:', e);
        }
    } else {
        console.error('Energy field canvas element not found');
    }
});