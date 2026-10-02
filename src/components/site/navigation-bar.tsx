'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Airplay, Menu, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const windowHeight = window.innerHeight;

      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Show scroll-to-top button when scrolled halfway down the viewport
      if (offset > windowHeight / 2) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      setIsVerySmallScreen(window.innerWidth < 640);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Tools', href: '#tools' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 right-0 z-50'
      >
        <header
          className={cn(
            'transition-all duration-300 h-16',
            scrolled
              ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-md'
              : 'bg-transparent border-transparent'
          )}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center'>
              <Button
                className='flex justify-center items-center group'
                variant='link'
                asChild
              >
                <Link href='/' className='flex items-center gap-2 text-white'>
                  <div className='w-7 h-7 bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900 rounded-md flex items-center justify-center shadow-sm'>
                    <Airplay className='w-4 h-4 text-zinc-900 dark:text-zinc-100' />
                  </div>
                  <h1 className='font-bold text-lg'>
                    Academ<span className='text-zinc-100'>Ease</span>
                    {!isVerySmallScreen && (
                      <span className='text-zinc-400 text-xs font-semibold ml-0.5'>
                        .{process.env.NEXT_PUBLIC_LOGO_SUBSCRIPT}
                      </span>
                    )}
                  </h1>
                </Link>
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center gap-4 lg:gap-8'>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='relative py-1.5 text-sm text-zinc-400 transition-colors duration-200 hover:text-white group'
                >
                  {item.name}
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 group-hover:w-full' />
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* Get Started button - shown conditionally based on screen size */}
              {!isSmallScreen ? (
                <Button
                  variant='blue'
                  className='group relative overflow-hidden hover:shadow-blue-500/20'
                  asChild
                >
                  <Link href='/signup' className='flex items-center'>
                    <span className='relative z-10'>
                      Get Started
                      <ArrowRight className='ml-2 h-4 w-4 inline-block transition-transform duration-200 group-hover:translate-x-1' />
                    </span>
                  </Link>
                </Button>
              ) : (
                <Button
                  variant='blue'
                  size='sm'
                  className='hidden sm:flex md:hidden group relative overflow-hidden hover:shadow-blue-500/20'
                  asChild
                >
                  <Link href='/signup' className='flex items-center'>
                    <span className='relative z-10'>Get Started</span>
                  </Link>
                </Button>
              )}

              {/* Mobile menu button */}
              <button
                className='md:hidden p-2 text-white rounded-full hover:bg-zinc-800/50 transition-colors duration-200 focus:outline-none'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className='h-5 w-5' />
                ) : (
                  <Menu className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className='md:hidden bg-black/90 backdrop-blur-lg border-b border-white/10'
          >
            <div className='max-w-7xl mx-auto px-4 py-6'>
              <nav className='flex flex-col space-y-6'>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='text-lg font-medium text-zinc-300 hover:text-white transition-colors duration-200'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button variant='blue' className='w-full group' asChild>
                  <Link
                    href='/signup'
                    className='flex items-center justify-center'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                  </Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll to top button - only visible on mobile when scrolled halfway */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              duration: 0.3,
            }}
            onClick={scrollToTop}
            className='fixed bottom-6 right-6 z-50 w-10 h-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-md flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:bg-black/90 hover:border-white/20 hover:scale-105 active:scale-95 group'
            aria-label='Scroll to top'
          >
            <ChevronUp className='h-4 w-4 text-zinc-400 group-hover:text-white transition-colors duration-200' />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
