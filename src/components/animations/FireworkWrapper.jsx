import { AnimationCard } from '../AnimationCard';
import { Firework } from '../../firework';

export function FireworkWrapper({ config, canvasId = "firework-canvas" }) {
    return (
        <AnimationCard
            animationClass={Firework}
            canvasId={canvasId}
            config={config}
        />
    );
}
