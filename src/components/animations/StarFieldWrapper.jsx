import { AnimationCard } from '../AnimationCard';
import { StarField } from '../../star-field';

export function StarFieldWrapper({ config, canvasId = "starfield-canvas" }) {
    return (
        <AnimationCard
            animationClass={StarField}
            canvasId={canvasId}
            config={config}
        />
    );
}
