import { AnimationCard } from '../AnimationCard';
import { Kaleidoscope } from '../../kaleidoscope';

export function KaleidoscopeWrapper({ config, canvasId = "kaleidoscope-canvas" }) {
    return (
        <AnimationCard
            animationClass={Kaleidoscope}
            canvasId={canvasId}
            config={config}
        />
    );
}
