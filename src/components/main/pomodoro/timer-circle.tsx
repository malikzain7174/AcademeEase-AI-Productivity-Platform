import { ThemePreset } from '@/constants/theme-presets';
import { motion } from 'framer-motion';

export default function TimerCircle({
  isSession,
  selectedTheme,
  progress,
  formatTime,
  currentTime,
  sessionTime,
  breakTime,
}: {
  isSession: boolean;
  selectedTheme: ThemePreset;
  progress: number;
  formatTime: (time: number) => string;
  currentTime: number;
  sessionTime: number;
  breakTime: number;
}) {
  return (
    <div className='flex relative w-64 h-64 sm:w-80 sm:h-80 items-center justify-center mb-4 sm:mb-6'>
      <div className='absolute inset-0'>
        {/* Animated waves - rendered first */}
        {selectedTheme.animation === 'wave' && (
          <div className='absolute inset-0 overflow-hidden rounded-full z-0'>
            <svg
              className='w-full h-full'
              viewBox='0 0 100 180'
              preserveAspectRatio='none'
            >
              <defs>
                <linearGradient
                  id={`gradient-${selectedTheme.id}`}
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop
                    offset='0%'
                    stopColor={selectedTheme.progressGradient
                      .split(',')[0]
                      .replace('linear-gradient(45deg, ', '')}
                  />
                  <stop
                    offset='100%'
                    stopColor={selectedTheme.progressGradient
                      .split(',')[1]
                      .replace(')', '')}
                  />
                </linearGradient>
              </defs>

              {/* Background waves */}
              <motion.path
                d='M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z'
                fill={selectedTheme.wavesColor}
                fillOpacity='0.3'
                animate={{
                  d: [
                    'M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z',
                    'M-50,75 Q-25,85 0,75 Q25,65 50,75 Q75,85 100,75 Q125,65 150,75 L150,180 L-50,180 Z',
                    'M-50,75 Q-25,65 0,75 Q25,85 50,75 Q75,65 100,75 Q125,85 150,75 L150,180 L-50,180 Z',
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.path
                d='M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z'
                fill={selectedTheme.wavesColor}
                fillOpacity='0.5'
                animate={{
                  d: [
                    'M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z',
                    'M-50,95 Q-25,105 0,95 Q25,85 50,95 Q75,105 100,95 Q125,85 150,95 L150,180 L-50,180 Z',
                    'M-50,95 Q-25,85 0,95 Q25,105 50,95 Q75,85 100,95 Q125,105 150,95 L150,180 L-50,180 Z',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </div>
        )}

        {/* Main SVG with circles - rendered after waves */}
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          <defs>
            <linearGradient
              id='progressGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop
                offset='0%'
                stopColor={
                  isSession
                    ? selectedTheme.progressGradient
                        .split(',')[0]
                        .replace('linear-gradient(45deg, ', '')
                    : 'var(--secondary)'
                }
              />
              <stop
                offset='100%'
                stopColor={
                  isSession
                    ? selectedTheme.progressGradient
                        .split(',')[1]
                        .replace(')', '')
                    : 'var(--secondary)'
                }
                stopOpacity='0.5'
              />
            </linearGradient>
            <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
              <feGaussianBlur stdDeviation='3' result='blur' />
              <feComposite in='SourceGraphic' in2='blur' operator='over' />
            </filter>
            <filter id='focusGlow' filterUnits='userSpaceOnUse'>
              <feGaussianBlur stdDeviation='1.5' result='blur' />
              <feFlood
                floodColor={selectedTheme.wavesColor}
                floodOpacity='0.5'
                result='coloredBlur'
              />
              <feComposite
                in='coloredBlur'
                in2='blur'
                operator='in'
                result='coloredBlurOpaque'
              />
              <feComposite
                in='SourceGraphic'
                in2='coloredBlurOpaque'
                operator='over'
              />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx='50'
            cy='50'
            r='46'
            fill='none'
            stroke='currentColor'
            strokeOpacity='0.1'
            strokeWidth='8'
          />

          {/* Progress circle with glow */}
          <circle
            cx='50'
            cy='50'
            r='46'
            fill='none'
            stroke='url(#progressGradient)'
            strokeWidth='8'
            strokeLinecap='round'
            strokeDasharray='289.02652413026095'
            strokeDashoffset={
              289.02652413026095 - (289.02652413026095 * progress) / 100
            }
            transform='rotate(-90 50 50)'
            filter='url(#focusGlow)'
          />
        </svg>
      </div>

      {/* Timer text */}
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className='text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter'>
          {formatTime(currentTime)}
        </span>
        <span className='text-xs sm:text-sm text-foreground mt-1 sm:mt-2'>
          {isSession ? `${sessionTime} min session` : `${breakTime} min break`}
        </span>
      </div>
    </div>
  );
}
