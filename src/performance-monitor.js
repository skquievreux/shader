/**
 * Performance Monitoring System für Shader Animationen
 * Überwacht System-Performance und Nutzer-Verhalten in Echtzeit
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            // Performance Metriken
            fps: 60,
            frameCount: 0,
            lastFrameTime: performance.now(),

            // Nutzer Metriken
            concurrentUsers: 1,
            activeAnimations: 0,
            totalSessions: 0,

            // System Metriken
            memoryUsage: 0,
            cpuUsage: 0,
            networkLatency: 0,

            // Fehler Metriken
            errorRate: 0,
            errorCount: 0,
            totalRequests: 0,

            // User Experience Metriken
            bounceRate: 0,
            averageSessionTime: 0,
            interactionRate: 0
        };

        // Alert Schwellenwerte
        this.alerts = {
            criticalLatency: 2000,    // 2 Sekunden
            lowFPS: 25,               // unter 25 FPS
            highErrorRate: 0.05,       // 5% Fehler
            memoryExhausted: 0.8,      // 80% Memory
            cpuOverload: 0.8           // 80% CPU
        };

        // Monitoring Intervalle
        this.intervals = {
            fps: 100,                  // alle 100ms
            memory: 5000,              // alle 5 Sekunden
            network: 10000,            // alle 10 Sekunden
            analytics: 30000            // alle 30 Sekunden
        };

        // Callbacks für Alerts
        this.alertCallbacks = new Map();

        // Historische Daten für Trends
        this.history = {
            fps: [],
            memory: [],
            users: [],
            errors: []
        };

        // Maximale History Länge
        this.maxHistoryLength = 100;

        this.startMonitoring();
    }

    /**
     * Startet das Performance Monitoring
     */
    startMonitoring() {
        console.log('🔍 Performance Monitor gestartet');

        // FPS Monitoring
        this.fpsInterval = setInterval(() => {
            this.updateFPS();
        }, this.intervals.fps);

        // Memory Monitoring
        this.memoryInterval = setInterval(() => {
            this.updateMemoryUsage();
        }, this.intervals.memory);

        // Network Monitoring
        this.networkInterval = setInterval(() => {
            this.updateNetworkLatency();
        }, this.intervals.network);

        // Analytics Update
        this.analyticsInterval = setInterval(() => {
            this.updateAnalytics();
        }, this.intervals.analytics);

        // User Session Tracking
        this.trackUserSession();

        // Error Tracking
        this.setupErrorTracking();
    }

    /**
     * Aktualisiert die FPS-Messung
     */
    updateFPS() {
        const now = performance.now();
        const delta = now - this.metrics.lastFrameTime;

        if (delta >= 1000) {
            this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / delta);

            // History aktualisieren
            this.history.fps.push({
                timestamp: now,
                value: this.metrics.fps
            });

            if (this.history.fps.length > this.maxHistoryLength) {
                this.history.fps.shift();
            }

            // FPS Alert prüfen
            if (this.metrics.fps < this.alerts.lowFPS) {
                this.triggerAlert('lowFPS', {
                    current: this.metrics.fps,
                    threshold: this.alerts.lowFPS
                });
            }

            this.metrics.frameCount = 0;
            this.metrics.lastFrameTime = now;
        }

        this.metrics.frameCount++;
    }

    /**
     * Aktualisiert die Memory-Nutzung
     */
    updateMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

            // History aktualisieren
            this.history.memory.push({
                timestamp: performance.now(),
                value: this.metrics.memoryUsage
            });

            if (this.history.memory.length > this.maxHistoryLength) {
                this.history.memory.shift();
            }

            // Memory Alert prüfen
            if (this.metrics.memoryUsage > this.alerts.memoryExhausted) {
                this.triggerAlert('memoryExhausted', {
                    current: this.metrics.memoryUsage,
                    threshold: this.alerts.memoryExhausted
                });
            }
        }
    }

    /**
     * Aktualisiert die Netzwerk-Latenz
     */
    updateNetworkLatency() {
        const startTime = performance.now();

        fetch(window.location.href, {
            method: 'HEAD',
            cache: 'no-cache'
        })
            .then(() => {
                const latency = performance.now() - startTime;
                this.metrics.networkLatency = latency;

                // Latency Alert prüfen
                if (latency > this.alerts.criticalLatency) {
                    this.triggerAlert('criticalLatency', {
                        current: latency,
                        threshold: this.alerts.criticalLatency
                    });
                }
            })
            .catch(() => {
                // Network Fehler ignorieren für Latenz-Messung
            });
    }

    /**
     * Aktualisiert Analytics-Daten
     */
    updateAnalytics() {
        // Durchschnittliche Session Time berechnen
        if (this.metrics.totalSessions > 0) {
            this.metrics.averageSessionTime = this.calculateAverageSessionTime();
        }

        // Interaction Rate berechnen
        this.metrics.interactionRate = this.calculateInteractionRate();

        // Analytics Event senden
        this.sendAnalyticsEvent();
    }

    /**
     * Registriert eine Animation
     */
    registerAnimation(animationId, animationType) {
        this.metrics.activeAnimations++;

        console.log(`📊 Animation registriert: ${animationType} (${animationId})`);
        console.log(`📈 Aktive Animationen: ${this.metrics.activeAnimations}`);
    }

    /**
     * Deregistriert eine Animation
     */
    unregisterAnimation(animationId) {
        this.metrics.activeAnimations = Math.max(0, this.metrics.activeAnimations - 1);

        console.log(`📊 Animation deregistriert: ${animationId}`);
        console.log(`📈 Aktive Animationen: ${this.metrics.activeAnimations}`);
    }

    /**
     * Verfolgt Nutzer-Sessions
     */
    trackUserSession() {
        this.metrics.totalSessions++;

        // Session Startzeit speichern
        sessionStorage.setItem('sessionStart', Date.now());

        // Session Endzeit tracken
        window.addEventListener('beforeunload', () => {
            const sessionStart = parseInt(sessionStorage.getItem('sessionStart') || Date.now());
            const sessionDuration = Date.now() - sessionStart;

            // Session Dauer speichern für Analytics
            this.saveSessionData(sessionDuration);
        });
    }

    /**
     * Setup für Error Tracking
     */
    setupErrorTracking() {
        window.addEventListener('error', () => {
            this.metrics.errorCount++;
            this.metrics.totalRequests++;
            this.updateErrorRate();
        });

        window.addEventListener('unhandledrejection', () => {
            this.metrics.errorCount++;
            this.metrics.totalRequests++;
            this.updateErrorRate();
        });
    }

    /**
     * Aktualisiert die Fehler-Rate
     */
    updateErrorRate() {
        this.metrics.errorRate = this.metrics.errorCount / this.metrics.totalRequests;

        // Error Rate Alert prüfen
        if (this.metrics.errorRate > this.alerts.highErrorRate) {
            this.triggerAlert('highErrorRate', {
                current: this.metrics.errorRate,
                threshold: this.alerts.highErrorRate
            });
        }
    }

    /**
     * Löst einen Alert aus
     */
    triggerAlert(alertType, data) {
        console.warn(`⚠️ Performance Alert: ${alertType}`, data);

        // Callback ausführen, falls vorhanden
        if (this.alertCallbacks.has(alertType)) {
            this.alertCallbacks.get(alertType)(data);
        }

        // Alert History speichern
        this.history.errors.push({
            timestamp: performance.now(),
            type: alertType,
            data: data
        });

        if (this.history.errors.length > this.maxHistoryLength) {
            this.history.errors.shift();
        }
    }

    /**
     * Registriert einen Alert Callback
     */
    onAlert(alertType, callback) {
        this.alertCallbacks.set(alertType, callback);
    }

    /**
     * Entfernt einen Alert Callback
     */
    offAlert(alertType) {
        this.alertCallbacks.delete(alertType);
    }

    /**
     * Gibt aktuelle Performance-Metriken zurück
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Gibt historische Daten zurück
     */
    getHistory(type = null) {
        if (type && this.history[type]) {
            return this.history[type];
        }
        return this.history;
    }

    /**
     * Berechnet durchschnittliche Session Time
     */
    calculateAverageSessionTime() {
        const sessions = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        if (sessions.length === 0) return 0;

        const total = sessions.reduce((sum, session) => sum + session.duration, 0);
        return total / sessions.length;
    }

    /**
     * Berechnet Interaction Rate
     */
    calculateInteractionRate() {
        // Implementierung basierend auf User-Interaktionen
        return 0; // Placeholder
    }

    /**
     * Speichert Session-Daten
     */
    saveSessionData(duration) {
        const sessions = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        sessions.push({
            timestamp: Date.now(),
            duration: duration
        });

        // Nur letzte 100 Sessions speichern
        if (sessions.length > 100) {
            sessions.shift();
        }

        localStorage.setItem('sessionHistory', JSON.stringify(sessions));
    }

    /**
     * Sendet Analytics Event
     */
    sendAnalyticsEvent() {
        // Analytics Event an Server senden (optional)
        if (window.gtag) {
            window.gtag('event', 'performance_metrics', {
                custom_map: {
                    fps: this.metrics.fps,
                    memory_usage: this.metrics.memoryUsage,
                    active_animations: this.metrics.activeAnimations
                }
            });
        }
    }

    /**
     * Stoppt das Monitoring
     */
    stopMonitoring() {
        console.log('🛑 Performance Monitor gestoppt');

        clearInterval(this.fpsInterval);
        clearInterval(this.memoryInterval);
        clearInterval(this.networkInterval);
        clearInterval(this.analyticsInterval);
    }

    /**
     * Generiert Performance Report
     */
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.getMetrics(),
            history: this.getHistory(),
            summary: {
                systemHealth: this.calculateSystemHealth(),
                recommendations: this.generateRecommendations()
            }
        };
    }

    /**
     * Berechnet System Health Score
     */
    calculateSystemHealth() {
        let score = 100;

        // FPS Bewertung
        if (this.metrics.fps < 30) score -= 30;
        else if (this.metrics.fps < 45) score -= 15;

        // Memory Bewertung
        if (this.metrics.memoryUsage > 0.8) score -= 25;
        else if (this.metrics.memoryUsage > 0.6) score -= 10;

        // Error Rate Bewertung
        if (this.metrics.errorRate > 0.05) score -= 20;
        else if (this.metrics.errorRate > 0.02) score -= 5;

        return Math.max(0, score);
    }

    /**
     * Generiert Performance-Empfehlungen
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.metrics.fps < 30) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'FPS ist niedrig. Reduzieren Sie die Anzahl aktiver Animationen oder Qualität.',
                action: 'reduce_quality'
            });
        }

        if (this.metrics.memoryUsage > 0.8) {
            recommendations.push({
                type: 'memory',
                priority: 'high',
                message: 'Memory-Nutzung ist hoch. Starten Sie die Anwendung neu.',
                action: 'restart_app'
            });
        }

        if (this.metrics.errorRate > 0.02) {
            recommendations.push({
                type: 'errors',
                priority: 'medium',
                message: 'Fehler-Rate ist erhöht. Überprüfen Sie die Browser-Konsole.',
                action: 'check_console'
            });
        }

        return recommendations;
    }
}

// Globale Instanz erstellen
window.PerformanceMonitor = new PerformanceMonitor();