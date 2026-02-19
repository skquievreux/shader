import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

export function AnimationCard({
    animationClass,
    canvasId,
    className = ""
}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const animationInstance = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.1 });

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize animation if in view and not already running
        if (isInView) {
            if (!animationInstance.current) {
                try {
                    // Instantiate the legacy animation class
                    // We pass the canvas ELEMENT reference directly to avoid ID lookup issues,
                    // ensuring the animation attaches to the correct DOM element immediately.
                    animationInstance.current = new animationClass(canvasRef.current);
                } catch (e) {
                    console.error(`Failed to init animation ${canvasId}`, e);
                }
            } else {
                // Resume if method exists
                if (animationInstance.current.resume) animationInstance.current.resume();
                else if (animationInstance.current.animate && !animationInstance.current.isRunning) {
                    // Fallback re-start attempt
                    animationInstance.current.animate();
                }
            }
        } else {
            // Pause/Stop if out of view
            if (animationInstance.current) {
                if (animationInstance.current.pause) animationInstance.current.pause();
                else if (animationInstance.current.stop) animationInstance.current.stop();
                else if (animationInstance.current.destroy && false) {
                    // Destroy is too aggressive usually, better to just pause loop
                    animationInstance.current.destroy();
                    animationInstance.current = null;
                }
            }
        }

        return () => {
            // Cleanup on unmount
            if (animationInstance.current && animationInstance.current.destroy) {
                animationInstance.current.destroy();
                animationInstance.current = null;
            }
        };
    }, [isInView, animationClass, canvasId]);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            <canvas
                id={canvasId}
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
}
