import {
  CircleDot,
  Sparkles,
  Sun,
  Sunset,
  Trees,
  Waves,
  Moon,
  Gem,
  Flower,
  Zap,
  Snowflake,
  Flame,
  Building,
  Mountain,
  Heart,
} from 'lucide-react';

export type ThemePreset = {
  id: string;
  name: string;
  background: string;
  progressGradientLight: string;
  progressGradientDark: string;
  wavesColor: string;
  animation: string;
  icon: React.ReactNode;
  progressGradient: string;
};

export type BaseThemePreset = Omit<ThemePreset, 'progressGradient'>;

const additionalThemePresets: BaseThemePreset[] = [
  {
    id: 'desert-dunes',
    name: 'Desert Dunes',
    background:
      'bg-gradient-to-br from-yellow-500/20 via-amber-400/10 to-orange-500/20',
    progressGradientLight: 'linear-gradient(45deg, #fbbf24, #fcd34d)',
    progressGradientDark: 'linear-gradient(45deg, #d97706, #f59e0b)',
    wavesColor: '#f59e0b',
    animation: 'wave',
    icon: <Sun className='h-4 w-4' />,
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    background:
      'bg-gradient-to-br from-indigo-900/30 via-blue-900/20 to-purple-900/30',
    progressGradientLight: 'linear-gradient(45deg, #818cf8, #a5b4fc)',
    progressGradientDark: 'linear-gradient(45deg, #4f46e5, #6366f1)',
    wavesColor: '#818cf8',
    animation: 'wave',
    icon: <Moon className='h-4 w-4' />,
  },
  {
    id: 'crystal-cove',
    name: 'Crystal Cove',
    background:
      'bg-gradient-to-br from-teal-400/20 via-cyan-400/10 to-blue-400/20',
    progressGradientLight: 'linear-gradient(45deg, #5eead4, #67e8f9)',
    progressGradientDark: 'linear-gradient(45deg, #2dd4bf, #22d3ee)',
    wavesColor: '#22d3ee',
    animation: 'wave',
    icon: <Gem className='h-4 w-4' />,
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    background:
      'bg-gradient-to-br from-pink-400/20 via-rose-300/10 to-fuchsia-400/20',
    progressGradientLight: 'linear-gradient(45deg, #f9a8d4, #f472b6)',
    progressGradientDark: 'linear-gradient(45deg, #ec4899, #db2777)',
    wavesColor: '#ec4899',
    animation: 'wave',
    icon: <Flower className='h-4 w-4' />,
  },
  {
    id: 'midnight-city',
    name: 'Midnight City',
    background:
      'bg-gradient-to-br from-slate-700/30 via-gray-800/20 to-zinc-900/30',
    progressGradientLight: 'linear-gradient(45deg, #94a3b8, #cbd5e1)',
    progressGradientDark: 'linear-gradient(45deg, #64748b, #475569)',
    wavesColor: '#94a3b8',
    animation: 'wave',
    icon: <Building className='h-4 w-4' />,
  },
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    background:
      'bg-gradient-to-br from-fuchsia-500/20 via-pink-400/10 to-cyan-400/20',
    progressGradientLight: 'linear-gradient(45deg, #e879f9, #38bdf8)',
    progressGradientDark: 'linear-gradient(45deg, #e879f9, #3b82f6)',
    wavesColor: '#e879f9',
    animation: 'wave',
    icon: <Zap className='h-4 w-4' />,
  },
  {
    id: 'mountain-peak',
    name: 'Mountain Peak',
    background:
      'bg-gradient-to-br from-stone-300/20 via-slate-200/10 to-blue-100/20',
    progressGradientLight: 'linear-gradient(45deg, #cbd5e1, #e2e8f0)',
    progressGradientDark: 'linear-gradient(45deg, #64748b, #475569)',
    wavesColor: '#94a3b8',
    animation: 'wave',
    icon: <Mountain className='h-4 w-4' />,
  },
  {
    id: 'candy-land',
    name: 'Candy Land',
    background:
      'bg-gradient-to-br from-pink-300/30 via-purple-200/20 to-rose-300/30',
    progressGradientLight: 'linear-gradient(45deg, #f9a8d4, #fda4af)',
    progressGradientDark: 'linear-gradient(45deg, #f472b6, #fb7185)',
    wavesColor: '#f472b6',
    animation: 'wave',
    icon: <Heart className='h-4 w-4' />,
  },
  {
    id: 'frostbite',
    name: 'Frostbite',
    background:
      'bg-gradient-to-br from-indigo-200/30 via-blue-100/20 to-cyan-100/30',
    progressGradientLight: 'linear-gradient(45deg, #7dd3fc, #bae6fd)',
    progressGradientDark: 'linear-gradient(45deg, #60a5fa, #38bdf8)',
    wavesColor: '#7dd3fc',
    animation: 'wave',
    icon: <Snowflake className='h-4 w-4' />,
  },
  {
    id: 'lava-flow',
    name: 'Lava Flow',
    background:
      'bg-gradient-to-br from-red-500/30 via-orange-500/20 to-amber-500/30',
    progressGradientLight: 'linear-gradient(45deg, #f87171, #fb923c)',
    progressGradientDark: 'linear-gradient(45deg, #dc2626, #ea580c)',
    wavesColor: '#f97316',
    animation: 'wave',
    icon: <Flame className='h-4 w-4' />,
  },
];

export const themePresets: BaseThemePreset[] = [
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    background:
      'bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-600/20',
    progressGradientLight: 'linear-gradient(45deg, #7dd3fc, #3b82f6)',
    progressGradientDark: 'linear-gradient(45deg, #0ea5e9, #2563eb)',
    wavesColor: '#0ea5e9',
    animation: 'wave',
    icon: <Waves className='h-4 w-4' />,
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    background:
      'bg-gradient-to-br from-orange-500/20 via-amber-400/10 to-red-500/20',
    progressGradientLight: 'linear-gradient(45deg, #fdba74, #fb7185)',
    progressGradientDark: 'linear-gradient(45deg, #f97316, #ef4444)',
    wavesColor: '#f97316',
    animation: 'wave',
    icon: <Sunset className='h-4 w-4' />,
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    background:
      'bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-teal-500/20',
    progressGradientLight: 'linear-gradient(45deg, #6ee7b7, #34d399)',
    progressGradientDark: 'linear-gradient(45deg, #10b981, #059669)',
    wavesColor: '#10b981',
    animation: 'wave',
    icon: <Trees className='h-4 w-4' />,
  },
  {
    id: 'aurora-lights',
    name: 'Aurora Lights',
    background:
      'bg-gradient-to-br from-purple-500/20 via-violet-400/10 to-indigo-500/20',
    progressGradientLight: 'linear-gradient(45deg, #c4b5fd, #a78bfa)',
    progressGradientDark: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
    wavesColor: '#8b5cf6',
    animation: 'wave',
    icon: <Sparkles className='h-4 w-4' />,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    background: 'bg-background/50',
    progressGradientLight:
      'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)))',
    progressGradientDark:
      'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)))',
    wavesColor: 'hsl(var(--primary))',
    animation: 'wave',
    icon: <CircleDot className='h-4 w-4' />,
  },
  ...additionalThemePresets,
];
