import { AnimationCard } from '../AnimationCard';
import { Lightning } from '../../lightning';

export function LightningWrapper({ config, canvasId = "lightning-canvas" }) {
    return (
        <AnimationCard
            animationClass={Lightning}
            canvasId={canvasId}
            config={config}
        />
    );
}
