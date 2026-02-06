import { useCoupleStore } from '@/stores/useCoupleStore';
import { THEMES } from '@/lib/constants';
import type { ThemeColors } from '@/lib/types';

export const useTheme = (): ThemeColors => {
  const theme = useCoupleStore((state) => state.profile?.theme ?? 'rose');
  return THEMES[theme];
};
