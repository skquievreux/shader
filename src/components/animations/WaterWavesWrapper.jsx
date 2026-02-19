import { AnimationCard } from '../AnimationCard';
import { WaterWaves } from '../../water-waves';

export function WaterWavesWrapper() {
    return <AnimationCard animationClass={WaterWaves} canvasId="water-waves-canvas" />;
}
