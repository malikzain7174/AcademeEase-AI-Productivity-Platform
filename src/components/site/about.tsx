'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Brain, Target, Sparkles } from 'lucide-react';
import Image from 'next/image';

export const AboutSection = () => {
  return (
    <section id='about-us' className='relative py-24 overflow-hidden'>
      {/* Background elements - subtle, non-grid pattern */}
      <div className='absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90' />

      {/* Decorative blobs */}
      <div className='absolute top-1/4 right-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10' />
      <div className='absolute bottom-1/4 left-0 h-64 w-64 bg-secondary/5 rounded-full blur-3xl dark:bg-secondary/10' />

      {/* Decorative dots - different from hero section */}
      <div className='absolute inset-0'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='absolute size-1 md:size-1.5 rounded-full bg-primary/20 dark:bg-primary/30'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-3 py-1 text-sm rounded-full bg-primary/10 text-primary mb-4'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2' />
            <span>Our Mission</span>
          </motion.div>

          <motion.h2
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Empowering students to{' '}
            <span className='text-primary'>achieve more</span>
          </motion.h2>

          <motion.p
            className='text-lg text-muted-foreground max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We believe that every student deserves tools that help them focus on
            what matters most: learning and growing. Our platform is designed to
            eliminate the stress of managing academic responsibilities.
          </motion.p>
        </div>

        {/* Values section - horizontal layout instead of grid */}
        <div className='flex flex-col space-y-16 mt-20'>
          {/* Value 1 */}
          <motion.div
            className='flex flex-col md:flex-row items-center md:items-start gap-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className='flex-shrink-0'>
              <div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'>
                <GraduationCap className='w-8 h-8' />
              </div>
            </div>
            <div>
              <h3 className='text-xl md:text-2xl font-bold mb-3'>
                Academic Excellence
              </h3>
              <p className='text-muted-foreground'>
                We're committed to helping students achieve their academic goals
                through intelligent task management, deadline tracking, and
                collaborative tools that enhance the learning experience.
              </p>
            </div>
          </motion.div>

          {/* Value 2 */}
          <motion.div
            className='flex flex-col md:flex-row items-center md:items-start gap-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className='flex-shrink-0'>
              <div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400'>
                <BookOpen className='w-8 h-8' />
              </div>
            </div>
            <div>
              <h3 className='text-xl md:text-2xl font-bold mb-3'>
                Lifelong Learning
              </h3>
              <p className='text-muted-foreground'>
                We foster a mindset of continuous improvement and learning. Our
                platform adapts to your study habits and helps you develop
                effective strategies for long-term academic success.
              </p>
            </div>
          </motion.div>

          {/* Value 3 */}
          <motion.div
            className='flex flex-col md:flex-row items-center md:items-start gap-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className='flex-shrink-0'>
              <div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400'>
                <Brain className='w-8 h-8' />
              </div>
            </div>
            <div>
              <h3 className='text-xl md:text-2xl font-bold mb-3'>
                Student-Centered Design
              </h3>
              <p className='text-muted-foreground'>
                Every feature in AcademEase is designed with students in mind.
                We prioritize intuitive interfaces, accessibility, and tools
                that genuinely enhance the academic experience.
              </p>
            </div>
          </motion.div>

          {/* Value 4 */}
          <motion.div
            className='flex flex-col md:flex-row items-center md:items-start gap-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='flex-shrink-0'>
              <div className='flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'>
                <Target className='w-8 h-8' />
              </div>
            </div>
            <div>
              <h3 className='text-xl md:text-2xl font-bold mb-3'>
                Goal Achievement
              </h3>
              <p className='text-muted-foreground'>
                We believe in the power of setting and achieving goals. Our
                platform helps you break down large academic objectives into
                manageable tasks and celebrate your progress along the way.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats - centered layout */}
        <motion.div
          className='mt-24 p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border shadow-lg'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <p className='text-4xl md:text-5xl font-bold text-primary mb-2'>
                10,000+
              </p>
              <p className='text-muted-foreground'>Active Students</p>
            </div>
            <div>
              <p className='text-4xl md:text-5xl font-bold text-primary mb-2'>
                98%
              </p>
              <p className='text-muted-foreground'>Improved Productivity</p>
            </div>
            <div>
              <p className='text-4xl md:text-5xl font-bold text-primary mb-2'>
                50+
              </p>
              <p className='text-muted-foreground'>Universities</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
