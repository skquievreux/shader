import { AnimationCard } from '../AnimationCard';
// We need to import the class from the source file. 
// Since legacy files are just scripts, we need to export the class properly.
// This file assumes 'Aurora' is exported from src/aurora.js
import { Aurora } from '../../aurora';

export function AuroraWrapper() {
    return (
        <AnimationCard
            animationClass={Aurora}
            canvasId="aurora-canvas"
        />
    );
}
