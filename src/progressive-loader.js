/**
 * Progressive Loading System für Shader Animationen
 * Lädt Animationen und Ressourcen intelligent und performant
 */

class ProgressiveLoader {
    constructor() {
        // Animation-Kategorien mit Prioritäten (aktualisiert für 14 Animationen)
        this.categories = {
            particles: {
                name: '🌟 Particle-Systeme',
                priority: 1,
                animations: ['energy-field', 'firework', 'smoke'],
                loaded: new Set(),
                loading: false
            },
            nature: {
                name: '🌍 Natur-Phänomene',
                priority: 2,
                animations: ['blue-sky', 'water-waves', 'aurora', 'fractal-tree'],
                loaded: new Set(),
                loading: false
            },
            weather: {
                name: '🌦️ Wetter-Effekte',
                priority: 2,
                animations: ['rain', 'lightning'],
                loaded: new Set(),
                loading: false
            },
            cosmic: {
                name: '🌌 Kosmische Effekte',
                priority: 3,
                animations: ['star-field'],
                loaded: new Set(),
                loading: false
            },
            geometric: {
                name: '🔮 Geometrische Muster',
                priority: 3,
                animations: ['chakra-animation', 'kaleidoscope'],
                loaded: new Set(),
                loading: false
            },
            organic: {
                name: '🌳 Organische Muster',
                priority: 4,
                animations: ['fractal-tree'],
                loaded: new Set(),
                loading: false
            },
            abstract: {
                name: '🎨 Abstrakte Kunst',
                priority: 5,
                animations: ['plasma', 'matrix-rain'],
                loaded: new Set(),
                loading: false
            }
        };
        
        // Loading-Zustände
        this.loadingStates = {
            idle: 'idle',
            loading: 'loading',
            loaded: 'loaded',
            error: 'error'
        };
        
        // Loading-Queue
        this.loadingQueue = [];
        this.loadingBatchSize = 2; // Gleichzeitig laden
        this.currentLoading = new Set();
        
        // Performance-Metriken
        this.metrics = {
            totalAnimations: 0,
            loadedAnimations: 0,
            loadingTime: 0,
            errorCount: 0
        };
        
        // Callbacks
        this.callbacks = {
            onProgress: [],
            onComplete: [],
            onError: [],
            onCategoryLoaded: []
        };
        
        // Intersection Observer für Lazy Loading
        this.intersectionObserver = null;
        this.setupIntersectionObserver();
        
        // Initiales Loading starten
        this.initializeProgressiveLoading();
    }
    
    /**
     * Initialisiert das progressive Loading
     */
    initializeProgressiveLoading() {
        console.log('🚀 Progressive Loader initialisiert');
        
        // 1. Zufällige Animation pro Kategorie laden
        this.loadRandomAnimationsPerCategory();
        
        // 2. Viewport-basiertes Loading starten
        this.startViewportBasedLoading();
        
        // 3. Performance-basiertes Loading starten
        this.startPerformanceBasedLoading();
    }
    
