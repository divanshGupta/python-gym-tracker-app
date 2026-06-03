import { useContributions } from './useContributions';
export function useStreak() {
    const { summary, isLoading, error } = useContributions('yearly');
    return {
        currentStreak: summary?.currentStreak ?? 0,
        longestStreak: summary?.longestStreak ?? 0,
        isLoading,
        error,
    };
}
