'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='fixed inset-0 -z-10 h-full w-full overflow-hidden'>
      {/* Grid pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]' />

      {/* Gradient blobs */}
      <motion.div
        className='absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10'
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.4, 0.2, 0.4],
          x: [0, 10, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <motion.div
        className='absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10'
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.15, 0.3],
          x: [0, -10, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1,
        }}
      />

      <motion.div
        className='absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/10'
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.25, 0.1, 0.25],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 2,
        }}
      />

      {/* Radial gradient overlay */}
      <div className='absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
    </div>
  );
};

export default AnimatedBackground;
