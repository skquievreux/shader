/**
 * User Count Detection System für Shader Animationen
 * Erkennt und verfolgt die Anzahl der aktiven Nutzer
 */

class UserCountDetector {
    constructor() {
        // Nutzer-Zähler
        this.metrics = {
            currentUsers: 1,
            peakUsers: 1,
            totalSessions: 0,
            averageSessionDuration: 0,
            userDistribution: {}
        };

        // Detection-Methoden
        this.methods = {
            localStorage: true,
            sessionStorage: true,
            broadcastChannel: true,
            serviceWorker: true,
            websocket: false // Optional für Server-Side
        };

        // Storage-Keys
        this.storageKeys = {
            userCount: 'shader_user_count',
            userSession: 'shader_user_session',
            peakUsers: 'shader_peak_users',
            lastSeen: 'shader_last_seen'
        };

        // Update-Intervalle
        this.intervals = {
            heartbeat: 5000,    // 5 Sekunden
            cleanup: 30000,    // 30 Sekunden
            analytics: 60000     // 1 Minute
        };

        // Callbacks
        this.callbacks = {
            onUserCountChange: [],
            onPeakUsers: [],
            onUserJoin: [],
            onUserLeave: []
        };

        // Session-Informationen
        this.session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            lastHeartbeat: Date.now(),
            isActive: true
        };

