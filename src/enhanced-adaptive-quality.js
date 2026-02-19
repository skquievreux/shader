/**
 * Enhanced Adaptive Quality System für Shader Animationen
 * Intelligente Qualitätsanpassung basierend auf System-Performance und Nutzeranzahl
 */

class EnhancedAdaptiveQuality {
    constructor() {
        // Basis Qualitäts-Level
        this.qualityLevels = {
            ultra: {
                particleMultiplier: 1.5,
                frameSkip: 1,
                detailLevel: 1.0,
                maxAnimations: 10,
                gradientCache: 100
            },
            high: {
                particleMultiplier: 1.0,
                frameSkip: 1,
                detailLevel: 1.0,
                maxAnimations: 5,
                gradientCache: 50
            },
            medium: {
                particleMultiplier: 0.75,
                frameSkip: 2,
                detailLevel: 0.75,
                maxAnimations: 3,
                gradientCache: 30
            },
            low: {
                particleMultiplier: 0.5,
                frameSkip: 3,
                detailLevel: 0.5,
                maxAnimations: 2,
                gradientCache: 20
            },
            emergency: {
                particleMultiplier: 0.25,
                frameSkip: 5,
                detailLevel: 0.25,
                maxAnimations: 1,
                gradientCache: 10
            }
        };

        // Aktuelle Qualität
        this.quality = 'high';
        this.targetQuality = 'high';

        // Nutzer-Schwellenwerte
        this.userThresholds = {
            solo: 1,        // Einzel-Nutzer
            small: 10,      // Kleine Gruppe
            medium: 50,     // Mittlere Gruppe
            large: 100,     // Große Gruppe
            massive: 1000    // Sehr große Gruppe
        };

        // Device-Kapazitäten
        this.deviceCapabilities = this.detectDeviceCapabilities();

        // Performance-Metriken
        this.metrics = {
            fps: 60,
            memoryUsage: 0,
            cpuUsage: 0,
            thermalState: 'nominal',
            batteryLevel: 1.0
        };

        // Anpassungs-Intervalle
        this.adjustmentInterval = 2000; // 2 Sekunden
        this.lastAdjustment = 0;

        // Callbacks für Qualitätsänderungen
        this.qualityChangeCallbacks = [];

        // Performance Monitor Integration
        this.setupPerformanceMonitoring();

        // Battery API Integration
        this.setupBatteryMonitoring();

        // Animation-spezifische Performance-Profile
        this.animationProfiles = {
            // Hohe Performance-Anforderungen
            'plasma': { baseQuality: 'medium', gpuIntensive: true, frameSkipMultiplier: 1.5 },
            'lightning': { baseQuality: 'medium', cpuIntensive: true, frameSkipMultiplier: 1.2 },
            'matrix-rain': { baseQuality: 'high', textIntensive: true, fontCacheMultiplier: 1.3 },

            // Mittlere Performance-Anforderungen
            'smoke': { baseQuality: 'high', particleIntensive: true, particleMultiplier: 0.8 },
            'kaleidoscope': { baseQuality: 'high', calculationIntensive: true, detailMultiplier: 0.9 },
            'fractal-tree': { baseQuality: 'high', recursiveIntensive: true, depthMultiplier: 0.8 },

            // Niedrige Performance-Anforderungen
            'star-field': { baseQuality: 'high', particleIntensive: false, particleMultiplier: 1.2 },
            'rain': { baseQuality: 'high', particleIntensive: true, particleMultiplier: 0.9 },
            'chakra-animation': { baseQuality: 'high', calculationIntensive: false, detailMultiplier: 1.0 }
        };

        // Start der automatischen Anpassung
        this.startAdaptiveAdjustment();
    }

    /**
     * Erkennt Device-Kapazitäten
     */
    detectDeviceCapabilities() {
        return {
            memory: navigator.deviceMemory || 4,
            cores: navigator.hardwareConcurrency || 4,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : { effectiveType: '4g', downlink: 10, rtt: 50 },
            gpu: this.detectGPUCapabilities(),
            screen: {
                width: screen.width,
                height: screen.height,
                pixelRatio: window.devicePixelRatio || 1
            }
        };
    }

