/**
 * Emergency Mode System für Shader Animationen
 * Aktiviert Notfall-Modus bei kritischen System-Zuständen
 */

class EmergencyMode {
    constructor() {
        // Emergency-Zustände
        this.states = {
            normal: 'normal',
            warning: 'warning',
            critical: 'critical',
            emergency: 'emergency'
        };
        
        // Aktuelle Zustand
        this.currentState = this.states.normal;
        
        // Trigger-Schwellenwerte
        this.triggers = {
            fps: { critical: 15, emergency: 10 },
            memory: { critical: 0.9, emergency: 0.95 },
            cpu: { critical: 0.9, emergency: 0.95 },
            errors: { critical: 0.1, emergency: 0.2 },
            users: { critical: 500, emergency: 1000 }
        };
        
        // Emergency-Aktionen
        this.actions = {
            warning: ['reduce_quality', 'limit_animations'],
            critical: ['pause_heavy_animations', 'clear_caches'],
            emergency: ['emergency_shutdown', 'show_warning']
        };
        
        // Status-Tracking
        this.metrics = {
            emergencyActivations: 0,
            criticalActivations: 0,
            warningActivations: 0,
            lastActivation: null,
            totalDowntime: 0
        };
        
        // Callbacks
        this.callbacks = {
            onStateChange: [],
            onEmergency: [],
            onRecovery: []
        };
        
        // Monitoring-Intervalle
        this.checkInterval = 1000; // 1 Sekunde
        this.recoveryInterval = 5000; // 5 Sekunden
        
        // Timer für Recovery
        this.recoveryTimer = null;
        this.emergencyStartTime = null;
        
        // UI-Elemente
        this.uiElements = {
            warningBanner: null,
            emergencyOverlay: null,
            statusIndicator: null
        };
        
        // Initialisierung
        this.initializeEmergencyMode();
    }
    
    /**
     * Initialisiert den Emergency Mode
     */
    initializeEmergencyMode() {
        console.log('🚨 Emergency Mode initialisiert');
        
        // 1. UI-Elemente erstellen
        this.createUIElements();
        
        // 2. Monitoring starten
        this.startMonitoring();
        
        // 3. Performance Monitor Integration
        this.setupPerformanceMonitoring();
        
        // 4. User Count Detection Integration
        this.setupUserCountMonitoring();
        
        // 5. Page Visibility API
        this.setupVisibilityAPI();
    }
    
    /**
     * Erstellt UI-Elemente für Emergency Mode
     */
    createUIElements() {
        // Warning Banner
        this.uiElements.warningBanner = this.createWarningBanner();
        document.body.appendChild(this.uiElements.warningBanner);
        
        // Emergency Overlay
        this.uiElements.emergencyOverlay = this.createEmergencyOverlay();
        document.body.appendChild(this.uiElements.emergencyOverlay);
        
        // Status Indicator
        this.uiElements.statusIndicator = this.createStatusIndicator();
        document.body.appendChild(this.uiElements.statusIndicator);
        
        // Initial verstecken
        this.hideAllUIElements();
    }
    
