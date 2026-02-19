import { AnimationCard } from '../AnimationCard';
import { WaterWaves } from '../../water-waves';

export function WaterWavesWrapper({ config, canvasId = "water-waves-canvas" }) {
    return (
        <AnimationCard
            animationClass={WaterWaves}
            canvasId={canvasId}
            config={config}
        />
    );
}
