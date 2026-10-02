import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { themePresets } from '@/constants/theme-presets';

export const useThemePresets = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return useMemo(() => {
    return themePresets.map((preset) => ({
      ...preset,
      progressGradient: isDark
        ? preset.progressGradientDark
        : preset.progressGradientLight,
    }));
  }, [isDark]);
};
