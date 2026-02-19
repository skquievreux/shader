/**
 * Kaleidoscope Animation
 * Erzeugt geometrische Symmetriemuster mit interaktiver Mustererzeugung
 */

import { AdaptiveQuality } from './adaptive-quality.js';

export class Kaleidoscope {
    constructor(canvasOrId) {
        // Canvas einrichten
        if (typeof canvasOrId === 'string') {
            this.canvas = document.getElementById(canvasOrId);
        } else {
            this.canvas = canvasOrId;
        }
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Performance-Optimierungen
        this.gradientCache = new Map();
        this.frameSkip = 0;
        this.lastPatternUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();

        // Parameter mit Standardwerten
        this.particles = [];
        this.patterns = [];
        this.config = {
            symmetry: 6, // Anzahl der Symmetrieachsen (4, 6, 8, 12)
            particleCount: 50,
            rotationSpeed: 0.005,
            colorScheme: 'rainbow', // rainbow, ocean, sunset, forest, cosmic
            particleSize: 3,
            trailLength: 20,
            backgroundColor: '#000000',
            pulseIntensity: 0.3
        };

        // Zeit für Animationen
        this.time = 0;
        this.rotation = 0;
        this.pulsePhase = 0;

        // Farbschemata
        this.colorSchemes = {
            rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
            ocean: ['#006994', '#0099CC', '#00B4D8', '#7FDBFF', '#B4E7FF', '#E6F3FF'],
            sunset: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD93D', '#FCE38A', '#F3E5AB'],
            forest: ['#2D5016', '#3A5F0B', '#4A7C59', '#8FBC8F', '#C5D86D', '#E8F5E9'],
            cosmic: ['#1A0033', '#330066', '#4D0099', '#6600CC', '#7F00FF', '#9933FF']
        };

        // Initialisierung
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
        this.createGradientCache();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 0.8;
    }

