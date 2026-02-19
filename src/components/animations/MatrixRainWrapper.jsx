import { AnimationCard } from '../AnimationCard';
import { MatrixRain } from '../../matrix-rain';

export function MatrixRainWrapper() {
    return <AnimationCard animationClass={MatrixRain} canvasId="matrix-canvas" />;
}
