import { AnimationCard } from '../AnimationCard';
import { StarField } from '../../star-field';

export function StarFieldWrapper() {
    return <AnimationCard animationClass={StarField} canvasId="starfield-canvas" />;
}
