import { AnimationCard } from '../AnimationCard';
import { Aurora } from '../../aurora';

export function AuroraWrapper({ config, canvasId = "aurora-canvas" }) {
    return (
        <AnimationCard
            animationClass={Aurora}
            canvasId={canvasId}
            config={config}
        />
    );
}
