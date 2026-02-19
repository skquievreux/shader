import { AnimationCard } from '../AnimationCard';
import { ChakraAnimation } from '../../chakra-animation';

export function ChakraAnimationWrapper({ config, canvasId = "chakra-canvas" }) {
    return (
        <AnimationCard
            animationClass={ChakraAnimation}
            canvasId={canvasId}
            config={config}
        />
    );
}
