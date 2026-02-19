import React from 'react';
import { X, Code, Download, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmbedModal({ isOpen, onClose, animationId, animationName }) {
    const [activeTab, setActiveTab] = React.useState('iframe');
    const [copyStatus, setCopyStatus] = React.useState('');

    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/embed.html?animation=${animationId}`;

    const getCode = () => {
        if (activeTab === 'iframe') {
            return `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
        }
        return `<!-- ${animationName} Animation -->
<div id="${animationId}-container" style="width: 100%; height: 100%; min-height: 400px;"></div>
<script src="${baseUrl}/assets/animations.js"></script>
<script>
  window.addEventListener('load', function() {
    new ${animationName.replace(/\s+/g, '')}Animation('${animationId}-container');
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
    <script>
        // Animation Code for ${animationName}
        // ... (Download logic would need full source integration)
        console.log('Standalone animation loaded');
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h3 className="text-xl font-bold text-white">Embed {animationName}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex space-x-2 border-b border-gray-800">
                                <button
                                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'iframe' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab('iframe')}
                                >
                                    <span className="flex items-center gap-2">
                                        <Code size={16} /> iFrame
                                    </span>
                                    {activeTab === 'iframe' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'code' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                                        }`}
                                    onClick={() => setActiveTab('code')}
                                >
                                    <span className="flex items-center gap-2">
                                        <FileCode size={16} /> JS Code
                                    </span>
                                    {activeTab === 'code' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                            layoutId="activeTab"
                                        />
                                    )}
                                </button>
                            </div>

                            <div className="relative group">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                                    >
                                        {copyStatus || 'Kopieren'}
                                    </button>
                                </div>
                                <pre className="w-full h-48 p-4 overflow-auto text-sm font-mono text-gray-300 bg-black/50 rounded-lg border border-gray-800">
                                    {getCode()}
                                </pre>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <div className="text-sm text-gray-500">
                                    Diese Animation kann frei in privaten und kommerziellen Projekten verwendet werden.
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:text-white hover:bg-gray-700 transition-colors"
                                >
                                    <Download size={16} />
                                    Standalone HTML
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
