import React, { useState, useEffect } from 'react';
import { X, Code, Download, FileCode, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationComponents } from './animations';
import { AnimationControls } from './AnimationControls';
import { ANIMATION_REGISTRY } from '../data/animations';

export function EmbedModal({ isOpen, onClose, animationId, animationName }) {
    const [activeTab, setActiveTab] = React.useState('preview');
    const [copyStatus, setCopyStatus] = React.useState('');
    const [config, setConfig] = useState({});

    // Reset config when animation changes
    useEffect(() => {
        if (isOpen && animationId) {
            const registryEntry = ANIMATION_REGISTRY[animationId];
            if (registryEntry && registryEntry.controls) {
                // Initialize default values
                const defaults = {};
                registryEntry.controls.forEach(c => defaults[c.id] = c.defaultValue);
                setConfig(defaults);
            } else {
                setConfig({});
            }
            setActiveTab('preview');
        }
    }, [isOpen, animationId]);

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const baseUrl = window.location.origin;
    // Construct embed URL with params
    const params = new URLSearchParams(config).toString();
    const embedUrl = `${baseUrl}/embed.html?animation=${animationId}&${params}`;

    const registryEntry = animationId ? ANIMATION_REGISTRY[animationId] : null;
    const Component = registryEntry ? AnimationComponents[registryEntry.component] : null;

    const getCode = () => {
        if (activeTab === 'iframe') {
            return `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
        }
        return `<!-- ${animationName} Animation -->
<div id="${animationId}-container" style="width: 100%; height: 100%; min-height: 400px;"></div>
<script src="${baseUrl}/assets/animations.js"></script>
<script>
  window.addEventListener('load', function() {
    const anim = new ${animationName.replace(/\s+/g, '')}Animation('${animationId}-container');
    // Applied Configuration:
    ${Object.entries(config).map(([k, v]) => `anim.${k} = ${typeof v === 'string' ? `'${v}'` : v};`).join('\n    ')}
    anim.init();
  });
</script>`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getCode());
            setCopyStatus('Kopiert!');
            setTimeout(() => setCopyStatus(''), 2000);
        } catch {
            setCopyStatus('Fehler Beim Kopieren');
        }
    };

    const handleDownload = () => {
        const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${animationName} - Standalone View</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
        canvas { display: block; width: 100%; height: 100%; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <!-- Placeholder: In production this would bundle the actual JS -->
    <script>
        console.log('Standalone configuration:', ${JSON.stringify(config)});
        alert('Download is currently a template. Full JS bundling requires a build step.');
    </script>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${animationId}-standalone.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white">{animationName}</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    Vorschau & Konfiguration
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Left: Preview/Visuals */}
                            <div className="flex-1 flex flex-col min-w-0 bg-black/40 relative">
                                {activeTab === 'preview' ? (
                                    <div className="w-full h-full relative">
                                        {Component && (
                                            /* Hack: Pass config prop to the Wrapper via React.cloneElement or just by knowing it accepts it? 
                                               Wrapper components typically just render <AnimationCard>.
                                               We need to update Wrappers to accept props or make AnimationCard direct usage here easier.
                                               Actually, AnimationComponents map to Wrappers. Wrappers usually look like () => <AnimationCard ... />.
                                               We need to modify Wrappers to accept `config`.
                                               OR simpler: Just render AnimationCard directly here if we know the class! 
                                               But Wrappers hold the class import. 
                                               Let's assume we modify Wrappers to pass props through.
                                            */
                                            <Component config={config} />
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative group w-full h-full p-6 overflow-auto">
                                        <div className="absolute top-8 right-8 flex gap-2 z-10">
                                            <button
                                                onClick={handleCopy}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors shadow-lg"
                                            >
                                                {copyStatus || 'Kopieren'}
                                            </button>
                                        </div>
                                        <pre className="w-full h-full p-4 text-sm font-mono text-slate-300 bg-slate-900 rounded-lg border border-slate-800 overflow-auto">
                                            {getCode()}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* Right: Controls & Tabs */}
                            <div className="w-80 border-l border-slate-800 bg-slate-900/30 flex flex-col">
                                <div className="p-4 border-b border-slate-800 flex gap-2">
                                    <button
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                        onClick={() => setActiveTab('preview')}
                                    >
                                        <Play size={14} className="inline mr-1" /> Vorschau
                                    </button>
                                    <button
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'code' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                        onClick={() => setActiveTab('code')}
                                    >
                                        <Code size={14} className="inline mr-1" /> Code
                                    </button>
                                </div>

                                <div className="p-6 flex-1 overflow-y-auto">
                                    {activeTab === 'preview' && registryEntry?.controls ? (
                                        <AnimationControls
                                            controls={registryEntry.controls}
                                            config={config}
                                            onConfigChange={handleConfigChange}
                                        />
                                    ) : activeTab === 'preview' ? (
                                        <p className="text-sm text-slate-500 text-center italic mt-10">Keine Einstellungen verfügbar.</p>
                                    ) : (
                                        <div className="text-sm text-slate-400 space-y-4">
                                            <p>Nutzen Sie diesen Code, um die Animation mit den aktuellen Einstellungen in Ihre Webseite einzubetten.</p>
                                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-xs">
                                                Tipp: Der "iFrame" Tab (oben im Code-Fenster) ist am einfachsten für Baukästen wie Wordpress.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-slate-800">
                                    <button
                                        onClick={handleDownload}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:text-white hover:bg-slate-700 transition-colors"
                                    >
                                        <Download size={16} />
                                        Download HTML
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

