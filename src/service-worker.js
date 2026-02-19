/**
 * Service Worker für Shader Animation Gallery
 * Offline-Caching und Performance-Optimierung
 */

const CACHE_NAME = 'shader-gallery-v2.2.1';
const STATIC_CACHE = 'shader-static-v2.2.1';
const RUNTIME_CACHE = 'shader-runtime-v2.2.1';

// Zu cachende Dateien
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/landing.html',
    '/embed.html',
    '/styles.css',
    '/landing-styles.css',
    '/performance-styles.css',
    '/favicon.svg',
    
    // Core JavaScript
    '/performance-monitor.js',
    '/enhanced-adaptive-quality.js',
    '/resource-pool.js',
    '/progressive-loader.js',
    '/user-count-detector.js',
    '/emergency-mode.js',
    '/environment-config.js',
    '/adaptive-quality.js',
    '/animation-registry.js',
    '/app-config.js',
    
    // Animationen
    '/energy-field.js',
    '/blue-sky.js',
    '/firework.js',
    '/water-waves.js',
    '/aurora.js',
    '/star-field.js',
    '/rain.js',
    '/lightning.js',
    '/smoke.js',
    '/fractal-tree.js',
    '/kaleidoscope.js',
    '/plasma.js',
    '/matrix-rain.js'
];

// Installation - Static Assets cachen
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

// Activation - Alte Caches aufräumen
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Alte Caches löschen
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== RUNTIME_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch - Strategien für verschiedene Ressourcen
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Nur für HTTP/HTTPS Anfragen
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Strategy für verschiedene Ressourcentypen
    if (isStaticAsset(request.url)) {
        // Cache First für statische Assets
        event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request.url)) {
        // Network First für API Requests
        event.respondWith(networkFirst(request));
    } else {
        // Stale While Revalidate für dynamische Inhalte
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Cache First Strategy
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            // Cache Hit - Antwort aus Cache
            return cachedResponse;
        }
        
        // Cache Miss - vom Netzwerk laden und cachen
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Cache First failed:', error);
        
        // Offline Fallback
        if (request.destination === 'document') {
            return caches.match('/landing.html') || new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        }
        
        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First Strategy
async function networkFirst(request) {
    try {
        // Zuerst vom Netzwerk versuchen
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Network First failed, trying cache:', error);
        
        // Fallback auf Cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Offline Fallback
        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Im Hintergrund aktualisieren
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });
    
    // Cache Antwort sofort zurückgeben, falls vorhanden
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Ansonsten auf Netzwerk warten
    return fetchPromise;
}

// Helper Functions
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.js') ||
           url.includes('.css') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.svg') ||
           url.includes('.woff') ||
           url.includes('.ttf');
}

function isAPIRequest(url) {
    return url.includes('/api/') || url.includes('analytics');
}

// Background Sync für Offline-Aktionen
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalyticsData());
    }
});

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('Push message received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'Neue Animation verfügbar!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Animation ansehen',
                icon: '/favicon.svg'
            },
            {
                action: 'close',
                title: 'Schließen',
                icon: '/favicon.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Shader Gallery', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/landing.html')
        );
    }
});

// Analytics Sync Function
async function syncAnalyticsData() {
    try {
        // Gespeicherte Analytics-Daten holen
        const analyticsData = await getStoredAnalyticsData();
        
        if (analyticsData.length > 0) {
            // An Server senden
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(analyticsData)
            });
            
            if (response.ok) {
                // Erfolgreich gesendet - lokale Daten löschen
                await clearStoredAnalyticsData();
                console.log('Analytics data synced successfully');
            }
        }
    } catch (error) {
        console.error('Analytics sync failed:', error);
    }
}

// Storage Helpers
async function getStoredAnalyticsData() {
    // Implementierung für gespeicherte Analytics-Daten
    return [];
}

async function clearStoredAnalyticsData() {
    // Implementierung zum Löschen gespeicherter Daten
    console.log('Analytics data cleared');
}

// Performance Monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        console.log('Performance metrics received:', event.data.metrics);
        
        // Metrics für Background Sync speichern
        storePerformanceMetrics(event.data.metrics);
    }
});

async function storePerformanceMetrics(metrics) {
    // Implementierung zum Speichern von Performance-Metriken
    console.log('Storing performance metrics:', metrics);
}

console.log('Service Worker loaded successfully');