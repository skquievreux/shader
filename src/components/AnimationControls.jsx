import React from 'react';
import { Settings2 } from 'lucide-react';

export function AnimationControls({ controls, config, onConfigChange }) {
    if (!controls || controls.length === 0) return null;

    return (
        <div className="bg-slate-900/80 backdrop-blur rounded-xl p-4 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-medium">
                <Settings2 size={16} />
                <span>Einstellungen</span>
            </div>

            {controls.map((control) => (
                <div key={control.id} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                        <label htmlFor={control.id}>{control.label}</label>
                        <span className="font-mono opacity-70">
                            {config[control.id] ?? control.defaultValue}
                        </span>
                    </div>

                    {control.type === 'range' && (
                        <input
                            type="range"
                            id={control.id}
                            min={control.min}
                            max={control.max}
                            step={control.step || 1}
                            value={config[control.id] ?? control.defaultValue}
                            onChange={(e) => onConfigChange(control.id, Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                        />
                    )}

                    {control.type === 'color' && (
                        <div className="flex gap-2">
                            <input
                                type="color"
                                id={control.id}
                                value={config[control.id] ?? control.defaultValue}
                                onChange={(e) => onConfigChange(control.id, e.target.value)}
                                className="w-full h-8 bg-slate-700 rounded cursor-pointer p-1"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
