import { AnimationCard } from '../AnimationCard';
import { Smoke } from '../../smoke';

export function SmokeWrapper({ config, canvasId = "smoke-canvas" }) {
    return (
        <AnimationCard
            animationClass={Smoke}
            canvasId={canvasId}
            config={config}
        />
    );
}
