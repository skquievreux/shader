import { AnimationCard } from '../AnimationCard';
import { Rain } from '../../rain';

export function RainWrapper() {
    return <AnimationCard animationClass={Rain} canvasId="rain-canvas" />;
}
