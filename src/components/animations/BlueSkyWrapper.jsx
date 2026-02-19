import { AnimationCard } from '../AnimationCard';
import { BlueSky } from '../../blue-sky';

export function BlueSkyWrapper({ config, canvasId = "blue-sky-canvas" }) {
    return (
        <AnimationCard
            animationClass={BlueSky}
            canvasId={canvasId}
            config={config}
        />
    );
}
