import { AnimationCard } from '../AnimationCard';
import { Rain } from '../../rain';

export function RainWrapper({ config, canvasId = "rain-canvas" }) {
    return (
        <AnimationCard
            animationClass={Rain}
            canvasId={canvasId}
            config={config}
        />
    );
}
