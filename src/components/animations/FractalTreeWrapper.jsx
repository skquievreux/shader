import { AnimationCard } from '../AnimationCard';
import { FractalTree } from '../../fractal-tree';

export function FractalTreeWrapper() {
    return <AnimationCard animationClass={FractalTree} canvasId="fractal-tree-canvas" />;
}
