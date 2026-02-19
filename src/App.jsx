import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilterBar } from './components/SearchFilterBar';
import { EmbedModal } from './components/EmbedModal';
import { useAnimations } from './hooks/useAnimations';
import { AnimationComponents } from './components/animations';

function App() {
    const {
        animations,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDifficulty,
        setSelectedDifficulty,
        totalCount,
        filteredCount,

    } = useAnimations();

    const [selectedAnimation, setSelectedAnimation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (animation) => {
        setSelectedAnimation(animation);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAnimation(null);
    };

    const handleRandom = () => {
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        if (randomAnim) {
            handleOpenModal(randomAnim);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 font-sans">
            <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Shader Gallery
                        </span>
                    </motion.div>

                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
                        <a href="#gallery" className="hover:text-cyan-400 transition-colors">Galerie</a>
                        <a href="#about" className="hover:text-cyan-400 transition-colors">Über</a>
                        <a href="https://github.com/skquievreux/shader" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
                    </nav>
                </div>
            </header>

            <main className="pt-32 pb-20 container mx-auto px-6">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16 text-center max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Interaktive <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
                            Canvas Animationen
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Eine kuratierte Sammlung von hochperformanten, GPU-beschleunigten visuellen Effekten für das moderne Web.
                        Open Source und bereit für dein nächstes Projekt.
                    </p>
                </motion.section>

                <SearchFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={selectedCategory}
                    setCategoryFilter={setSelectedCategory}
                    difficultyFilter={selectedDifficulty}
                    setDifficultyFilter={setSelectedDifficulty}
                    onRandom={handleRandom}
                />

                <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                    <span>{filteredCount} von {totalCount} Animationen</span>
                    {/* Optional: Add clear filters button if needed */}
                </div>

                <motion.section
                    layout
                    id="gallery"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {animations.map((anim) => {
                            const Component = AnimationComponents[anim.component];
                            return (
                                <motion.div
                                    layout
                                    key={anim.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleOpenModal(anim)}
                                    className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                                >
                                    {Component ? (
                                        <div className="w-full h-full pointer-events-none">
                                            {/* Disable interaction in grid view for performance/UX */}
                                            <Component />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                            Vorschau nicht verfügbar
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <h3 className="text-xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            {anim.name}
                                        </h3>
                                        <p className="text-sm text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                            {anim.description}
                                        </p>

                                        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                            {anim.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 border border-white/5">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Play Icon */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.section>

                {filteredCount === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">Keine Animationen gefunden</h3>
                        <p className="text-slate-500">Versuchen Sie andere Suchbegriffe oder Filter.</p>
                    </div>
                )}
            </main>

            <footer className="border-t border-white/10 bg-slate-950 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Shader Gallery. Open Source Project.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">Impressum</a>
                        <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">Datenschutz</a>
                    </div>
                </div>
            </footer>

            <EmbedModal
                key={`${selectedAnimation?.id || 'none'}-${isModalOpen}`}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                animationId={selectedAnimation?.id}
                animationName={selectedAnimation?.name}
            />
        </div>
    );
}

export default App;
