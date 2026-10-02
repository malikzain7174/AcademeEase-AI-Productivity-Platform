'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProductScreens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effect for screens
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <section
      ref={containerRef}
      className='relative min-h-[80vh] py-16 md:py-20 overflow-hidden'
      id='product-screens'
    >
      {/* Background grid */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='text-center mb-12 md:mb-16'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Designed for{' '}
            <span className='text-primary'>academic excellence</span>
          </h2>
          <p className='text-lg text-zinc-400 max-w-2xl mx-auto'>
            A complete toolkit to organize your studies, track assignments, and
            collaborate with classmates.
          </p>
        </motion.div>

        {/* Mobile version - simple static mockup */}
        <div className='md:hidden'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='w-full max-w-md mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl'
          >
            <div className='h-6 bg-zinc-800 border-b border-white/10 flex items-center px-3'>
              <div className='flex space-x-1.5'>
                <div className='h-2 w-2 rounded-full bg-red-500'></div>
                <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
              </div>
            </div>
            <div className='aspect-[16/9] relative bg-zinc-900 p-4'>
              {/* Dashboard content mockup */}
              <div className='grid grid-cols-1 gap-4 h-full'>
                <div className='bg-zinc-800/50 rounded-lg p-3 border border-white/5'>
                  <div className='flex items-center gap-2 mb-4'>
                    <div className='h-4 w-4 rounded-full bg-primary'></div>
                    <div className='h-4 w-32 rounded bg-zinc-700'></div>
                  </div>
                  <div className='h-24 w-full rounded-md bg-zinc-700/50'></div>
                </div>

                <div className='bg-zinc-800/50 rounded-lg p-3 border border-white/5'>
                  <div className='flex justify-between items-center mb-3'>
                    <div className='h-4 w-24 rounded bg-zinc-700'></div>
                    <div className='h-6 w-6 rounded-full bg-primary/20'></div>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 py-2 border-t border-white/5'
                    >
                      <div className='h-3 w-3 rounded bg-zinc-700'></div>
                      <div className='h-3 w-full rounded bg-zinc-700'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop version - parallax screens */}
        <div className='relative h-[40vh] md:h-[60vh] hidden md:block'>
          {/* Mockup screens with parallax effect */}
          <motion.div
            className='absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl'
            style={{ y: y2, opacity, scale }}
          >
            {/* Main dashboard screen */}
            <div
              className={cn(
                'rounded-xl overflow-hidden border border-white/10 shadow-2xl',
                'transform -rotate-1 bg-zinc-900'
              )}
            >
              <div className='h-6 bg-zinc-800 border-b border-white/10 flex items-center px-3'>
                <div className='flex space-x-1.5'>
                  <div className='h-2 w-2 rounded-full bg-red-500'></div>
                  <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                </div>
              </div>
              <div className='aspect-[16/9] relative bg-zinc-900 p-4'>
                {/* Dashboard content mockup */}
                <div className='grid grid-cols-12 gap-4 h-full'>
                  {/* Sidebar */}
                  <div className='col-span-3 bg-zinc-800/50 rounded-lg p-3 border border-white/5'>
                    <div className='flex items-center gap-2 mb-6'>
                      <div className='h-6 w-6 rounded bg-primary/30'></div>
                      <div className='h-4 w-24 rounded bg-zinc-700'></div>
                    </div>
                    <div className='space-y-3'>
                      <div className='h-8 rounded bg-zinc-700/50 flex items-center px-2'>
                        <div className='h-3 w-3 rounded bg-primary mr-2'></div>
                        <div className='h-3 w-16 rounded bg-zinc-600'></div>
                      </div>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className='h-8 rounded bg-transparent flex items-center px-2'
                        >
                          <div className='h-3 w-3 rounded bg-zinc-600 mr-2'></div>
                          <div className='h-3 w-16 rounded bg-zinc-700'></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className='col-span-9 bg-zinc-800/30 rounded-lg p-4 border border-white/5'>
                    <div className='flex justify-between items-center mb-6'>
                      <div className='h-6 w-40 rounded bg-zinc-700'></div>
                      <div className='flex gap-2'>
                        <div className='h-8 w-8 rounded-full bg-zinc-700'></div>
                        <div className='h-8 w-24 rounded bg-primary/20'></div>
                      </div>
                    </div>

                    {/* Cards grid */}
                    <div className='grid grid-cols-3 gap-4 mb-6'>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className='bg-zinc-800/50 rounded-lg p-3 border border-white/5'
                        >
                          <div className='flex items-center gap-2 mb-2'>
                            <div className='h-3 w-3 rounded-full bg-primary'></div>
                            <div className='h-4 w-20 rounded bg-zinc-700'></div>
                          </div>
                          <div className='h-10 w-full rounded-md bg-zinc-700/50'></div>
                        </div>
                      ))}
                    </div>

                    {/* Table */}
                    <div className='bg-zinc-800/50 rounded-lg p-3 border border-white/5'>
                      <div className='grid grid-cols-4 gap-4 mb-3'>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className='h-4 rounded bg-zinc-700'
                          ></div>
                        ))}
                      </div>
                      {[1, 2, 3].map((row) => (
                        <div
                          key={row}
                          className='grid grid-cols-4 gap-4 py-3 border-t border-white/5'
                        >
                          {[1, 2, 3, 4].map((col) => (
                            <div
                              key={col}
                              className='h-4 rounded bg-zinc-700/50'
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side screens */}
          <motion.div
            className='absolute top-[20%] -left-[5%] w-[40%] max-w-md hidden lg:block'
            style={{ y: y1, opacity }}
          >
            <div
              className={cn(
                'rounded-xl overflow-hidden border border-white/10 shadow-2xl',
                'transform rotate-6 bg-zinc-900'
              )}
            >
              <div className='h-6 bg-zinc-800 border-b border-white/10 flex items-center px-3'>
                <div className='flex space-x-1.5'>
                  <div className='h-2 w-2 rounded-full bg-red-500'></div>
                  <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                </div>
              </div>
              <div className='aspect-video relative bg-zinc-900 p-4'>
                {/* Calendar view mockup */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <div className='h-5 w-24 rounded bg-zinc-700'></div>
                    <div className='flex gap-2'>
                      <div className='h-6 w-6 rounded bg-zinc-700'></div>
                      <div className='h-6 w-6 rounded bg-zinc-700'></div>
                    </div>
                  </div>

                  <div className='grid grid-cols-7 gap-1 mt-4'>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className='h-6 rounded bg-zinc-800 flex items-center justify-center'
                      >
                        <div className='h-3 w-3 rounded bg-zinc-700'></div>
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-7 gap-1'>
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-12 rounded ${i % 9 === 0 ? 'bg-primary/20' : 'bg-zinc-800'} p-1`}
                      >
                        <div className='h-3 w-3 rounded bg-zinc-700'></div>
                        {i % 9 === 0 && (
                          <div className='h-2 w-full rounded bg-primary/30 mt-2'></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className='absolute top-[30%] -right-[5%] w-[35%] max-w-sm hidden lg:block'
            style={{ y: y3, opacity }}
          >
            <div
              className={cn(
                'rounded-xl overflow-hidden border border-white/10 shadow-2xl',
                'transform -rotate-12 bg-zinc-900'
              )}
            >
              <div className='h-6 bg-zinc-800 border-b border-white/10 flex items-center px-3'>
                <div className='flex space-x-1.5'>
                  <div className='h-2 w-2 rounded-full bg-red-500'></div>
                  <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                </div>
              </div>
              <div className='aspect-[3/4] relative bg-zinc-900 p-4'>
                {/* Task detail mockup */}
                <div className='space-y-4'>
                  <div className='h-6 w-3/4 rounded bg-zinc-700'></div>

                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-primary'></div>
                    <div className='h-4 w-20 rounded bg-zinc-700'></div>
                  </div>

                  <div className='h-24 rounded bg-zinc-800 p-3'>
                    <div className='space-y-2'>
                      <div className='h-3 w-full rounded bg-zinc-700'></div>
                      <div className='h-3 w-5/6 rounded bg-zinc-700'></div>
                      <div className='h-3 w-4/6 rounded bg-zinc-700'></div>
                    </div>
                  </div>

                  <div className='h-5 w-1/3 rounded bg-zinc-700'></div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 rounded bg-zinc-700'></div>
                      <div className='h-4 w-full rounded bg-zinc-800'></div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 rounded bg-zinc-700'></div>
                      <div className='h-4 w-full rounded bg-zinc-800'></div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-2 mt-4'>
                    <div className='h-8 w-20 rounded bg-zinc-800'></div>
                    <div className='h-8 w-20 rounded bg-primary/30'></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent' />
    </section>
  );
}
