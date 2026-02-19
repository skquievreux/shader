import { useState, useMemo } from 'react';
import { ANIMATION_REGISTRY } from '../data/animations';

export function useAnimations() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    const animations = useMemo(() => {
        return Object.entries(ANIMATION_REGISTRY).map(([id, data]) => ({
            id,
            ...data
        }));
    }, []);

    const filteredAnimations = useMemo(() => {
        return animations.filter(animation => {
            const matchesSearch =
                animation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                animation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                animation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory ? animation.category === selectedCategory : true;
            const matchesDifficulty = selectedDifficulty ? animation.difficulty === selectedDifficulty : true;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [animations, searchQuery, selectedCategory, selectedDifficulty]);

    return {
        animations: filteredAnimations,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDifficulty,
        setSelectedDifficulty,
        totalCount: animations.length,
        filteredCount: filteredAnimations.length
    };
}
