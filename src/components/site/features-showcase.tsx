'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  Brain,
  Clock,
  FileText,
  CheckSquare,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Aceternity-inspired card with hover effect
const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
  gradient = 'from-primary/20 to-blue-500/20',
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  gradient?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className='group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md p-8 hover:shadow-xl transition-all duration-300'
    >
      {/* Gradient background */}
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br blur-xl',
          gradient
        )}
      />

      {/* Icon */}
      <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-primary group-hover:scale-110 transition-transform duration-300'>
        {icon}
      </div>

      {/* Content */}
      <h3 className='mb-3 text-xl font-bold text-white group-hover:text-primary transition-colors duration-300'>
        {title}
      </h3>
      <p className='text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300'>
        {description}
      </p>
    </motion.div>
  );
};

export default function FeaturesShowcase() {
  // Define the actual features of the app
  const features = [
    {
      icon: <LayoutDashboard className='h-6 w-6' />,
      title: 'Kanban Task Management',
      description:
        'Visualize your workflow with a flexible kanban board. Drag and drop tasks between columns to track progress from start to finish.',
      gradient: 'from-primary/20 to-blue-500/20',
    },
    {
      icon: <ListTodo className='h-6 w-6' />,
      title: 'Subtasks & Checklists',
      description:
        'Break down complex assignments into manageable subtasks and track completion with interactive checklists.',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <Brain className='h-6 w-6' />,
      title: 'AI Task Assistant',
      description:
        'Get smart suggestions for organizing your tasks, prioritizing your workload, and optimizing your study schedule.',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <FileText className='h-6 w-6' />,
      title: 'Study Notes',
      description:
        'Create, organize, and access your study notes directly within your workspace, keeping all your academic resources in one place.',
      gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Pomodoro Timer',
      description:
        'Boost your productivity with built-in pomodoro timing. Alternate focused work sessions with short breaks for maximum efficiency.',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: <CheckSquare className='h-6 w-6' />,
      title: 'Task Dashboard',
      description:
        'Get a comprehensive overview of your academic workload with an intuitive dashboard showing upcoming deadlines and progress.',
      gradient: 'from-cyan-500/20 to-teal-500/20',
    },
  ];

  return (
    <section id='features' className='relative py-24 overflow-hidden bg-black'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]'></div>
      <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10'></div>
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10'></div>

      {/* Glow effects */}
      <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-30'></div>
      <div className='absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20'></div>

      <div className='relative z-20 container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-sm mb-4'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 text-primary' />
            <span>Powerful Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
          >
            Everything you need to <span className='text-primary'>excel</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-zinc-400 max-w-3xl mx-auto'
          >
            AcademEase combines powerful task management tools with AI
            assistance to help you stay organized, focused, and on track with
            your academic goals.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.3 + index * 0.1}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