    createParticles() {
        this.particles = [];
        const colors = this.colorSchemes[this.config.colorScheme];

        for (let i = 0; i < this.config.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.radius * 0.8;

            this.particles.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * this.config.particleSize + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                angle: angle,
                distance: distance,
                trail: [],
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.05 + 0.02,
                orbitSpeed: (Math.random() - 0.5) * 0.02,
                orbitRadius: Math.random() * 50 + 20
            });
        }
    }

    createGradientCache() {
        // Hintergrund-Gradienten für verschiedene Farbschemata
        Object.keys(this.colorSchemes).forEach(scheme => {
            const colors = this.colorSchemes[scheme];
            const bgKey = `bg_${scheme}`;

            if (!this.gradientCache.has(bgKey)) {
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);

                // Gradient basierend auf Farbschema erstellen
                colors.forEach((color, index) => {
                    const position = index / (colors.length - 1);
                    const alpha = 0.1;
                    gradient.addColorStop(position, this.hexToRgba(color, alpha));
                });

                gradient.addColorStop(1, 'transparent');
                this.gradientCache.set(bgKey, gradient);
            }
        });

        // Partikel-Gradienten
        Object.keys(this.colorSchemes).forEach(scheme => {
            const colors = this.colorSchemes[scheme];
            colors.forEach((color, index) => {
                const particleKey = `particle_${scheme}_${index}`;
                if (!this.gradientCache.has(particleKey)) {
                    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
                    gradient.addColorStop(0, color);
                    gradient.addColorStop(0.5, this.hexToRgba(color, 0.8));
                    gradient.addColorStop(1, this.hexToRgba(color, 0));
                    this.gradientCache.set(particleKey, gradient);
                }
            });
        });
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Trail aktualisieren
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > this.config.trailLength) {
                particle.trail.shift();
            }

            // Orbit-Bewegung
            particle.angle += particle.orbitSpeed;
            const targetX = Math.cos(particle.angle) * particle.orbitRadius;
            const targetY = Math.sin(particle.angle) * particle.orbitRadius;

            // Sanfte Bewegung zum Ziel
            particle.x += (targetX - particle.x) * 0.1 + particle.vx;
            particle.y += (targetY - particle.y) * 0.1 + particle.vy;

            // Geschwindigkeit dämpfen
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Pulse-Animation
            particle.pulsePhase += particle.pulseSpeed;

            // Zufällige Geschwindigkeitsänderungen
            if (Math.random() < 0.02) {
                particle.vx += (Math.random() - 0.5) * 0.5;
                particle.vy += (Math.random() - 0.5) * 0.5;
            }

            // Innerhalb des Radius halten
            const distance = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
            if (distance > this.radius * 0.9) {
                const angle = Math.atan2(particle.y, particle.x);
                particle.x = Math.cos(angle) * this.radius * 0.9;
                particle.y = Math.sin(angle) * this.radius * 0.9;
                particle.vx *= -0.5;
                particle.vy *= -0.5;
            }
        });
    }

    drawBackground() {
        // Schwarzer Hintergrund
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtiler Gradient-Hintergrund
        const bgKey = `bg_${this.config.colorScheme}`;
        const gradient = this.gradientCache.get(bgKey);

        if (gradient) {
            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(this.rotation);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }
    }

    drawKaleidoscopeSegment(particle, segmentIndex) {
        const segmentAngle = (Math.PI * 2) / this.config.symmetry;
        const rotation = segmentAngle * segmentIndex;

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(rotation);

        // Partikel zeichnen
        this.drawParticle(particle);

        // Gespiegelten Partikel zeichnen (für Symmetrie)
        if (segmentIndex % 2 === 0) {
            this.ctx.scale(1, -1);
            this.drawParticle(particle);
        }

        this.ctx.restore();
    }

    drawParticle(particle) {
        // Trail zeichnen
        particle.trail.forEach((point, index) => {
            const alpha = (index / particle.trail.length) * 0.5;
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;

            const size = particle.size * (index / particle.trail.length) * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Hauptpartikel mit Pulse-Effekt
        const pulseFactor = 1 + Math.sin(particle.pulsePhase) * this.config.pulseIntensity;
        const size = particle.size * pulseFactor;

        this.ctx.save();

        // Glow-Effekt
        const colors = this.colorSchemes[this.config.colorScheme];
        const colorIndex = colors.indexOf(particle.color);
        const particleKey = `particle_${this.config.colorScheme}_${colorIndex}`;
        const gradient = this.gradientCache.get(particleKey);

        if (gradient) {
            this.ctx.fillStyle = gradient;
        } else {
            this.ctx.fillStyle = particle.color;
        }

        this.ctx.globalAlpha = 0.8;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Kern
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Leuchtender Mittelpunkt
        this.ctx.globalAlpha = 0.9;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawSymmetryLines() {
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.rotation);

        const segmentAngle = (Math.PI * 2) / this.config.symmetry;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.config.symmetry; i++) {
            const angle = segmentAngle * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angle) * this.radius, Math.sin(angle) * this.radius);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    update() {
        this.time += 0.016; // ~60fps
        this.rotation += this.config.rotationSpeed;
        this.pulsePhase += 0.02;

        this.updateParticles();
    }

    draw() {
        this.drawBackground();

        // Kaleidoscope-Segmente zeichnen
        for (let segment = 0; segment < this.config.symmetry; segment++) {
            this.particles.forEach(particle => {
                this.drawKaleidoscopeSegment(particle, segment);
            });
        }

        // Optionale Symmetrielinien
        if (this.time % 2 < 1) { // Blinkender Effekt
            this.drawSymmetryLines();
        }
    }

    animate() {
        if (this.adaptiveQuality && this.adaptiveQuality.shouldSkipFrame()) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.update();
        this.draw();

        this.isRunning = true;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        // Maus-Interaktion für Partikel-Erstellung
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - this.centerX;
            const mouseY = e.clientY - rect.top - this.centerY;

            // Neue Partikel an Mausposition erstellen
            const colors = this.colorSchemes[this.config.colorScheme];
            const angle = Math.atan2(mouseY, mouseX);
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

            if (distance < this.radius) {
                for (let i = 0; i < 5; i++) {
                    const particleAngle = angle + (Math.random() - 0.5) * 0.5;
                    const particleDistance = distance + (Math.random() - 0.5) * 20;

                    this.particles.push({
                        x: Math.cos(particleAngle) * particleDistance,
                        y: Math.sin(particleAngle) * particleDistance,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        size: Math.random() * this.config.particleSize + 2,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        angle: particleAngle,
                        distance: particleDistance,
                        trail: [],
                        pulsePhase: Math.random() * Math.PI * 2,
                        pulseSpeed: Math.random() * 0.05 + 0.02,
                        orbitSpeed: (Math.random() - 0.5) * 0.03,
                        orbitRadius: Math.random() * 30 + 10
                    });
                }

                // Partikelanzahl begrenzen
                if (this.particles.length > this.config.particleCount * 2) {
                    this.particles = this.particles.slice(-this.config.particleCount);
                }
            }
        });

        // Touch-Events für Mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left - this.centerX;
            const touchY = touch.clientY - rect.top - this.centerY;

            const colors = this.colorSchemes[this.config.colorScheme];
            const angle = Math.atan2(touchY, touchX);
            const distance = Math.sqrt(touchX * touchX + touchY * touchY);

            if (distance < this.radius) {
                for (let i = 0; i < 3; i++) {
                    const particleAngle = angle + (Math.random() - 0.5) * 0.5;
                    const particleDistance = distance + (Math.random() - 0.5) * 20;

                    this.particles.push({
                        x: Math.cos(particleAngle) * particleDistance,
                        y: Math.sin(particleAngle) * particleDistance,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        size: Math.random() * this.config.particleSize + 2,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        angle: particleAngle,
                        distance: particleDistance,
                        trail: [],
                        pulsePhase: Math.random() * Math.PI * 2,
                        pulseSpeed: Math.random() * 0.05 + 0.02,
                        orbitSpeed: (Math.random() - 0.5) * 0.03,
                        orbitRadius: Math.random() * 30 + 10
                    });
                }

                if (this.particles.length > this.config.particleCount * 2) {
                    this.particles = this.particles.slice(-this.config.particleCount);
                }
            }
        });

        // Window-Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        // Performance-Monitoring
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.registerAnimation('kaleidoscope', this);
        }
    }

    // Steuerungsmethoden
    setSymmetry(symmetry) {
        const validSymmetries = [4, 6, 8, 12];
        if (validSymmetries.includes(symmetry)) {
            this.config.symmetry = symmetry;
        }
    }

    setColorScheme(scheme) {
        if (this.colorSchemes[scheme]) {
            this.config.colorScheme = scheme;
            this.createGradientCache();
            this.createParticles();
        }
    }

    setRotationSpeed(speed) {
        this.config.rotationSpeed = Math.max(-0.05, Math.min(0.05, speed));
    }

    setParticleCount(count) {
        this.config.particleCount = Math.max(10, Math.min(200, count));
        this.createParticles();
    }

    setPulseIntensity(intensity) {
        this.config.pulseIntensity = Math.max(0, Math.min(1, intensity));
    }

    // Cleanup-Methode
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;

        // Event-Listener entfernen
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('resize', this.handleResize);

        // Cache leeren
        this.gradientCache.clear();

        // Arrays leeren
        this.particles = [];
        this.patterns = [];
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


