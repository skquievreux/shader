/**
 * Environment Configuration für Shader Animationen
 * Passt URLs automatisch an die Hosting-Umgebung an
 */

class EnvironmentConfig {
    constructor() {
        // Base URL automatisch erkennen oder Fallback verwenden
        this.baseUrl = this.detectBaseUrl();
        this.isProduction = this.isProductionEnvironment();
    }
    
    detectBaseUrl() {
        // Versuche, die aktuelle URL zu erkennen
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.origin;
            
            // Production URLs
            if (currentUrl.includes('shader.runitfast.xyz')) {
                return 'https://shader.runitfast.xyz';
            }
            
            // Development URLs
            if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
                return currentUrl;
            }
            
            // GitHub Pages oder andere Static Hosts
            if (currentUrl.includes('github.io')) {
                return currentUrl;
            }
            
            // Andere Domains
            return currentUrl;
        }
        
        // Fallback für Server-Side
        return 'https://shader.runitfast.xyz';
    }
    
    isProductionEnvironment() {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            return !hostname.includes('localhost') && !hostname.includes('127.0.0.1');
        }
        return true;
    }
    
    getEmbedUrl(animation, params = {}) {
        const url = new URL(`${this.baseUrl}/embed.html`);
        url.searchParams.set('animation', animation);
        
        // Parameter hinzufügen
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        
        return url.toString();
    }
    
    getAssetUrl(assetPath) {
        return `${this.baseUrl}/${assetPath.replace(/^\//, '')}`;
    }
    
    // Für Vercel Environment Variables
    static getFromEnv(key, fallback = null) {
        // In Browser-Umgebung versuchen wir, die URL zu erkennen
        if (typeof window !== 'undefined') {
            const config = new EnvironmentConfig();
            switch(key) {
                case 'BASE_URL':
                    return config.baseUrl;
                case 'IS_PRODUCTION':
                    return config.isProduction;
                default:
                    return fallback;
            }
        }
        
        // Server-Side Fallback
        return fallback;
    }
}

// Globale Instanz erstellen
window.ShaderConfig = new EnvironmentConfig();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentConfig;
}