    /**
     * Erkennt GPU-Kapazitäten
     */
    detectGPUCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            return { available: false, renderer: 'none' };
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ?
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) :
            gl.getParameter(gl.RENDERER);

        return {
            available: true,
            renderer: renderer,
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
        };
    }

    /**
     * Setup für Performance Monitoring
     */
    setupPerformanceMonitoring() {
        if (window.PerformanceMonitor) {
            // Auf Performance Monitor Events lauschen
            window.PerformanceMonitor.onAlert('lowFPS', (data) => {
                this.handleLowFPS(data);
            });

            window.PerformanceMonitor.onAlert('memoryExhausted', (data) => {
                this.handleMemoryExhausted(data);
            });

            window.PerformanceMonitor.onAlert('criticalLatency', (data) => {
                this.handleCriticalLatency(data);
            });
        }
    }

    /**
     * Setup für Battery Monitoring
     */
    setupBatteryMonitoring() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.metrics.batteryLevel = battery.level;

                battery.addEventListener('levelchange', () => {
                    this.metrics.batteryLevel = battery.level;
                    this.adjustForBatteryLevel();
                });

                battery.addEventListener('chargingchange', () => {
                    this.adjustForChargingState(battery.charging);
                });
            }).catch(() => {
                console.log('🔋 Battery API nicht verfügbar');
            });
        }
    }

    /**
     * Startet die adaptive Qualitätsanpassung
     */
    startAdaptiveAdjustment() {
        setInterval(() => {
            this.performQualityAdjustment();
        }, this.adjustmentInterval);
    }

    /**
     * Führt Qualitätsanpassung durch
     */
    performQualityAdjustment() {
        const now = performance.now();
        if (now - this.lastAdjustment < this.adjustmentInterval) {
            return;
        }

        // Aktuelle Metriken sammeln
        this.collectMetrics();

        // Ziel-Qualität berechnen
        this.targetQuality = this.calculateOptimalQuality();

        // Qualität anpassen, falls nötig
        if (this.targetQuality !== this.quality) {
            this.adjustQuality(this.targetQuality);
        }

        this.lastAdjustment = now;
    }

    /**
     * Sammelt aktuelle Performance-Metriken
     */
    collectMetrics() {
        if (window.PerformanceMonitor) {
            const monitorMetrics = window.PerformanceMonitor.getMetrics();
            this.metrics.fps = monitorMetrics.fps;
            this.metrics.memoryUsage = monitorMetrics.memoryUsage;
        }
    }

    /**
     * Berechnet die optimale Qualität
     */
    calculateOptimalQuality() {
        let quality = 'high';

        // 1. FPS-basierte Anpassung
        if (this.metrics.fps < 20) {
            quality = 'emergency';
        } else if (this.metrics.fps < 30) {
            quality = 'low';
        } else if (this.metrics.fps < 45) {
            quality = 'medium';
        }

        // 2. Memory-basierte Anpassung
        if (this.metrics.memoryUsage > 0.9) {
            quality = 'emergency';
        } else if (this.metrics.memoryUsage > 0.7) {
            quality = Math.min(quality, 'low');
        }

        // 3. Device-basierte Anpassung
        const deviceQuality = this.getDeviceBasedQuality();
        quality = Math.min(quality, deviceQuality);

        // 4. Battery-basierte Anpassung
        if (this.metrics.batteryLevel < 0.2) {
            quality = Math.min(quality, 'low');
        }

        // 5. Nutzeranzahl-basierte Anpassung
        const userQuality = this.getUserBasedQuality();
        quality = Math.min(quality, userQuality);

        return quality;
    }

    /**
     * Gibt device-basierte Qualität zurück
     */
    getDeviceBasedQuality() {
        const caps = this.deviceCapabilities;

        // Low-End Devices
        if (caps.memory <= 2 || caps.cores <= 2) {
            return 'low';
        }

        // Mid-Range Devices
        if (caps.memory <= 4 || caps.cores <= 4) {
            return 'medium';
        }

        // High-End Devices
        if (caps.memory >= 8 && caps.cores >= 8 && caps.gpu.available) {
            return 'ultra';
        }

        return 'high';
    }

    /**
     * Gibt nutzeranzahl-basierte Qualität zurück
     */
    getUserBasedQuality() {
        // Implementierung mit User Count Detection
        const userCount = this.getConcurrentUserCount();

        if (userCount >= this.userThresholds.massive) {
            return 'emergency';
        } else if (userCount >= this.userThresholds.large) {
            return 'low';
        } else if (userCount >= this.userThresholds.medium) {
            return 'medium';
        } else if (userCount >= this.userThresholds.small) {
            return 'high';
        }

        return 'ultra';
    }

    /**
     * Gibt aktuelle Nutzeranzahl zurück (Platzhalter)
     */
    getConcurrentUserCount() {
        // TODO: Implementierung mit WebSocket oder Server-Sync
        return 1; // Derzeit nur lokaler Nutzer
    }

    /**
     * Passt Qualität an
     */
    adjustQuality(newQuality) {
        const oldQuality = this.quality;
        this.quality = newQuality;

        console.log(`🎯 Qualität angepasst: ${oldQuality} → ${newQuality}`);

        // Callbacks auslösen
        this.qualityChangeCallbacks.forEach(callback => {
            callback(newQuality, oldQuality, this.qualityLevels[newQuality]);
        });

        // UI aktualisieren
        this.updateQualityUI();
    }

    /**
     * Behandelt niedrige FPS
     */
    handleLowFPS(data) {
        console.warn('⚡ Niedrige FPS erkannt:', data);

        // Sofortige Qualitätsreduzierung
        if (this.quality !== 'emergency') {
            this.adjustQuality('low');
        }
    }

    /**
     * Behandelt Memory-Exhaustion
     */
    handleMemoryExhausted(data) {
        console.warn('💾 Memory Exhaustion erkannt:', data);

        // Sofortige Qualitätsreduzierung
        this.adjustQuality('emergency');

        // Garbage Collection anfordern
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Behandelt kritische Latenz
     */
    handleCriticalLatency(data) {
        console.warn('🌐 Kritische Latenz erkannt:', data);

        // Qualität reduzieren für bessere Performance
        this.adjustQuality('medium');
    }

    /**
     * Passt Qualität an Batteriestand an
     */
    adjustForBatteryLevel() {
        if (this.metrics.batteryLevel < 0.1) {
            this.adjustQuality('emergency');
        } else if (this.metrics.batteryLevel < 0.2) {
            this.adjustQuality('low');
        }
    }

    /**
     * Passt Qualität an Ladezustand an
     */
    adjustForChargingState(isCharging) {
        if (isCharging && this.quality === 'emergency') {
            // Qualität erhöhen beim Laden
            this.adjustQuality('low');
        }
    }

    /**
     * Registriert Callback für Qualitätsänderungen
     */
    onQualityChange(callback) {
        this.qualityChangeCallbacks.push(callback);
    }

    /**
     * Entfernt Callback für Qualitätsänderungen
     */
    offQualityChange(callback) {
        const index = this.qualityChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.qualityChangeCallbacks.splice(index, 1);
        }
    }

    /**
     * Gibt aktuelle Qualitätseinstellungen zurück
     */
    getCurrentQuality() {
        return this.qualityLevels[this.quality];
    }

    /**
     * Gibt Partikel-Multiplikator zurück
     */
    getParticleMultiplier() {
        return this.qualityLevels[this.quality].particleMultiplier;
    }

    /**
     * Prüft ob Frame übersprungen werden soll
     */
    shouldSkipFrame() {
        const currentLevel = this.qualityLevels[this.quality];
        return this.frameCount % currentLevel.frameSkip !== 0;
    }

    /**
     * Gibt Detail-Level zurück
     */
    getDetailLevel() {
        return this.qualityLevels[this.quality].detailLevel;
    }

    /**
     * Gibt Animation-spezifische Qualitätseinstellungen zurück
     */
    getAnimationQuality(animationId) {
        const profile = this.animationProfiles[animationId];
        if (!profile) {
            return this.getCurrentQuality();
        }

        const baseQuality = this.qualityLevels[profile.baseQuality] || this.getCurrentQuality();
        const currentQuality = this.getCurrentQuality();

        // Kombiniere Basis-Qualität mit aktueller System-Qualität
        return {
            particleMultiplier: baseQuality.particleMultiplier * currentQuality.particleMultiplier * (profile.particleMultiplier || 1.0),
            frameSkip: Math.max(baseQuality.frameSkip, currentQuality.frameSkip) * (profile.frameSkipMultiplier || 1.0),
            detailLevel: baseQuality.detailLevel * currentQuality.detailLevel * (profile.detailMultiplier || 1.0),
            maxAnimations: Math.min(baseQuality.maxAnimations, currentQuality.maxAnimations),
            gradientCache: Math.max(baseQuality.gradientCache, currentQuality.gradientCache),
            gpuIntensive: profile.gpuIntensive || false,
            cpuIntensive: profile.cpuIntensive || false,
            textIntensive: profile.textIntensive || false
        };
    }

    /**
     * Gibt maximale Animationen zurück
     */
    getMaxAnimations() {
        return this.qualityLevels[this.quality].maxAnimations;
    }

    /**
     * Gibt maximale Cache-Größe zurück
     */
    getMaxCacheSize() {
        return this.qualityLevels[this.quality].gradientCache;
    }

    /**
     * Aktualisiert Quality UI
     */
    updateQualityUI() {
        // Quality Indicator aktualisieren
        const indicator = document.getElementById('quality-indicator');
        if (indicator) {
            indicator.textContent = this.quality.toUpperCase();
            indicator.className = `quality-indicator quality-${this.quality}`;
        }

        // Quality Slider aktualisieren
        const slider = document.getElementById('quality-slider');
        if (slider) {
            const qualityOrder = ['emergency', 'low', 'medium', 'high', 'ultra'];
            slider.value = qualityOrder.indexOf(this.quality);
        }
    }

    /**
     * Manuelles Qualitäts-Override
     */
    setManualQuality(quality) {
        if (this.qualityLevels[quality]) {
            this.targetQuality = quality;
            this.adjustQuality(quality);
        }
    }

    /**
     * Setzt Qualität auf Auto-Modus
     */
    setAutoQuality() {
        this.startAdaptiveAdjustment();
    }

    /**
     * Generiert Performance Report
     */
    generateQualityReport() {
        return {
            currentQuality: this.quality,
            targetQuality: this.targetQuality,
            deviceCapabilities: this.deviceCapabilities,
            metrics: this.metrics,
            qualityLevels: this.qualityLevels,
            recommendations: this.generateQualityRecommendations()
        };
    }

    /**
     * Generiert Qualitäts-Empfehlungen
     */
    generateQualityRecommendations() {
        const recommendations = [];

        if (this.quality === 'emergency') {
            recommendations.push({
                type: 'performance',
                message: 'System im Emergency Mode. Schließen Sie andere Tabs.',
                action: 'close_tabs'
            });
        }

        if (this.deviceCapabilities.memory <= 2) {
            recommendations.push({
                type: 'hardware',
                message: 'Geringer Memory. Upgrade empfohlen für bessere Performance.',
                action: 'upgrade_hardware'
            });
        }

        if (this.metrics.batteryLevel < 0.3) {
            recommendations.push({
                type: 'battery',
                message: 'Niedriger Batteriestand. Laden Sie das Gerät.',
                action: 'charge_device'
            });
        }

        return recommendations;
    }
}

// Globale Instanz erstellen
window.EnhancedAdaptiveQuality = new EnhancedAdaptiveQuality();