import { AnimationCard } from '../AnimationCard';
import { MatrixRain } from '../../matrix-rain';

export function MatrixRainWrapper({ config, canvasId = "matrix-canvas" }) {
    return (
        <AnimationCard
            animationClass={MatrixRain}
            canvasId={canvasId}
            config={config}
        />
    );
}
