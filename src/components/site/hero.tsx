'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Kanban,
  ListTodo,
  FileText,
  Brain,
  Clock,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContainerScroll } from './container-scroll-animation';

// Refined glow effect component with more subtle animation
const GlowingButton = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      className={cn(
        'relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
      {...props}
    >
      <span className='absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#a855f7_100%)]' />
      <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
        {children}
      </span>
    </button>
  );
};

// Animated gradient text with more subtle animation
const GradientText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500',
        className
      )}
    >
      {children}
    </span>
  );
};

// Feature pill component with reduced animation
const FeaturePill = ({
  icon,
  text,
  delay = 0,
}: {
  icon: React.ReactNode;
  text: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      className='inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm text-zinc-300 backdrop-blur-md hover:bg-white/10 transition-colors duration-200 mr-2 mb-2'
    >
      <span className='mr-1.5 text-primary'>{icon}</span>
      {text}
    </motion.div>
  );
};

// Mock dashboard content for the container scroll
const MockDashboardContent = () => {
  return (
    <div className='w-full h-full bg-zinc-900 overflow-hidden rounded-xl'>
      {/* Browser chrome */}
      <div className='h-8 bg-zinc-800 border-b border-white/10 flex items-center px-3'>
        <div className='flex space-x-1.5'>
          <div className='h-2.5 w-2.5 rounded-full bg-red-500'></div>
          <div className='h-2.5 w-2.5 rounded-full bg-yellow-500'></div>
          <div className='h-2.5 w-2.5 rounded-full bg-green-500'></div>
        </div>
        <div className='mx-auto bg-zinc-700/50 rounded-full h-5 w-48 flex items-center justify-center'>
          <div className='h-2 w-32 bg-zinc-600 rounded-full'></div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className='p-4 md:p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div className='h-6 w-40 rounded bg-zinc-800'></div>
          <div className='flex gap-2'>
            <div className='h-8 w-8 rounded-full bg-zinc-800'></div>
            <div className='h-8 w-24 rounded bg-primary/20'></div>
          </div>
        </div>

        {/* Stats cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-zinc-800/50 rounded-lg p-4 border border-white/5 transition-all duration-200 hover:shadow-lg hover:border-white/10'
            >
              <div className='flex items-center gap-2 mb-2'>
                <div className='h-4 w-4 rounded-full bg-primary'></div>
                <div className='h-4 w-24 rounded bg-zinc-700'></div>
              </div>
              <div className='h-12 w-full rounded-md bg-zinc-700/50'></div>
            </div>
          ))}
        </div>

        {/* Task list */}
        <div className='bg-zinc-800/50 rounded-lg p-4 border border-white/5 mb-6 transition-all duration-200 hover:shadow-lg hover:border-white/10'>
          <div className='flex justify-between items-center mb-4'>
            <div className='h-5 w-32 rounded bg-zinc-700'></div>
            <div className='h-8 w-8 rounded-full bg-primary/20 transition-transform duration-200 hover:scale-105'></div>
          </div>

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='flex items-center gap-3 py-3 border-t border-white/5 group'
            >
              <div className='h-4 w-4 rounded bg-zinc-700 transition-transform duration-200 group-hover:scale-110'></div>
              <div className='flex-1'>
                <div className='h-4 w-full rounded bg-zinc-700 mb-2'></div>
                <div className='h-3 w-2/3 rounded bg-zinc-700/50'></div>
              </div>
              <div className='h-6 w-6 rounded-full bg-zinc-700 transition-all duration-200 group-hover:rotate-12'></div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className='bg-zinc-800/50 rounded-lg p-4 border border-white/5 mb-6 transition-all duration-200 hover:shadow-lg hover:border-white/10'>
          <div className='flex justify-between items-center mb-4'>
            <div className='h-5 w-32 rounded bg-zinc-700'></div>
            <div className='flex gap-2'>
              <div className='h-6 w-6 rounded bg-zinc-700 transition-transform duration-200 hover:scale-105'></div>
              <div className='h-6 w-6 rounded bg-zinc-700 transition-transform duration-200 hover:scale-105'></div>
            </div>
          </div>

          <div className='grid grid-cols-7 gap-1 mb-2'>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className='h-8 flex items-center justify-center'>
                <div className='h-4 w-4 rounded bg-zinc-700'></div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-1'>
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`h-12 rounded ${i % 7 === 2 || i % 9 === 0 ? 'bg-primary/20' : 'bg-zinc-800'} p-1 transition-all duration-200 hover:scale-105`}
              >
                <div className='h-3 w-3 rounded bg-zinc-700'></div>
                {(i % 7 === 2 || i % 9 === 0) && (
                  <div className='h-2 w-full rounded bg-primary/30 mt-2'></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chart section */}
        <div className='bg-zinc-800/50 rounded-lg p-4 border border-white/5 mb-6 transition-all duration-200 hover:shadow-lg hover:border-white/10'>
          <div className='h-5 w-32 rounded bg-zinc-700 mb-4'></div>
          <div className='h-40 w-full rounded bg-zinc-800 p-3'>
            <div className='flex h-full items-end gap-2'>
              {[30, 45, 60, 80, 50, 70, 90].map((height, i) => (
                <div
                  key={i}
                  className='flex-1 flex flex-col items-center gap-1 group'
                >
                  <div
                    className={`w-full rounded-t ${i % 3 === 0 ? 'bg-primary/50' : 'bg-zinc-700/70'} transition-all duration-200 group-hover:bg-primary/70`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className='h-2 w-4 rounded bg-zinc-700'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  // Scroll to dashboard section
  const scrollToDashboard = () => {
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) {
      dashboardSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className='relative w-full overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Animated gradient orbs with more subtle animation */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px] opacity-10' />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[120px] opacity-10' />

      {/* Radial gradient */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]' />

      <div className='container relative z-10 mt-32 mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-center min-h-[50vh] pt-6 md:pt-12'>
          {/* Main heading with animated gradient */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-4xl mx-auto space-y-4 text-center'
          >
            <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight'>
              Organize your <GradientText>academic</GradientText>{' '}
              <GradientText>life</GradientText> with ease
            </h1>

            <p className='mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto'>
              A simple yet powerful task manager designed specifically for
              students. Manage assignments, track progress, and boost your
              productivity.
            </p>
          </motion.div>

          {/* CTA buttons with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 w-full sm:w-auto'
          >
            <Link href='/signup' className='w-full sm:w-auto'>
              <GlowingButton className='w-full sm:w-auto'>
                Get started for free
              </GlowingButton>
            </Link>

            <Link
              href='#features'
              className='w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-white/5 px-6 sm:px-8 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10 transition-colors duration-200 border border-white/10'
            >
              Learn more
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </motion.div>

          {/* Feature pills - hidden on smallest screens, simplified on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='mt-6 md:mt-8 hidden sm:block'
          >
            <FeaturePill
              icon={<Kanban className='h-3.5 w-3.5' />}
              text='Kanban Board'
              delay={0.1}
            />
            <FeaturePill
              icon={<ListTodo className='h-3.5 w-3.5' />}
              text='Subtasks'
              delay={0.15}
            />
            <FeaturePill
              icon={<Brain className='h-3.5 w-3.5' />}
              text='AI Assistant'
              delay={0.2}
            />
            <FeaturePill
              icon={<FileText className='h-3.5 w-3.5' />}
              text='Study Notes'
              delay={0.25}
            />
            <FeaturePill
              icon={<Clock className='h-3.5 w-3.5' />}
              text='Pomodoro Timer'
              delay={0.3}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className='mt-8 md:mt-12 flex flex-col items-center cursor-pointer'
            onClick={scrollToDashboard}
          >
            <p className='text-zinc-500 text-sm mb-2'>Explore the dashboard</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className='bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors'
            >
              <ChevronDown className='h-5 w-5 text-zinc-400' />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Container Scroll Animation with Mock Dashboard */}
      <div className='md:mt-0' id='dashboard-section'>
        <ContainerScroll
          titleComponent={
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              Powerful <span className='text-primary'>dashboard</span> for
              students
            </h2>
          }
        >
          <MockDashboardContent />
        </ContainerScroll>
      </div>
    </section>
  );
}
