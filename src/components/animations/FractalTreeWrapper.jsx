import { AnimationCard } from '../AnimationCard';
import { FractalTree } from '../../fractal-tree';

export function FractalTreeWrapper({ config, canvasId = "fractal-tree-canvas" }) {
    return (
        <AnimationCard
            animationClass={FractalTree}
            canvasId={canvasId}
            config={config}
        />
    );
}
