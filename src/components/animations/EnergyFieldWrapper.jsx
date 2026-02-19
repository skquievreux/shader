import { AnimationCard } from '../AnimationCard';
import { EnergyField } from '../../energy-field';

export function EnergyFieldWrapper() {
    return <AnimationCard animationClass={EnergyField} canvasId="energy-field-canvas" />;
}