    /**
     * Erstellt Warning Banner
     */
    createWarningBanner() {
        const banner = document.createElement('div');
        banner.id = 'emergency-warning-banner';
        banner.className = 'emergency-banner hidden';
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">⚠️</div>
                <div class="banner-text">
                    <strong>Performance-Warnung</strong>
                    <p id="warning-message">Die System-Performance ist reduziert.</p>
                </div>
                <button class="banner-close" onclick="window.EmergencyMode.dismissWarning()">✕</button>
            </div>
        `;
        
        return banner;
    }
    
    /**
     * Erstellt Emergency Overlay
     */
    createEmergencyOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'emergency-overlay';
        overlay.className = 'emergency-overlay hidden';
        overlay.innerHTML = `
            <div class="overlay-content">
                <div class="emergency-icon">🚨</div>
                <h2>Emergency Mode Aktiv</h2>
                <p id="emergency-message">Das System befindet sich im Notfallmodus aufgrund kritischer Performance.</p>
                <div class="emergency-actions">
                    <button class="btn btn-primary" onclick="window.EmergencyMode.attemptRecovery()">
                        🔄 Wiederherstellung versuchen
                    </button>
                    <button class="btn btn-secondary" onclick="window.EmergencyMode.showDiagnostics()">
                        📊 Diagnose anzeigen
                    </button>
                </div>
                <div class="emergency-metrics">
                    <div class="metric">
                        <span class="label">FPS:</span>
                        <span id="emergency-fps">0</span>
                    </div>
                    <div class="metric">
                        <span class="label">Memory:</span>
                        <span id="emergency-memory">0%</span>
                    </div>
                    <div class="metric">
                        <span class="label">Nutzer:</span>
                        <span id="emergency-users">0</span>
                    </div>
                </div>
            </div>
        `;
        
        return overlay;
    }
    
    /**
     * Erstellt Status Indicator
     */
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'emergency-status-indicator';
        indicator.className = 'status-indicator';
        indicator.innerHTML = `
            <div class="status-dot" id="status-dot"></div>
            <div class="status-text" id="status-text">Normal</div>
        `;
        
        return indicator;
    }
    
    /**
     * Startet das Emergency Monitoring
     */
    startMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.checkEmergencyConditions();
        }, this.checkInterval);
    }
    
    /**
     * Prüft Emergency-Bedingungen
     */
    checkEmergencyConditions() {
        const metrics = this.collectMetrics();
        const newState = this.evaluateEmergencyState(metrics);
        
        if (newState !== this.currentState) {
            this.handleStateChange(newState, metrics);
        }
        
        // UI-Metriken aktualisieren
        this.updateUIMetrics(metrics);
    }
    
    /**
     * Sammelt aktuelle Metriken
     */
    collectMetrics() {
        const metrics = {
            fps: 60,
            memory: 0,
            cpu: 0,
            errors: 0,
            users: 1
        };
        
        // Performance Monitor Metriken
        if (window.PerformanceMonitor) {
            const monitorMetrics = window.PerformanceMonitor.getMetrics();
            metrics.fps = monitorMetrics.fps;
            metrics.memory = monitorMetrics.memoryUsage;
            metrics.errors = monitorMetrics.errorRate;
        }
        
        // User Count Metriken
        if (window.UserCountDetector) {
            const userMetrics = window.UserCountDetector.getMetrics();
            metrics.users = userMetrics.currentUsers;
        }
        
        return metrics;
    }
    
    /**
     * Bewertet den Emergency-Zustand
     */
    evaluateEmergencyState(metrics) {
        let state = this.states.normal;
        
        // Emergency-Bedingungen prüfen
        if (metrics.fps <= this.triggers.fps.emergency ||
            metrics.memory >= this.triggers.memory.emergency ||
            metrics.errors >= this.triggers.errors.emergency ||
            metrics.users >= this.triggers.users.emergency) {
            state = this.states.emergency;
        }
        // Critical-Bedingungen prüfen
        else if (metrics.fps <= this.triggers.fps.critical ||
                 metrics.memory >= this.triggers.memory.critical ||
                 metrics.errors >= this.triggers.errors.critical ||
                 metrics.users >= this.triggers.users.critical) {
            state = this.states.critical;
        }
        // Warning-Bedingungen prüfen
        else if (metrics.fps <= 25 ||
                 metrics.memory >= 0.7 ||
                 metrics.errors >= 0.05 ||
                 metrics.users >= 50) {
            state = this.states.warning;
        }
        
        return state;
    }
    
    /**
     * Behandelt Zustandsänderungen
     */
    handleStateChange(newState, metrics) {
        const oldState = this.currentState;
        this.currentState = newState;
        
        console.log(`🚨 Emergency Status-Änderung: ${oldState} → ${newState}`, metrics);
        
        // Metriken aktualisieren
        this.updateStateMetrics(newState);
        
        // Aktionen ausführen
        this.executeStateActions(newState, oldState);
        
        // UI aktualisieren
        this.updateUI(newState);
        
        // Callbacks auslösen
        this.triggerCallbacks('onStateChange', {
            oldState,
            newState,
            metrics
        });
        
        // Recovery-Timer starten/stoppen
        this.handleRecoveryTimer(newState);
    }
    
    /**
     * Aktualisiert Zustands-Metriken
     */
    updateStateMetrics(state) {
        const now = Date.now();
        
        switch (state) {
            case this.states.warning:
                this.metrics.warningActivations++;
                break;
            case this.states.critical:
                this.metrics.criticalActivations++;
                break;
            case this.states.emergency:
                this.metrics.emergencyActivations++;
                this.metrics.lastActivation = now;
                this.emergencyStartTime = now;
                break;
        }
    }
    
    /**
     * Führt Zustands-Aktionen aus
     */
    executeStateActions(newState, oldState) {
        const actions = this.actions[newState] || [];
        
        actions.forEach(action => {
            this.executeAction(action, newState, oldState);
        });
    }
    
    /**
     * Führt einzelne Aktion aus
     */
    executeAction(action, newState, oldState) {
        switch (action) {
            case 'reduce_quality':
                this.reduceQuality();
                break;
                
            case 'limit_animations':
                this.limitAnimations();
                break;
                
            case 'pause_heavy_animations':
                this.pauseHeavyAnimations();
                break;
                
            case 'clear_caches':
                this.clearCaches();
                break;
                
            case 'emergency_shutdown':
                this.emergencyShutdown();
                break;
                
            case 'show_warning':
                this.showWarningUI();
                break;
        }
    }
    
    /**
     * Reduziert die Qualität
     */
    reduceQuality() {
        if (window.EnhancedAdaptiveQuality) {
            window.EnhancedAdaptiveQuality.setManualQuality('low');
            console.log('🔽 Qualität aufgrund von Warning reduziert');
        }
    }
    
    /**
     * Begrenzt die Anzahl aktiver Animationen
     */
    limitAnimations() {
        const maxAnimations = 2;
        const containers = document.querySelectorAll('.animation-container');
        
        containers.forEach((container, index) => {
            if (index >= maxAnimations) {
                // Animation pausieren
                const playBtn = container.querySelector('.play-btn');
                if (playBtn && container.dataset.playing === 'true') {
                    playBtn.click();
                }
                
                // Container deaktivieren
                container.classList.add('disabled');
                container.style.opacity = '0.5';
                container.style.pointerEvents = 'none';
            }
        });
        
        console.log(`📉 Animationen auf ${maxAnimations} begrenzt`);
    }
    
    /**
     * Pausiert schwere Animationen
     */
    pauseHeavyAnimations() {
        const heavyAnimations = ['energy-field', 'aurora', 'quantum-field'];
        
        heavyAnimations.forEach(animationName => {
            const container = document.querySelector(`[data-animation="${animationName}"]`);
            if (container && container.dataset.playing === 'true') {
                const playBtn = container.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.click();
                }
            }
        });
        
        console.log('⏸️ Schwere Animationen pausiert');
    }
    
    /**
     * Leert Caches
     */
    clearCaches() {
        // Resource Manager Cache leeren
        if (window.ResourceManager) {
            window.ResourceManager.emergencyCleanup();
        }
        
        // Browser Cache leeren (falls möglich)
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Garbage Collection anfordern
        if (window.gc) {
            window.gc();
        }
        
        console.log('🧹 Caches geleert');
    }
    
    /**
     * Führt Notfall-Herunterfahren durch
     */
    emergencyShutdown() {
        console.log('🚨 Emergency Shutdown eingeleitet');
        
        // Alle Animationen stoppen
        const containers = document.querySelectorAll('.animation-container');
        containers.forEach(container => {
            const playBtn = container.querySelector('.play-btn');
            if (playBtn && container.dataset.playing === 'true') {
                playBtn.click();
            }
        });
        
        // Emergency Overlay anzeigen
        this.showEmergencyUI();
        
        // Callback auslösen
        this.triggerCallbacks('onEmergency', {
            timestamp: Date.now(),
            metrics: this.collectMetrics()
        });
    }
    
    /**
     * Aktualisiert die UI
     */
    updateUI(state) {
        // Status Indicator aktualisieren
        this.updateStatusIndicator(state);
        
        // Warning Banner anzeigen/verstecken
        if (state === this.states.warning) {
            this.showWarningUI();
        } else {
            this.hideWarningUI();
        }
        
        // Emergency Overlay anzeigen/verstecken
        if (state === this.states.emergency) {
            this.showEmergencyUI();
        } else {
            this.hideEmergencyUI();
        }
    }
    
    /**
     * Aktualisiert Status Indicator
     */
    updateStatusIndicator(state) {
        const indicator = this.uiElements.statusIndicator;
        const dot = indicator.querySelector('#status-dot');
        const text = indicator.querySelector('#status-text');
        
        // Klassen entfernen
        dot.className = 'status-dot';
        
        switch (state) {
            case this.states.normal:
                dot.classList.add('status-normal');
                text.textContent = 'Normal';
                break;
            case this.states.warning:
                dot.classList.add('status-warning');
                text.textContent = 'Warnung';
                break;
            case this.states.critical:
                dot.classList.add('status-critical');
                text.textContent = 'Kritisch';
                break;
            case this.states.emergency:
                dot.classList.add('status-emergency');
                text.textContent = 'Notfall';
                break;
        }
    }
    
    /**
     * Zeigt Warning UI
     */
    showWarningUI() {
        this.uiElements.warningBanner.classList.remove('hidden');
    }
    
    /**
     * Versteckt Warning UI
     */
    hideWarningUI() {
        this.uiElements.warningBanner.classList.add('hidden');
    }
    
    /**
     * Zeigt Emergency UI
     */
    showEmergencyUI() {
        this.uiElements.emergencyOverlay.classList.remove('hidden');
        document.body.classList.add('emergency-active');
    }
    
    /**
     * Versteckt Emergency UI
     */
    hideEmergencyUI() {
        this.uiElements.emergencyOverlay.classList.add('hidden');
        document.body.classList.remove('emergency-active');
    }
    
    /**
     * Versteckt alle UI-Elemente
     */
    hideAllUIElements() {
        this.hideWarningUI();
        this.hideEmergencyUI();
    }
    
    /**
     * Aktualisiert UI-Metriken
     */
    updateUIMetrics(metrics) {
        // Emergency Overlay Metriken aktualisieren
        const fpsElement = document.getElementById('emergency-fps');
        const memoryElement = document.getElementById('emergency-memory');
        const usersElement = document.getElementById('emergency-users');
        
        if (fpsElement) fpsElement.textContent = Math.round(metrics.fps);
        if (memoryElement) memoryElement.textContent = Math.round(metrics.memory * 100) + '%';
        if (usersElement) usersElement.textContent = metrics.users;
    }
    
    /**
     * Behandelt Recovery-Timer
     */
    handleRecoveryTimer(state) {
        // Timer stoppen bei Emergency
        if (state === this.states.emergency) {
            if (this.recoveryTimer) {
                clearTimeout(this.recoveryTimer);
                this.recoveryTimer = null;
            }
            return;
        }
        
        // Timer starten bei Verbesserung
        if (state !== this.states.emergency && !this.recoveryTimer) {
            this.recoveryTimer = setTimeout(() => {
                this.attemptRecovery();
            }, this.recoveryInterval);
        }
    }
    
    /**
     * Versucht die Wiederherstellung
     */
    attemptRecovery() {
        console.log('🔄 Wiederherstellung wird versucht...');
        
        const metrics = this.collectMetrics();
        const potentialState = this.evaluateEmergencyState(metrics);
        
        if (potentialState === this.states.normal) {
            this.handleStateChange(this.states.normal, metrics);
            this.triggerCallbacks('onRecovery', {
                timestamp: Date.now(),
                metrics,
                downtime: this.emergencyStartTime ? 
                    Date.now() - this.emergencyStartTime : 0
            });
            
            console.log('✅ Wiederherstellung erfolgreich');
        } else {
            console.log('❌ Wiederherstellung fehlgeschlagen, bleibe im aktuellen Zustand');
        }
    }
    
    /**
     * Verwirft die Warnung
     */
    dismissWarning() {
        this.hideWarningUI();
    }
    
    /**
     * Zeigt Diagnose-Informationen
     */
    showDiagnostics() {
        const metrics = this.collectMetrics();
        const report = this.generateDiagnosticsReport(metrics);
        
        console.group('🔍 Emergency Mode Diagnostics');
        console.log('Current State:', this.currentState);
        console.log('Metrics:', metrics);
        console.log('History:', this.metrics);
        console.log('Recommendations:', report.recommendations);
        console.groupEnd();
        
        // Diagnose in UI anzeigen (optional)
        alert(`Diagnose:\n\nZustand: ${this.currentState}\nFPS: ${Math.round(metrics.fps)}\nMemory: ${Math.round(metrics.memory * 100)}%\nNutzer: ${metrics.users}`);
    }
    
    /**
     * Setup für Performance Monitoring
     */
    setupPerformanceMonitoring() {
        if (window.PerformanceMonitor) {
            window.PerformanceMonitor.onAlert('lowFPS', (data) => {
                this.checkEmergencyConditions();
            });
            
            window.PerformanceMonitor.onAlert('memoryExhausted', (data) => {
                this.checkEmergencyConditions();
            });
            
            window.PerformanceMonitor.onAlert('highErrorRate', (data) => {
                this.checkEmergencyConditions();
            });
        }
    }
    
    /**
     * Setup für User Count Monitoring
     */
    setupUserCountMonitoring() {
        if (window.UserCountDetector) {
            window.UserCountDetector.on('onUserCountChange', (data) => {
                this.checkEmergencyConditions();
            });
        }
    }
    
    /**
     * Setup für Page Visibility API
     */
    setupVisibilityAPI() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Seite wird sichtbar - Zustand prüfen
                setTimeout(() => {
                    this.checkEmergencyConditions();
                }, 1000);
            }
        });
    }
    
    /**
     * Generiert Diagnostics-Report
     */
    generateDiagnosticsReport(metrics) {
        return {
            timestamp: new Date().toISOString(),
            currentState: this.currentState,
            metrics: metrics,
            triggers: this.triggers,
            history: this.metrics,
            recommendations: this.generateRecommendations(metrics)
        };
    }
    
    /**
     * Generiert Empfehlungen
     */
    generateRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.fps < 20) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'Sehr niedrige FPS. Schließen Sie andere Tabs.',
                action: 'close_tabs'
            });
        }
        
        if (metrics.memory > 0.9) {
            recommendations.push({
                type: 'memory',
                priority: 'high',
                message: 'Memory fast erschöpft. Starten Sie die Anwendung neu.',
                action: 'restart_app'
            });
        }
        
        if (metrics.users > 100) {
            recommendations.push({
                type: 'scalability',
                priority: 'medium',
                message: 'Hohe Nutzeranzahl. Erwägen Sie ein Upgrade.',
                action: 'upgrade_infrastructure'
            });
        }
        
        return recommendations;
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
     * Gibt aktuellen Zustand zurück
     */
    getCurrentState() {
        return this.currentState;
    }
    
    /**
     * Gibt alle Metriken zurück
     */
    getMetrics() {
        return {
            ...this.metrics,
            currentState: this.currentState,
            triggers: this.triggers
        };
    }
    
    /**
     * Stoppt den Emergency Mode
     */
    stop() {
        console.log('🛑 Emergency Mode gestoppt');
        
        clearInterval(this.monitoringInterval);
        if (this.recoveryTimer) {
            clearTimeout(this.recoveryTimer);
        }
        
        // UI aufräumen
        this.hideAllUIElements();
    }
}

// Globale Instanz erstellen
window.EmergencyMode = new EmergencyMode();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmergencyMode;
}