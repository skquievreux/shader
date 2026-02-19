import { AnimationCard } from '../AnimationCard';
import { Plasma } from '../../plasma';

export function PlasmaWrapper({ config, canvasId = "plasma-canvas" }) {
    return (
        <AnimationCard
            animationClass={Plasma}
            canvasId={canvasId}
            config={config}
        />
    );
}
