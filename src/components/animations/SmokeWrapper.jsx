import { AnimationCard } from '../AnimationCard';
import { Smoke } from '../../smoke';

export function SmokeWrapper() {
    return <AnimationCard animationClass={Smoke} canvasId="smoke-canvas" />;
}
