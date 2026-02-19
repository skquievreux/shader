import { AnimationCard } from '../AnimationCard';
import { EnergyField } from '../../energy-field';

export function EnergyFieldWrapper({ config, canvasId = "energy-field-canvas" }) {
    return (
        <AnimationCard
            animationClass={EnergyField}
            canvasId={canvasId}
            config={config}
        />
    );
}
