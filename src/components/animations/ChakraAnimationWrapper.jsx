import { AnimationCard } from '../AnimationCard';
import { ChakraAnimation } from '../../chakra-animation';

export function ChakraAnimationWrapper() {
    return <AnimationCard animationClass={ChakraAnimation} canvasId="chakra-canvas" />;
}
