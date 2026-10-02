'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// List of motivational quotes
const quotes = [
  'The secret of getting ahead is getting started. - Mark Twain',
  "It always seems impossible until it's done. - Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  'The way to get started is to quit talking and begin doing. - Walt Disney',
  'It does not matter how slowly you go as long as you do not stop. - Confucius',
  'Quality is not an act, it is a habit. - Aristotle',
  'Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill',
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  'The future depends on what you do today. - Mahatma Gandhi',
  'The only way to do great work is to love what you do. - Steve Jobs',
  "Don't count the days, make the days count. - Muhammad Ali",
  'You are never too old to set another goal or to dream a new dream. - C.S. Lewis',
  'The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt',
  'Focus on being productive instead of busy. - Tim Ferriss',
  'The most effective way to do it, is to do it. - Amelia Earhart',
  'Small progress is still progress. - Unknown',
  'Productivity is never an accident. It is always the result of a commitment to excellence. - Paul J. Meyer',
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey",
  "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
  'The difference between ordinary and extraordinary is that little extra. - Jimmy Johnson',
  'Productivity is being able to do things that you were never able to do before. - Franz Kafka',
  'Time is what we want most, but what we use worst. - William Penn',
  'The only place where success comes before work is in the dictionary. - Vidal Sassoon',
  'Action is the foundational key to all success. - Pablo Picasso',
];

// Quote categories
const quoteCategories = {
  focus: [0, 2, 4, 6, 8, 14, 16, 17, 18, 24],
  motivation: [1, 3, 5, 7, 9, 11, 13, 19, 21, 23],
  inspiration: [10, 12, 15, 20, 22],
};

interface QuoteDisplayProps {
  theme?: string;
  isSession?: boolean;
}

export function QuoteDisplay({
  theme = 'ocean-waves',
  isSession = true,
}: QuoteDisplayProps) {
  const [currentQuote, setCurrentQuote] = useState('');
  const [quoteKey, setQuoteKey] = useState(0);
  const [category, setCategory] =
    useState<keyof typeof quoteCategories>('focus');

  // Get a random quote, optionally from a specific category
  const getRandomQuote = (specificCategory?: keyof typeof quoteCategories) => {
    const categoryToUse = specificCategory || category;
    const quoteIndices = quoteCategories[categoryToUse];
    const randomIndex =
      quoteIndices[Math.floor(Math.random() * quoteIndices.length)];
    return quotes[randomIndex];
  };

  // Update category based on session type
  useEffect(() => {
    if (isSession) {
      setCategory('focus');
    } else {
      setCategory('motivation');
    }
  }, [isSession]);

  // Change quote every 2 minutes or when session type changes
  useEffect(() => {
    setQuoteKey((prev) => prev + 1);
    setCurrentQuote(getRandomQuote());

    const interval = setInterval(
      () => {
        setQuoteKey((prev) => prev + 1);
        setCurrentQuote(getRandomQuote());
      },
      2 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [category]);

  // Get theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'ocean-waves':
        return 'bg-blue-50/30 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'sunset-glow':
        return 'bg-orange-50/30 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
      case 'forest-mist':
        return 'bg-green-50/30 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'aurora-lights':
        return 'bg-purple-50/30 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-background/50 border-border';
    }
  };

  // Manually refresh the quote
  const refreshQuote = () => {
    setQuoteKey((prev) => prev + 1);
    setCurrentQuote(getRandomQuote());
  };

  return (
    <Card
      className={cn(
        'shadow-md hover:shadow-lg transition-all duration-300 border',
        getThemeStyles()
      )}
    >
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex items-center space-x-2'>
            <Quote className='h-5 w-5 text-primary flex-shrink-0' />
            <h3 className='text-sm font-medium'>
              {isSession ? 'Focus Quote' : 'Break Quote'}
            </h3>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-200'
            onClick={refreshQuote}
          >
            <RefreshCw className='h-4 w-4 text-primary' />
          </Button>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={quoteKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className='flex-1'
          >
            <p className='text-lg italic leading-relaxed'>{currentQuote}</p>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
