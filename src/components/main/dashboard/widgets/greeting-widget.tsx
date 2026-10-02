'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  CloudSun,
  CloudMoon,
  CloudFog,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GreetingWidgetProps {
  userName?: string;
}

// Inspirational quotes for students
const quotes = [
  {
    text: 'The expert in anything was once a beginner.',
    author: 'Helen Hayes',
  },
  {
    text: 'The beautiful thing about learning is that no one can take it away from you.',
    author: 'B.B. King',
  },
  { text: 'Education is the passport to the future.', author: 'Malcolm X' },
  {
    text: 'The more that you read, the more things you will know.',
    author: 'Dr. Seuss',
  },
  {
    text: 'Learning is never done without errors and defeat.',
    author: 'Vladimir Lenin',
  },
  {
    text: 'The mind is not a vessel to be filled, but a fire to be kindled.',
    author: 'Plutarch',
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: 'Zig Ziglar',
  },
  {
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: "Believe you can and you're halfway there.",
    author: 'Theodore Roosevelt',
  },
];

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

export const GreetingWidget = ({ userName }: GreetingWidgetProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [quote, setQuote] = useState(quotes[0]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate weather data as fallback
    const simulateWeatherData = () => {
      const conditions = [
        'Clear',
        'Partly Cloudy',
        'Cloudy',
        'Light Rain',
        'Heavy Rain',
        'Thunderstorm',
        'Foggy',
        'Snow',
      ];
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C

      setWeather({
        temp: randomTemp,
        condition: randomCondition,
        icon: '',
      });
    };

    simulateWeatherData();

    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    return () => clearInterval(interval);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  // Format date
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get weather icon based on condition with animations
  const getWeatherIcon = () => {
    if (!weather) {
      return isDark ? (
        <Moon className='h-8 w-8 text-indigo-300 animate-pulse' />
      ) : (
        <Sun className='h-8 w-8 text-yellow-500 animate-pulse' />
      );
    }

    const condition = weather.condition.toLowerCase();
    const baseClasses = 'h-8 w-8';

    if (condition.includes('clear') || condition.includes('sunny')) {
      return (
        <Sun className={cn(baseClasses, 'text-yellow-500 animate-spin-slow')} />
      );
    } else if (condition.includes('partly')) {
      return isDark ? (
        <CloudMoon className={cn(baseClasses, 'text-blue-300')} />
      ) : (
        <CloudSun className={cn(baseClasses, 'text-yellow-400')} />
      );
    } else if (condition.includes('cloud')) {
      return (
        <Cloud
          className={cn(baseClasses, 'text-blue-400 animate-bounce-slow')}
        />
      );
    } else if (condition.includes('rain') && !condition.includes('heavy')) {
      return (
        <CloudRain className={cn(baseClasses, 'text-blue-500 animate-pulse')} />
      );
    } else if (condition.includes('heavy') || condition.includes('thunder')) {
      return (
        <CloudRain
          className={cn(baseClasses, 'text-blue-600 animate-bounce')}
        />
      );
    } else if (condition.includes('snow')) {
      return (
        <Snowflake className={cn(baseClasses, 'text-blue-300 animate-pulse')} />
      );
    } else if (condition.includes('fog')) {
      return (
        <CloudFog className={cn(baseClasses, 'text-gray-400 animate-pulse')} />
      );
    } else {
      return isDark ? (
        <Moon className={cn(baseClasses, 'text-indigo-300')} />
      ) : (
        <Sun className={cn(baseClasses, 'text-yellow-500')} />
      );
    }
  };

  // Get time icon based on time of day and theme
  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    const isDay = hour >= 6 && hour < 18;

    if (isDay && !isDark) {
      return <Sun className='h-6 w-6 text-yellow-500 animate-spin-slow' />;
    } else {
      return <Moon className='h-6 w-6 text-indigo-300 animate-pulse' />;
    }
  };

  if (!mounted) {
    return (
      <Card className='border-none bg-gradient-to-r from-primary/5 via-primary/10 to-background shadow-sm'>
        <CardContent className='p-3'>
          <div className='h-6 bg-muted rounded animate-pulse w-1/3' />
          <div className='h-3 bg-muted rounded animate-pulse w-1/2 mt-2' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm relative overflow-hidden'>
      <CardContent className='p-3 relative z-10'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0'>
          {/* Left section - Greeting and date */}
          <div className='w-full sm:max-w-[70%]'>
            <h2 className='text-lg font-bold flex items-center gap-2'>
              {getGreeting()}, {userName || 'Scholar'}!
              <span className='text-primary transition-all duration-300 hover:scale-110'>
                {getTimeIcon()}
              </span>
            </h2>
            <p className='text-xs text-muted-foreground'>{formatDate()}</p>

            {/* Quote - Hidden on mobile, visible on larger screens */}
            <div className='hidden sm:block mt-1 text-xs text-muted-foreground italic'>
              &quot;{quote.text}&quot;{' '}
              <span className='font-bold'>— {quote.author}</span>
            </div>
          </div>

          {/* Right section - Weather - Completely hidden on mobile */}
          <div className='hidden sm:flex sm:flex-col sm:items-end'>
            <div className='flex items-center gap-2'>
              {getWeatherIcon()}
              <div className='text-right'>
                <p className='text-xs font-medium'>{weather?.condition}</p>
                <p className='text-base font-semibold'>{weather?.temp}°C</p>
              </div>
            </div>

            <div className='mt-1 text-xs text-right'>
              <span className='font-medium text-primary'>Focus:</span>
              <span className='text-muted-foreground'>
                {' '}
                Complete important tasks
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
