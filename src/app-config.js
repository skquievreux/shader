/**
 * App Configuration und Version Information
 * Zentralisierte Konfiguration für die Shader Animationen Anwendung
 */

class AppConfig {
    constructor() {
        // App Informationen aus package.json
        this.appName = 'Energiefeld-Animationen';
        this.version = '2.1.1';
        this.description = 'Eine erweiterte Sammlung von HTML5-Canvas-Animationen mit Aurora Borealis';
        this.author = 'Quievreux Consulting';
        this.copyright = '© 2025 DreamEdit. Alle Rechte vorbehalten.';

        // App-Informatione n in Console ausgeben
        this.logAppInfo();
    }

    logAppInfo() {
        const style = 'color: #2b5797; font-weight: bold; font-size: 14px;';
        const versionStyle = 'color: #4dabf7; font-size: 12px;';
        const authorStyle = 'color: #28a745; font-size: 11px;';

        console.log('%c=====================================', style);
        console.log(`%c${this.appName}`, style);
        console.log(`%cVersion: ${this.version}`, versionStyle);
        console.log(`%c${this.description}`, 'color: #666; font-size: 11px;');
        console.log(`%cEntwickelt von ${this.author}`, authorStyle);
        console.log(`%c${this.copyright}`, 'color: #999; font-size: 10px;');
        console.log('%c=====================================', style);
    }

    // App-Informatione n für andere Skripte verfügbar machen
    getAppInfo() {
        return {
            name: this.appName,
            version: this.version,
            description: this.description,
            author: this.author,
            copyright: this.copyright
        };
    }
}

// Globale App-Instanz erstellen
window.AppConfig = new AppConfig();