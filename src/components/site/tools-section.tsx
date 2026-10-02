'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Kanban,
  ListTodo,
  Bot,
  FileText,
  Clock,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Aceternity-inspired 3D card
const ToolCard = ({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md',
        'hover:shadow-xl transition-all duration-300 hover:border-white/20',
        index % 2 === 0 ? 'lg:translate-y-12' : ''
      )}
    >
      {/* Gradient hover effect */}
      <div
        className='absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10'
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* Content */}
      <div className='p-6 pb-8'>
        <div className='flex items-center mb-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mr-3 group-hover:scale-110 transition-transform duration-300'>
            {icon}
          </div>
          <h3 className='text-xl font-bold text-white group-hover:text-primary transition-colors duration-300'>
            {title}
          </h3>
        </div>
        <p className='text-zinc-400 mb-6 group-hover:text-zinc-300 transition-colors duration-300'>
          {description}
        </p>

        {/* Gradient showcase area instead of image */}
        <div className='relative h-[180px] w-full overflow-hidden rounded-lg border border-white/10 transform group-hover:translate-y-[-5px] group-hover:rotate-1 transition-all duration-500'>
          {/* Gradient background */}
          <div
            className='absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500'
            style={{
              backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
          />

          {/* Grid pattern overlay */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]' />

          {/* Center icon */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-white/80 transform scale-[2.5] group-hover:scale-[3] transition-transform duration-500 group-hover:rotate-12'>
              {icon}
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div className='absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent' />
        </div>
      </div>
    </motion.div>
  );
};

export default function ToolsSection() {
  const tools = [
    {
      title: 'Kanban Board',
      description:
        'Visualize your workflow with customizable columns. Drag and drop tasks to track progress from start to finish.',
      icon: <Kanban className='h-5 w-5' />,
      gradientFrom: 'rgba(59, 130, 246, 0.3)',
      gradientTo: 'rgba(37, 99, 235, 0.3)',
    },
    {
      title: 'Task Management',
      description:
        'Create tasks with deadlines, priorities, and detailed descriptions to keep track of all your academic work.',
      icon: <ListTodo className='h-5 w-5' />,
      gradientFrom: 'rgba(16, 185, 129, 0.3)',
      gradientTo: 'rgba(5, 150, 105, 0.3)',
    },
    {
      title: 'AI Assistant',
      description:
        'Get smart suggestions for organizing tasks, prioritizing your workload, and optimizing your study schedule.',
      icon: <Bot className='h-5 w-5' />,
      gradientFrom: 'rgba(139, 92, 246, 0.3)',
      gradientTo: 'rgba(124, 58, 237, 0.3)',
    },
    {
      title: 'Study Notes',
      description:
        'Create, organize, and access your study notes directly within your workspace.',
      icon: <FileText className='h-5 w-5' />,
      gradientFrom: 'rgba(236, 72, 153, 0.3)',
      gradientTo: 'rgba(219, 39, 119, 0.3)',
    },
    {
      title: 'Pomodoro Timer',
      description:
        'Boost productivity with built-in pomodoro timing. Alternate focused work sessions with short breaks.',
      icon: <Clock className='h-5 w-5' />,
      gradientFrom: 'rgba(245, 158, 11, 0.3)',
      gradientTo: 'rgba(217, 119, 6, 0.3)',
    },
    {
      title: 'Dashboard Overview',
      description:
        'Get a comprehensive view of your academic workload with an intuitive dashboard showing upcoming deadlines.',
      icon: <LayoutDashboard className='h-5 w-5' />,
      gradientFrom: 'rgba(14, 165, 233, 0.3)',
      gradientTo: 'rgba(2, 132, 199, 0.3)',
    },
  ];

  return (
    <section id='tools' className='relative py-24 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[120px] opacity-20' />

      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
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
            <span>Powerful Tools</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
          >
            Tools designed for <span className='text-primary'>students</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-zinc-400 max-w-3xl mx-auto'
          >
            AcademEase provides a suite of specialized tools to help you manage
            your academic workload effectively and achieve your educational
            goals.
          </motion.p>
        </div>

        {/* Tools grid with staggered layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              gradientFrom={tool.gradientFrom}
              gradientTo={tool.gradientTo}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
