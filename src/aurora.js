/**
 * Aurora/Nordlicht-Animation
 * Erzeugt fließende, farbige Lichtbänder wie das Nordlicht
 */

import { AdaptiveQuality } from './adaptive-quality.js';

export class Aurora {
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
        this.lastWaveUpdate = 0;
        this.adaptiveQuality = new AdaptiveQuality();

        // Parameter mit Standardwerten
        this.waves = [];
        this.particles = [];
        this.intensity = 5; // 1-10
        this.speed = 3; // 1-10
        this.baseColor = '#00ff88';
        this.waveCount = 8;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseInfluence = 0;

        // Aurora-spezifische Parameter
        this.gradientColors = [
            { r: 0, g: 255, b: 136 },   // Grün
            { r: 0, g: 191, b: 255 },   // Blau
            { r: 138, g: 43, b: 226 },  // Violett
            { r: 255, g: 20, b: 147 }   // Pink
        ];

        // Canvas-Größe anpassen
        this.resize();

        // Event-Listener
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
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

        // Bei Größenänderung Wellen neu initialisieren
        if (this.waves.length > 0) {
            this.init();
        }
    }

    init() {
        // Wellen erstellen
        this.waves = [];
        for (let i = 0; i < this.waveCount; i++) {
            this.waves.push({
                points: [],
                baseY: this.canvas.height * 0.3 + (i * 30),
                amplitude: 80 + Math.random() * 40,
                frequency: 0.01 + Math.random() * 0.005,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.01,
                colorIndex: i % this.gradientColors.length,
                opacity: 0.3 + Math.random() * 0.4,
                thickness: 15 + Math.random() * 20
            });
        }

        // Partikel für zusätzliche Effekte (adaptive Anzahl)
        this.particles = [];
        const particleCount = Math.floor(50 * this.adaptiveQuality.getParticleMultiplier());
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                radius: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                colorIndex: Math.floor(Math.random() * this.gradientColors.length),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02
            });
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.mouseInfluence = 1;
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
            this.mouseInfluence = 1;
            e.preventDefault();
        }
    }

    setupControls() {
        // Steuerelemente für Intensität
        const intensitySlider = document.getElementById('aurora-intensity');
        if (intensitySlider) {
            intensitySlider.addEventListener('input', () => {
                this.intensity = parseInt(intensitySlider.value);
                this.updateIntensity();
            });
        }

        // Steuerelemente für Geschwindigkeit
        const speedSlider = document.getElementById('aurora-speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', () => {
                this.speed = parseInt(speedSlider.value);
            });
        }

        // Steuerelemente für Grundfarbe
        const colorPicker = document.getElementById('aurora-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                this.baseColor = colorPicker.value;
                this.updateBaseColor();
            });
        }
    }

    updateIntensity() {
        // Anzahl der Wellen basierend auf Intensität anpassen
        const newWaveCount = Math.floor(this.intensity * 1.2) + 3;
        if (newWaveCount !== this.waveCount) {
            this.waveCount = newWaveCount;
            this.init();
        }

        // Opazität der bestehenden Wellen anpassen
        this.waves.forEach(wave => {
            wave.opacity = (0.2 + (this.intensity / 10) * 0.6) * (0.5 + Math.random() * 0.5);
        });
    }

    updateBaseColor() {
        // Grundfarbe in RGB konvertieren
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.baseColor);
        if (result) {
            const baseR = parseInt(result[1], 16);
            const baseG = parseInt(result[2], 16);
            const baseB = parseInt(result[3], 16);

            // Farbpalette basierend auf Grundfarbe erstellen
            this.gradientColors = [
                { r: baseR, g: baseG, b: baseB },
                { r: Math.min(255, baseR + 50), g: Math.max(0, baseG - 30), b: Math.min(255, baseB + 80) },
                { r: Math.max(0, baseR - 40), g: Math.min(255, baseG + 60), b: Math.max(0, baseB - 20) },
                { r: Math.min(255, baseR + 80), g: Math.min(255, baseG + 30), b: Math.max(0, baseB - 60) }
            ];
        }
    }

    // Hilfsfunktion für smooth Interpolation
    smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }

    // Gradient-Caching für Performance
    getCachedGradient(type, x1, y1, x2, y2, colors) {
        const key = `${type}-${x1}-${y1}-${x2}-${y2}-${JSON.stringify(colors)}`;
        if (!this.gradientCache.has(key)) {
            const gradient = type === 'linear'
                ? this.ctx.createLinearGradient(x1, y1, x2, y2)
                : this.ctx.createRadialGradient(x1, y1, 0, x2, y2, Math.abs(x2 - x1) || 100);

            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color.color);
            });

            this.gradientCache.set(key, gradient);

            // Cache begrenzen
            if (this.gradientCache.size > 50) {
                const firstKey = this.gradientCache.keys().next().value;
                this.gradientCache.delete(firstKey);
            }
        }
        return this.gradientCache.get(key);
    }

    // Rauschen-Funktion für organische Bewegungen
    noise(x, y, time) {
        return Math.sin(x * 0.01 + time) * Math.cos(y * 0.008 + time * 0.7) * 0.5 + 0.5;
    }

    update() {
        this.adaptiveQuality.update();

        // Frame überspringen bei niedriger Qualität
        if (this.adaptiveQuality.shouldSkipFrame()) return;

        this.time += this.speed * 0.01;

        // Mauseinfluss verringern
        this.mouseInfluence *= 0.95;

        // Adaptive Frame-Skip basierend auf Qualität
        const frameSkipInterval = this.adaptiveQuality.getDetailLevel() > 0.7 ? 2 : 3;
        this.frameSkip++;
        if (this.frameSkip % frameSkipInterval === 0) {
            this.lastWaveUpdate = this.time;

            this.waves.forEach((wave, index) => {
                wave.phase += wave.speed * this.speed * 0.1;

                // Wellenpunkte berechnen
                wave.points = [];
                const segments = Math.floor(this.canvas.width / 8);

                for (let i = 0; i <= segments; i++) {
                    const x = (i / segments) * this.canvas.width;
                    const baseY = wave.baseY;

                    // Mehrere Sinus-Wellen für komplexere Form
                    let y = baseY;
                    y += Math.sin(x * wave.frequency + wave.phase) * wave.amplitude * 0.6;
                    y += Math.sin(x * wave.frequency * 2.1 + wave.phase * 1.3) * wave.amplitude * 0.3;
                    y += Math.sin(x * wave.frequency * 0.7 + wave.phase * 0.8) * wave.amplitude * 0.4;

                    // Rauschen hinzufügen
                    y += this.noise(x, index * 100, this.time) * 30;

                    // Mauseinfluss
                    if (this.mouseInfluence > 0.1) {
                        const mouseDistance = Math.sqrt(
                            Math.pow(x - this.mouseX, 2) + Math.pow(y - this.mouseY, 2)
                        );
                        if (mouseDistance < 150) {
                            const influence = (1 - mouseDistance / 150) * this.mouseInfluence;
                            y += Math.sin(this.time * 5) * influence * 40;
                        }
                    }

                    wave.points.push({ x, y });
                }
            });
        }

        // Partikel aktualisieren
        this.particles.forEach(particle => {
            particle.x += particle.speedX * this.speed;
            particle.y += particle.speedY * this.speed;
            particle.pulse += particle.pulseSpeed * this.speed;

            // Partikel am Rand umkehren
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y < 0 || particle.y > this.canvas.height * 0.8) {
                particle.speedY = -particle.speedY;
            }

            // Pulsieren
            particle.currentOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse));
        });
    }

    draw() {
        this.ctx.save();

        // Canvas mit dunklem Hintergrund löschen (cached)
        const bgGradient = this.getCachedGradient('linear', 0, 0, 0, this.canvas.height, [
            { color: '#0a0a1e' },
            { color: '#1a1a3e' },
            { color: '#2a2a4e' }
        ]);

        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Sterne im Hintergrund
        this.drawStars();

        // Aurora-Wellen zeichnen
        this.waves.forEach((wave) => {
            this.drawWave(wave);
        });

        // Partikel zeichnen
        this.drawParticles();

        this.ctx.restore();
    }

    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.508) % this.canvas.width; // Goldener Winkel für Verteilung
            const y = (i * 23.456) % (this.canvas.height * 0.6);
            const size = Math.sin(this.time * 0.1 + i) * 0.5 + 1;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawWave(wave) {
        if (wave.points.length < 2) return;

        const color = this.gradientColors[wave.colorIndex];

        // Mehrere Schichten für Glow-Effekt
        for (let layer = 0; layer < 3; layer++) {
            const thickness = wave.thickness + layer * 15;
            const opacity = wave.opacity * (1 - layer * 0.3) * (this.intensity / 10);

            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
            this.ctx.lineWidth = thickness;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            // Verlauf für zusätzliche Tiefe (cached)
            if (layer === 0) {
                const waveGradient = this.getCachedGradient('linear', 0, 0, this.canvas.width, 0, [
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, 0)` },
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})` },
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})` },
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, 0)` }
                ]);
                this.ctx.strokeStyle = waveGradient;
            }

            this.ctx.beginPath();
            this.ctx.moveTo(wave.points[0].x, wave.points[0].y);

            // Smooth curves mit quadratischen Bézier-Kurven
            for (let i = 1; i < wave.points.length - 1; i++) {
                const point = wave.points[i];
                const nextPoint = wave.points[i + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;

                this.ctx.quadraticCurveTo(point.x, point.y, midX, midY);
            }

            // Letzten Punkt verbinden
            const lastPoint = wave.points[wave.points.length - 1];
            this.ctx.lineTo(lastPoint.x, lastPoint.y);

            this.ctx.stroke();
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const color = this.gradientColors[particle.colorIndex];

            // Partikel mit Glow
            this.ctx.globalAlpha = particle.currentOpacity;

            // Äußerer Glow (cached)
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
            const particleGradient = this.getCachedGradient('radial',
                particle.x, particle.y, particle.x, particle.y,
                [
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.currentOpacity})` },
                    { color: `rgba(${color.r}, ${color.g}, ${color.b}, 0)` }
                ]
            );
            this.ctx.fillStyle = particleGradient;
            this.ctx.fill();

            // Innerer heller Kern
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.currentOpacity * 0.8})`;
            this.ctx.fill();

            this.ctx.globalAlpha = 1;
        });
    }

    animate() {
        this.update();
        this.draw();
        this.isRunning = true;
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
        window.removeEventListener('resize', this.resizeHandler);
        // Clean up other event listeners if they were bound to `this`
        // For now, simpler destruction
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