    /**
     * Lädt zufällige Animationen pro Kategorie
     */
    async loadRandomAnimationsPerCategory() {
        console.log('🎲 Lade zufällige Animationen pro Kategorie');
        
        const loadPromises = [];
        
        Object.entries(this.categories).forEach(([categoryKey, category]) => {
            const randomAnimation = category.animations[
                Math.floor(Math.random() * category.animations.length)
            ];
            
            loadPromises.push(
                this.loadAnimation(categoryKey, randomAnimation, 'initial')
            );
        });
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ Initiale Animationen geladen');
        } catch (error) {
            console.error('❌ Fehler beim Laden der initialen Animationen:', error);
        }
    }
    
    /**
     * Lädt eine einzelne Animation
     */
    async loadAnimation(category, animationName, loadType = 'user') {
        const cacheKey = `${category}-${animationName}`;
        
        // Prüfen ob bereits geladen
        if (this.categories[category].loaded.has(animationName)) {
            return this.getAnimationElement(animationName);
        }
        
        // Prüfen ob aktuell am Laden
        if (this.currentLoading.has(cacheKey)) {
            return this.waitForLoading(cacheKey);
        }
        
        console.log(`📥 Lade Animation: ${animationName} (${category})`);
        
        this.currentLoading.add(cacheKey);
        this.categories[category].loading = true;
        
        const startTime = performance.now();
        
        try {
            // 1. JavaScript-Datei laden
            await this.loadAnimationScript(animationName);
            
            // 2. Animation-Element erstellen
            const animationElement = await this.createAnimationElement(
                category, animationName, loadType
            );
            
            // 3. In DOM einfügen
            this.insertAnimationIntoDOM(animationElement, category);
            
            // 4. Als geladen markieren
            this.categories[category].loaded.add(animationName);
            this.categories[category].loading = false;
            this.currentLoading.delete(cacheKey);
            
            // 5. Metriken aktualisieren
            const loadTime = performance.now() - startTime;
            this.updateMetrics(animationName, loadTime, true);
            
            // 6. Callbacks auslösen
            this.triggerCallbacks('onProgress', {
                category,
                animation: animationName,
                loadType,
                loadTime
            });
            
            this.triggerCallbacks('onCategoryLoaded', {
                category,
                animation: animationName,
                totalLoaded: this.categories[category].loaded.size,
                totalInCategory: this.categories[category].animations.length
            });
            
            console.log(`✅ Animation geladen: ${animationName} (${loadTime.toFixed(2)}ms)`);
            
            return animationElement;
            
        } catch (error) {
            console.error(`❌ Fehler beim Laden von ${animationName}:`, error);
            
            this.categories[category].loading = false;
            this.currentLoading.delete(cacheKey);
            this.updateMetrics(animationName, 0, false);
            
            this.triggerCallbacks('onError', {
                category,
                animation: animationName,
                error
            });
            
            throw error;
        }
    }
    
    /**
     * Lädt Animation-Script
     */
    async loadAnimationScript(animationName) {
        return new Promise((resolve, reject) => {
            // Prüfen ob Script bereits geladen
            if (document.querySelector(`script[data-animation="${animationName}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = `${animationName}.js`;
            script.dataset.animation = animationName;
            script.async = true;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script nicht gefunden: ${animationName}.js`));
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Erstellt Animation-Element
     */
    async createAnimationElement(category, animationName, loadType) {
        const section = document.createElement('section');
        section.className = 'animation-container loading';
        section.dataset.category = category;
        section.dataset.animation = animationName;
        section.dataset.loadType = loadType;
        
        // Header
        const header = document.createElement('div');
        header.className = 'animation-header';
        header.innerHTML = `
            <h3>${this.getAnimationDisplayName(animationName)}</h3>
            <div class="animation-controls">
                <button class="play-btn" data-animation="${animationName}">
                    <span class="icon">▶</span>
                </button>
                <button class="expand-btn" data-animation="${animationName}">
                    <span class="icon">⛶</span>
                </button>
            </div>
        `;
        
        // Canvas Wrapper
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'canvas-wrapper collapsed';
        
        const canvas = document.createElement('canvas');
        canvas.id = `${animationName}-canvas`;
        canvas.width = 800;
        canvas.height = 400;
        
        canvasWrapper.appendChild(canvas);
        
        // Loading Skeleton
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-shimmer"></div>
            <div class="skeleton-text">Lade Animation...</div>
        `;
        
        canvasWrapper.appendChild(skeleton);
        
        // Controls Panel
        const controls = document.createElement('div');
        controls.className = 'controls collapsed';
        controls.innerHTML = this.generateControlsHTML(animationName);
        
        // Zusammenbauen
        section.appendChild(header);
        section.appendChild(canvasWrapper);
        section.appendChild(controls);
        
        // Event Listener hinzufügen
        this.setupAnimationEventListeners(section);
        
        return section;
    }
    
    /**
     * Fügt Animation in DOM ein
     */
    insertAnimationIntoDOM(animationElement, category) {
        const targetContainer = document.querySelector(`[data-category="${category}"] .animation-grid`);
        if (targetContainer) {
            targetContainer.appendChild(animationElement);
        } else {
            // Fallback: Am Ende der Main-Sektion einfügen
            document.querySelector('main').appendChild(animationElement);
        }
    }
    
    /**
     * Setup für Intersection Observer
     */
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleAnimationInView(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            }
        );
    }
    
    /**
     * Startet viewport-basiertes Loading
     */
    startViewportBasedLoading() {
        // Animationen beobachten, die in den Viewport kommen
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const category = element.dataset.category;
                        const animation = element.dataset.animation;
                        
                        // Animation laden falls noch nicht geschehen
                        if (!this.categories[category].loaded.has(animation)) {
                            this.loadAnimation(category, animation, 'viewport');
                        }
                        
                        // Observer für dieses Element stoppen
                        observer.unobserve(element);
                    }
                });
            },
            { rootMargin: '100px' }
        );
        
        // Placeholder-Elemente beobachten
        document.querySelectorAll('.animation-placeholder').forEach(placeholder => {
            observer.observe(placeholder);
        });
    }
    
    /**
     * Startet performance-basiertes Loading
     */
    startPerformanceBasedLoading() {
        setInterval(() => {
            this.adjustLoadingBasedOnPerformance();
        }, 5000); // Alle 5 Sekunden prüfen
    }
    
    /**
     * Passt Loading an Performance an
     */
    adjustLoadingBasedOnPerformance() {
        if (!window.PerformanceMonitor) return;
        
        const metrics = window.PerformanceMonitor.getMetrics();
        
        // Bei niedriger Performance Loading verlangsamen
        if (metrics.fps < 30) {
            this.loadingBatchSize = 1;
        } else if (metrics.fps < 45) {
            this.loadingBatchSize = 2;
        } else {
            this.loadingBatchSize = 3;
        }
        
        // Loading Queue verarbeiten
        this.processLoadingQueue();
    }
    
    /**
     * Verarbeitet Loading Queue
     */
    async processLoadingQueue() {
        if (this.loadingQueue.length === 0) return;
        
        const batch = this.loadingQueue.splice(0, this.loadingBatchSize);
        const loadPromises = batch.map(item => 
            this.loadAnimation(item.category, item.animation, 'queue')
        );
        
        try {
            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Fehler bei Batch-Loading:', error);
        }
    }
    
    /**
     * Behandelt Animation im Viewport
     */
    handleAnimationInView(element) {
        const category = element.dataset.category;
        const animation = element.dataset.animation;
        
        // Animation initialisieren falls noch nicht geschehen
        if (!element.dataset.initialized) {
            this.initializeAnimation(element, category, animation);
            element.dataset.initialized = 'true';
        }
    }
    
    /**
     * Initialisiert eine Animation
     */
    initializeAnimation(element, category, animation) {
        const canvas = element.querySelector('canvas');
        const skeleton = element.querySelector('.loading-skeleton');
        
        // Skeleton entfernen
        if (skeleton) {
            skeleton.remove();
        }
        
        // Animation starten
        try {
            // Globale Initialisierungsfunktion aufrufen
            const initFunction = this.getInitFunction(animation);
            if (initFunction && typeof initFunction === 'function') {
                initFunction(canvas.id);
                element.classList.remove('loading');
                element.classList.add('loaded');
                
                console.log(`🎬 Animation gestartet: ${animation}`);
            }
        } catch (error) {
            console.error(`Fehler bei Initialisierung von ${animation}:`, error);
            element.classList.add('error');
        }
    }
    
    /**
     * Gibt Initialisierungsfunktion zurück
     */
    getInitFunction(animationName) {
        const functionMap = {
            'energy-field': window.initEnergyField,
            'blue-sky': window.initBlueSky,
            'firework': window.initFirework,
            'water-waves': window.initWaterWaves,
            'aurora': window.initAurora
        };
        
        return functionMap[animationName];
    }
    
    /**
     * Setup für Animation Event Listener
     */
    setupAnimationEventListeners(element) {
        const playBtn = element.querySelector('.play-btn');
        const expandBtn = element.querySelector('.expand-btn');
        const canvasWrapper = element.querySelector('.canvas-wrapper');
        const controls = element.querySelector('.controls');
        
        // Play/Pause Button
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.toggleAnimation(element);
            });
        }
        
        // Expand/Collapse Button
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                this.toggleAnimationExpansion(element);
            });
        }
        
        // Intersection Observer für Lazy Loading
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        }
    }
    
    /**
     * Schaltet Animation ein/aus
     */
    toggleAnimation(element) {
        const isPlaying = element.dataset.playing === 'true';
        const playBtn = element.querySelector('.play-btn');
        const canvas = element.querySelector('canvas');
        
        if (isPlaying) {
            // Animation pausieren
            element.dataset.playing = 'false';
            playBtn.innerHTML = '<span class="icon">▶</span>';
            
            // Canvas leeren
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            // Animation starten
            element.dataset.playing = 'true';
            playBtn.innerHTML = '<span class="icon">⏸</span>';
            
            // Animation initialisieren falls nötig
            if (!element.dataset.initialized) {
                const category = element.dataset.category;
                const animation = element.dataset.animation;
                this.initializeAnimation(element, category, animation);
            }
        }
    }
    
    /**
     * Schaltet Animation-Erweiterung ein/aus
     */
    toggleAnimationExpansion(element) {
        const canvasWrapper = element.querySelector('.canvas-wrapper');
        const controls = element.querySelector('.controls');
        const expandBtn = element.querySelector('.expand-btn');
        const isExpanded = canvasWrapper.classList.contains('expanded');
        
        if (isExpanded) {
            // Einklappen
            canvasWrapper.classList.remove('expanded');
            canvasWrapper.classList.add('collapsed');
            controls.classList.remove('expanded');
            controls.classList.add('collapsed');
            expandBtn.innerHTML = '<span class="icon">⛶</span>';
            element.classList.remove('expanded');
        } else {
            // Ausklappen
            canvasWrapper.classList.remove('collapsed');
            canvasWrapper.classList.add('expanded');
            controls.classList.remove('collapsed');
            controls.classList.add('expanded');
            expandBtn.innerHTML = '<span class="icon">⛶</span>';
            element.classList.add('expanded');
            
            // Animation initialisieren falls nötig
            if (!element.dataset.initialized) {
                const category = element.dataset.category;
                const animation = element.dataset.animation;
                this.initializeAnimation(element, category, animation);
            }
        }
    }
    
    /**
     * Generiert Controls HTML
     */
    generateControlsHTML(animationName) {
        const controls = this.getAnimationControls(animationName);
        
        return controls.map(control => `
            <div class="control-group">
                <label for="${control.id}">${control.label}</label>
                <input type="${control.type}" 
                       id="${control.id}" 
                       min="${control.min}" 
                       max="${control.max}" 
                       value="${control.value}"
                       ${control.step ? `step="${control.step}"` : ''}>
                <span class="value">${control.value}</span>
            </div>
        `).join('') + `
        <button class="copy-code-btn" data-animation="${animationName}">Code kopieren</button>
        `;
    }
    
    /**
     * Gibt Animation-Controls zurück
     */
    getAnimationControls(animationName) {
        const controlMap = {
            'energy-field': [
                { id: 'energy-particles', label: 'Partikelanzahl', type: 'range', min: 50, max: 500, value: 200 },
                { id: 'energy-speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, value: 5 },
                { id: 'energy-color', label: 'Farbe', type: 'color', min: null, max: null, value: '#ff6b6b' }
            ],
            'blue-sky': [
                { id: 'sky-clouds', label: 'Wolkendichte', type: 'range', min: 5, max: 30, value: 15 },
                { id: 'sky-speed', label: 'Windgeschwindigkeit', type: 'range', min: 1, max: 10, value: 3 },
                { id: 'sky-color', label: 'Himmelsfarbe', type: 'color', min: null, max: null, value: '#4dabf7' }
            ],
            'firework': [
                { id: 'firework-frequency', label: 'Häufigkeit', type: 'range', min: 1, max: 10, value: 3 },
                { id: 'firework-particles', label: 'Partikelgröße', type: 'range', min: 20, max: 200, value: 100 },
                { id: 'firework-color', label: 'Farbe', type: 'color', min: null, max: null, value: '#cc5de8' }
            ],
            'water-waves': [
                { id: 'waves-height', label: 'Wellenhöhe', type: 'range', min: 5, max: 50, value: 20 },
                { id: 'waves-speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, value: 4 },
                { id: 'waves-color', label: 'Wasserfarbe', type: 'color', min: null, max: null, value: '#15aabf' }
            ],
            'aurora': [
                { id: 'aurora-intensity', label: 'Intensität', type: 'range', min: 1, max: 10, value: 5 },
                { id: 'aurora-speed', label: 'Geschwindigkeit', type: 'range', min: 1, max: 10, value: 3 },
                { id: 'aurora-color', label: 'Farbe', type: 'color', min: null, max: null, value: '#00ff88' }
            ]
        };
        
        return controlMap[animationName] || [];
    }
    
    /**
     * Gibt Display-Name für Animation zurück
     */
    getAnimationDisplayName(animationName) {
        const nameMap = {
            'energy-field': 'Energiefeld',
            'blue-sky': 'Blauer Himmel',
            'firework': 'Feuerwerk',
            'water-waves': 'Wasserwellen',
            'aurora': 'Aurora Borealis',
            'quantum-field': 'Quantenfeld',
            'plasma-storm': 'Plasma-Sturm',
            'volcanic-eruption': 'Vulkanausbruch',
            'fractal-tree': 'Fraktal-Baum',
            'sacred-geometry': 'Heilige Geometrie',
            'kaleidoscope': 'Kaleidoskop',
            'mandala-generator': 'Mandala-Generator',
            'neural-network': 'Neuronales Netz',
            'blockchain': 'Blockchain',
            'data-stream': 'Datenstrom',
            'circuit-board': 'Schaltkreis',
            'liquid-metal': 'Flüssiges Metall',
            'glass-morphism': 'Glass-Morphismus',
            'smoke-mirrors': 'Rauch & Spiegel',
            'chromatic-aberration': 'Chromatische Aberration'
        };
        
        return nameMap[animationName] || animationName;
    }
    
    /**
     * Wartet auf Loading-Vervollständigung
     */
    async waitForLoading(cacheKey) {
        return new Promise(resolve => {
            const checkLoading = () => {
                if (!this.currentLoading.has(cacheKey)) {
                    resolve();
                } else {
                    setTimeout(checkLoading, 100);
                }
            };
            checkLoading();
        });
    }
    
    /**
     * Aktualisiert Metriken
     */
    updateMetrics(animationName, loadTime, success) {
        this.metrics.totalAnimations++;
        
        if (success) {
            this.metrics.loadedAnimations++;
            this.metrics.loadingTime += loadTime;
        } else {
            this.metrics.errorCount++;
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
     * Gibt Lade-Status zurück
     */
    getLoadingStatus() {
        const status = {};
        
        Object.entries(this.categories).forEach(([key, category]) => {
            status[key] = {
                name: category.name,
                priority: category.priority,
                total: category.animations.length,
                loaded: category.loaded.size,
                loading: category.loading,
                progress: (category.loaded.size / category.animations.length) * 100
            };
        });
        
        return {
            categories: status,
            overall: {
                total: this.metrics.totalAnimations,
                loaded: this.metrics.loadedAnimations,
                errors: this.metrics.errorCount,
                averageLoadTime: this.metrics.loadedAnimations > 0 ? 
                    this.metrics.loadingTime / this.metrics.loadedAnimations : 0
            }
        };
    }
    
    /**
     * Generiert Loading Report
     */
    generateReport() {
        const status = this.getLoadingStatus();
        
        return {
            timestamp: new Date().toISOString(),
            status: status,
            recommendations: this.generateRecommendations(status),
            performance: {
                batchSize: this.loadingBatchSize,
                queueLength: this.loadingQueue.length,
                currentLoading: this.currentLoading.size
            }
        };
    }
    
    /**
     * Generiert Empfehlungen
     */
    generateRecommendations(status) {
        const recommendations = [];
        
        Object.entries(status.categories).forEach(([key, category]) => {
            if (category.progress < 50) {
                recommendations.push({
                    type: 'loading',
                    priority: 'medium',
                    category: category.name,
                    message: `Nur ${Math.round(category.progress)}% der Animationen in "${category.name}" geladen.`,
                    action: 'load_more'
                });
            }
        });
        
        if (status.overall.errors > 0) {
            recommendations.push({
                type: 'errors',
                priority: 'high',
                message: `${status.overall.errors} Fehler beim Laden aufgetreten.`,
                action: 'check_console'
            });
        }
        
        return recommendations;
    }
}

// Globale Instanz erstellen
window.ProgressiveLoader = new ProgressiveLoader();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveLoader;
}