        // Detection initialisieren
        this.initializeDetection();
    }

    /**
     * Initialisiert die User Detection
     */
    initializeDetection() {
        console.log('👥 User Count Detector initialisiert');

        // 1. Session registrieren
        this.registerSession();

        // 2. Aktuelle Nutzeranzahl ermitteln
        this.updateCurrentUserCount();

        // 3. Heartbeat starten
        this.startHeartbeat();

        // 4. Cleanup starten
        this.startCleanup();

        // 5. Analytics starten
        this.startAnalytics();

        // 6. Page Visibility API einrichten
        this.setupVisibilityAPI();

        // 7. Broadcast Channel einrichten
        this.setupBroadcastChannel();

        // 8. Service Worker einrichten
        this.setupServiceWorker();
    }

    /**
     * Registriert die aktuelle Session
     */
    registerSession() {
        const sessionData = {
            id: this.session.id,
            startTime: this.session.startTime,
            userAgent: navigator.userAgent,
            screen: {
                width: screen.width,
                height: screen.height
            },
            timestamp: Date.now()
        };

        // Session in localStorage speichern
        localStorage.setItem(this.storageKeys.userSession, JSON.stringify(sessionData));

        // Nutzerzähler erhöhen
        this.incrementUserCount();

        console.log(`👤 Session registriert: ${this.session.id}`);
    }

    /**
     * Erhöht die Nutzeranzahl
     */
    incrementUserCount() {
        const currentCount = this.getUserCountFromStorage();
        const newCount = currentCount + 1;

        localStorage.setItem(this.storageKeys.userCount, newCount.toString());
        this.metrics.currentUsers = newCount;

        // Peak aktualisieren
        if (newCount > this.metrics.peakUsers) {
            this.metrics.peakUsers = newCount;
            localStorage.setItem(this.storageKeys.peakUsers, newCount.toString());
            this.triggerCallbacks('onPeakUsers', { count: newCount });
        }

        // Callback auslösen
        this.triggerCallbacks('onUserJoin', {
            sessionId: this.session.id,
            totalUsers: newCount
        });

        this.triggerCallbacks('onUserCountChange', {
            oldCount: currentCount,
            newCount: newCount,
            change: 1
        });

        console.log(`📈 Nutzer beigetreten. Aktuelle Anzahl: ${newCount}`);
    }

    /**
     * Verringert die Nutzeranzahl
     */
    decrementUserCount() {
        const currentCount = this.getUserCountFromStorage();
        const newCount = Math.max(0, currentCount - 1);

        localStorage.setItem(this.storageKeys.userCount, newCount.toString());
        this.metrics.currentUsers = newCount;

        // Callback auslösen
        this.triggerCallbacks('onUserLeave', {
            sessionId: this.session.id,
            totalUsers: newCount
        });

        this.triggerCallbacks('onUserCountChange', {
            oldCount: currentCount,
            newCount: newCount,
            change: -1
        });

        console.log(`📉 Nutzer verlassen. Aktuelle Anzahl: ${newCount}`);
    }

    /**
     * Aktualisiert die aktuelle Nutzeranzahl
     */
    updateCurrentUserCount() {
        const count = this.getUserCountFromStorage();
        this.metrics.currentUsers = count;

        // Session als aktiv markieren
        localStorage.setItem(this.storageKeys.lastSeen, Date.now().toString());
    }

    /**
     * Holt Nutzeranzahl aus Storage
     */
    getUserCountFromStorage() {
        const count = localStorage.getItem(this.storageKeys.userCount);
        return count ? parseInt(count, 10) : 1;
    }

    /**
     * Startet den Heartbeat-Mechanismus
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, this.intervals.heartbeat);
    }

    /**
     * Sendet Heartbeat
     */
    sendHeartbeat() {
        const now = Date.now();
        this.session.lastHeartbeat = now;

        // Letzte Aktivität aktualisieren
        localStorage.setItem(this.storageKeys.lastSeen, now.toString());

        // Broadcast Message senden
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'heartbeat',
                sessionId: this.session.id,
                timestamp: now
            });
        }
    }

    /**
     * Startet den Cleanup-Prozess
     */
    startCleanup() {
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, this.intervals.cleanup);
    }

    /**
     * Führt Cleanup durch
     */
    performCleanup() {
        const now = Date.now();
        const timeout = 60000; // 1 Minute Timeout

        // Alte Sessions entfernen
        const lastSeen = localStorage.getItem(this.storageKeys.lastSeen);
        if (lastSeen && (now - parseInt(lastSeen)) > timeout) {
            this.cleanupInactiveSessions();
        }

        // Storage aufräumen
        this.cleanupStorage();
    }

    /**
     * Räumt inaktive Sessions auf
     */
    cleanupInactiveSessions() {
        const sessionData = localStorage.getItem(this.storageKeys.userSession);
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = Date.now();
                const timeout = 300000; // 5 Minuten Timeout

                if ((now - session.startTime) > timeout) {
                    // Session ist abgelaufen
                    this.decrementUserCount();
                    localStorage.removeItem(this.storageKeys.userSession);
                    console.log('🧹 Inaktive Session entfernt');
                }
            } catch (error) {
                console.error('Fehler bei Session Cleanup:', error);
            }
        }
    }

    /**
     * Räumt Storage auf
     */
    cleanupStorage() {
        const keys = Object.keys(localStorage);
        const now = Date.now();
        const maxAge = 86400000; // 24 Stunden

        keys.forEach(key => {
            if (key.startsWith('shader_')) {
                try {
                    const value = localStorage.getItem(key);
                    const data = JSON.parse(value);

                    if (data.timestamp && (now - data.timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    // Ungültige Daten entfernen
                    localStorage.removeItem(key);
                }
            }
        });
    }

    /**
     * Startet Analytics
     */
    startAnalytics() {
        this.analyticsInterval = setInterval(() => {
            this.updateAnalytics();
        }, this.intervals.analytics);
    }

    /**
     * Aktualisiert Analytics-Daten
     */
    updateAnalytics() {
        // Durchschnittliche Session-Dauer berechnen
        this.calculateAverageSessionDuration();

        // Nutzer-Verteilung analysieren
        this.analyzeUserDistribution();

        // Analytics Event senden
        this.sendAnalyticsEvent();
    }

    /**
     * Berechnet durchschnittliche Session-Dauer
     */
    calculateAverageSessionDuration() {
        const sessions = this.getSessionHistory();
        if (sessions.length === 0) return;

        const totalDuration = sessions.reduce((sum, session) => {
            return sum + (session.endTime || Date.now()) - session.startTime;
        }, 0);

        this.metrics.averageSessionDuration = totalDuration / sessions.length;
    }

    /**
     * Analysiert Nutzer-Verteilung
     */
    analyzeUserDistribution() {
        const distribution = {
            single: 0,
            small: 0,
            medium: 0,
            large: 0,
            massive: 0
        };

        const userCount = this.metrics.currentUsers;

        if (userCount === 1) distribution.single = 1;
        else if (userCount <= 10) distribution.small = 1;
        else if (userCount <= 50) distribution.medium = 1;
        else if (userCount <= 100) distribution.large = 1;
        else distribution.massive = 1;

        this.metrics.userDistribution = distribution;
    }

    /**
     * Sendet Analytics Event
     */
    sendAnalyticsEvent() {
        if (window.gtag) {
            window.gtag('event', 'user_metrics', {
                custom_map: {
                    current_users: this.metrics.currentUsers,
                    peak_users: this.metrics.peakUsers,
                    average_session_duration: this.metrics.averageSessionDuration
                }
            });
        }
    }

    /**
     * Setup für Page Visibility API
     */
    setupVisibilityAPI() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab ist unsichtbar
                this.session.isActive = false;
            } else {
                // Tab ist sichtbar
                this.session.isActive = true;
                this.updateCurrentUserCount();
                this.sendHeartbeat();
            }
        });

        // Page Unload behandeln
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    /**
     * Setup für Broadcast Channel
     */
    setupBroadcastChannel() {
        if ('BroadcastChannel' in window) {
            this.broadcastChannel = new BroadcastChannel('shader_animations');

            this.broadcastChannel.addEventListener('message', (event) => {
                this.handleBroadcastMessage(event.data);
            });
        }
    }

    /**
     * Behandelt Broadcast Messages
     */
    handleBroadcastMessage(data) {
        if (data.sessionId === this.session.id) {
            return; // Eigene Nachrichten ignorieren
        }

        switch (data.type) {
            case 'heartbeat':
                // Andere Nutzer sind aktiv
                this.updateCurrentUserCount();
                break;

            case 'user_join':
                this.incrementUserCount();
                break;

            case 'user_leave':
                this.decrementUserCount();
                break;

            case 'quality_change':
                // Qualitätsänderung von anderen Nutzern
                this.handleQualityChange(data);
                break;
        }
    }

    /**
     * Setup für Service Worker
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(() => {
                    console.log('Service Worker registriert');

                    // Message Handler einrichten
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        this.handleServiceWorkerMessage(event.data);
                    });
                })
                .catch(error => {
                    console.log('Service Worker nicht verfügbar:', error);
                });
        }
    }

    /**
     * Behandelt Service Worker Messages
     */
    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'user_count_update':
                this.metrics.currentUsers = data.count;
                this.triggerCallbacks('onUserCountChange', {
                    newCount: data.count,
                    source: 'service_worker'
                });
                break;
        }
    }

    /**
     * Behandelt Qualitätsänderungen
     */
    handleQualityChange(data) {
        // An andere Systeme weiterleiten
        if (window.EnhancedAdaptiveQuality) {
            window.EnhancedAdaptiveQuality.handleExternalQualityChange(data);
        }
    }

    /**
     * Generiert eindeutige Session-ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Holt Session-Historie
     */
    getSessionHistory() {
        const history = localStorage.getItem('shader_session_history');
        return history ? JSON.parse(history) : [];
    }

    /**
     * Registriert Callback
     */
    on(eventType, callback) {
        if (this.callbacks[eventType]) {
            this.callbacks[eventType].push(callback);
        }
    }

    /**
     * Entfernt Callback
     */
    off(eventType, callback) {
        if (this.callbacks[eventType]) {
            const index = this.callbacks[eventType].indexOf(callback);
            if (index > -1) {
                this.callbacks[eventType].splice(index, 1);
            }
        }
    }

    /**
     * Löst Callbacks aus
     */
    triggerCallbacks(eventType, data) {
        this.callbacks[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Fehler in ${eventType} Callback:`, error);
            }
        });
    }

    /**
     * Gibt aktuelle Nutzeranzahl zurück
     */
    getCurrentUserCount() {
        return this.metrics.currentUsers;
    }

    /**
     * Gibt Peak-Nutzeranzahl zurück
     */
    getPeakUserCount() {
        return this.metrics.peakUsers;
    }

    /**
     * Gibt alle Metriken zurück
     */
    getMetrics() {
        return {
            ...this.metrics,
            session: this.session,
            methods: this.methods
        };
    }

    /**
     * Simuliert Nutzer-Beitritt (für Testing)
     */
    simulateUserJoin() {
        this.incrementUserCount();
    }

    /**
     * Simuliert Nutzer-Austritt (für Testing)
     */
    simulateUserLeave() {
        this.decrementUserCount();
    }

    /**
     * Cleanup bei Session-Ende
     */
    cleanup() {
        console.log('🧹 User Count Cleanup gestartet');

        // Intervalle stoppen
        clearInterval(this.heartbeatInterval);
        clearInterval(this.cleanupInterval);
        clearInterval(this.analyticsInterval);

        // Nutzeranzahl reduzieren
        this.decrementUserCount();

        // Session-Daten speichern
        this.saveSessionData();

        // Broadcast Channel schließen
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
        }
    }

    /**
     * Speichert Session-Daten
     */
    saveSessionData() {
        const sessionData = {
            id: this.session.id,
            startTime: this.session.startTime,
            endTime: Date.now(),
            duration: Date.now() - this.session.startTime,
            userAgent: navigator.userAgent
        };

        // Zur Historie hinzufügen
        const history = this.getSessionHistory();
        history.push(sessionData);

        // Nur letzte 100 Sessions speichern
        if (history.length > 100) {
            history.shift();
        }

        localStorage.setItem('shader_session_history', JSON.stringify(history));
    }

    /**
     * Generiert User Count Report
     */
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.getMetrics(),
            sessionHistory: this.getSessionHistory(),
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * Generiert Empfehlungen
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.metrics.currentUsers > 100) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'Hohe Nutzeranzahl. Qualität wird automatisch reduziert.',
                action: 'monitor_performance'
            });
        }

        if (this.metrics.averageSessionDuration < 30000) {
            recommendations.push({
                type: 'engagement',
                priority: 'medium',
                message: 'Kurze Session-Dauer. Überprüfen Sie die Benutzererfahrung.',
                action: 'improve_engagement'
            });
        }

        return recommendations;
    }
}

// Globale Instanz erstellen
window.UserCountDetector = new UserCountDetector();