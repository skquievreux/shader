# Energiefeld-Animationen (Shader Gallery)

![Version](https://img.shields.io/badge/version-2.3.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

Eine professionelle Sammlung interaktiver Canvas-Animationen, modernisiert als **React-Applikation**. Diese Bibliothek bietet 14 hochperformante Animationen in 7 Kategorien (Partikel, Natur, Wetter, Kosmisch, Geometrisch, etc.), die nahtlos in Webprojekte integriert werden können.

> **Status des Deployments:** 🟢 **Production Ready**
> Der aktuelle Build (`main` Branch) ist vollständig getestet, lint-free und bereit für das Deployment auf Vercel, Netlify oder Docker-Containern.

![Preview](https://via.placeholder.com/800x400?text=Shader+Gallery+Preview)

---

## 🚀 Features

### 🎨 Interaktive Galerie
- **Modernes UI**: Responsive Grid-Layout mit Hover-Effekten und Details-Ansicht.
- **Smart Search & Filter**: Echtzeit-Filterung nach Kategorien (z.B. "Nature", "Abstract"), Schwierigkeitsgrad und Suchbegriffen.
- **Performance**: Optimiertes Rendering mit `IntersectionObserver` – Animationen pausieren automatisch, wenn sie nicht sichtbar sind.

### 🌟 14 Einzigartige Animationen
| Kategorie              | Animationen                                          |
| ---------------------- | ---------------------------------------------------- |
| **Particle Systems**   | Energy Field, Firework, Smoke                        |
| **Nature Phenomena**   | Blue Sky, Water Waves, Aurora Borealis, Fractal Tree |
| **Weather Effects**    | Rain, Lightning                                      |
| **Cosmic Effects**     | Star Field                                           |
| **Geometric Patterns** | Kaleidoscope, Chakra                                 |
| **Abstract Art**       | Plasma, Matrix Rain                                  |

### 🛠️ Technische Highlights
- **React 18 & Vite**: Blitzschnelle Entwicklung und optimierte Builds.
- **ES Modules**: Vollständig standardisierte Codebasis (kein Legacy CommonJS).
- **Strict Linting**: 100% Clean Code (ESLint, Prettier).
- **Responsive Design**: Tailwind CSS für perfekte Darstellung auf Mobile & Desktop.
- **Embed System**: Integrierter Embed-Generator für Iframe-Integrationen.

---

## 📦 Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder pnpm

### Schritt-für-Schritt
1. **Repository klonen**
   ```bash
   git clone https://github.com/skquievreux/shader.git
   cd shader
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   # oder
   pnpm install
   ```

3. **Development Server starten**
   ```bash
   npm run dev
   ```
   Die App ist nun unter `http://localhost:5173` erreichbar.

4. **Production Build erstellen**
   ```bash
   npm run build
   ```
   Die kompilierten Dateien liegen anschließend im `dist/` Ordner.

---

## ☁️ Deployment

Das Projekt ist für moderne Cloud-Plattformen optimiert.

### Vercel (Empfohlen)
Verbinden Sie einfach Ihr GitHub-Repository mit Vercel. Die `vite.config.js` ist bereits für optimale Vercel-Builds konfiguriert.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Docker
Ein `Dockerfile` kann für Container-Deployments hinzugefügt werden (aktuell statisches Hosting empfohlen).

### Environment Variables
Die App erkennt automatisch die Umgebung (`development` vs `production`).
- `import.meta.env.BASE_URL`: Basis-URL der App.

---

## 🧩 Projektstruktur

```
src/
├── assets/             # Statische Bilder & Icons
├── components/         # React Components
│   ├── animations/     # Wrapper für Canvas-Animationen
│   ├── AnimationCard.jsx
│   ├── SearchFilterBar.jsx
│   └── ...
├── data/               # Metadaten der Animationen
├── hooks/              # Custom Hooks (useAnimations, etc.)
├── legacy-js/          # (Optional) Originale JS-Klassen
├── App.jsx             # Hauptkomponente
├── main.jsx            # Entry Point
└── index.css           # Tailwind & Globale Styles
```

---

## 🛠️ Entwicklung

### Code Quality
Wir legen großen Wert auf sauberen Code.
- **Linting**: `npm run lint` (ESLint)
- **Formatting**: Automatisch via Prettier

### Neue Animation hinzufügen
1. Erstellen Sie eine neue Shader-Klasse in `src/animations/`.
2. Erstellen Sie einen React-Wrapper in `src/components/animations/`.
3. Registrieren Sie die Animation in `src/data/animations.js`.

---

## 📄 Lizenz

Dieses Projekt steht unter der **MIT Lizenz**. Siehe [LICENSE](LICENSE) für Details.

---

## 📞 Kontakt

Entwickelt von **Quievreux Consulting**
📧 [quievreux.consulting@gmail.com](mailto:quievreux.consulting@gmail.com)

**© 2026 DreamEdit. Alle Rechte vorbehalten.**