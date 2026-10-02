'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ListTodo,
  LayoutDashboard,
  FileText,
  Brain,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Aceternity-inspired workflow step component
const WorkflowStep = ({
  step,
  index,
  isLast,
}: {
  step: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  };
  index: number;
  isLast: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className='relative group'
    >
      {/* Step number */}
      <div className='absolute -left-3 md:-left-6 flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white'>
        {index + 1}
      </div>

      {/* Connecting line */}
      {!isLast && (
        <div className='absolute top-12 bottom-0 left-0 w-px bg-white/10 group-hover:bg-primary transition-colors duration-300'></div>
      )}

      {/* Content */}
      <div className='pl-8 pb-12'>
        <div
          className={cn(
            'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4',
            'bg-white/5 group-hover:bg-white/10 transition-all duration-200',
            'border border-white/10 group-hover:border-white/20'
          )}
        >
          <div className={cn('transition-transform duration-200', step.color)}>
            {step.icon}
          </div>
        </div>

        <h3 className='text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors duration-200'>
          {step.title}
        </h3>

        <p className='text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200'>
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function WorkflowSection() {
  // Define the workflow steps based on actual app features
  const workflowSteps = [
    {
      icon: (
        <LayoutDashboard className='h-6 w-6 group-hover:scale-110 transition-transform duration-200' />
      ),
      title: 'Organize with Kanban',
      description:
        "Create a visual workflow by organizing your tasks into customizable columns. Drag and drop tasks to track progress from 'To Do' to 'Done'.",
      color: 'text-blue-400',
    },
    {
      icon: (
        <ListTodo className='h-6 w-6 group-hover:scale-110 transition-transform duration-200' />
      ),
      title: 'Break Down Complex Tasks',
      description:
        'Split large assignments into manageable subtasks and track completion with interactive checklists, making overwhelming projects feel achievable.',
      color: 'text-emerald-400',
    },
    {
      icon: (
        <Brain className='h-6 w-6 group-hover:rotate-12 transition-transform duration-200' />
      ),
      title: 'Get AI Assistance',
      description:
        'Use the AI assistant to help organize your tasks, prioritize your workload, and get suggestions for optimizing your study schedule.',
      color: 'text-purple-400',
    },
    {
      icon: (
        <Clock className='h-6 w-6 group-hover:rotate-12 transition-transform duration-200' />
      ),
      title: 'Focus with Pomodoro',
      description:
        'Boost your productivity with built-in pomodoro timing. Alternate focused work sessions with short breaks for maximum efficiency.',
      color: 'text-amber-400',
    },
    {
      icon: (
        <FileText className='h-6 w-6 group-hover:scale-110 transition-transform duration-200' />
      ),
      title: 'Capture Important Notes',
      description:
        'Create and organize your study notes directly within your workspace, keeping all your academic resources in one place.',
      color: 'text-cyan-400',
    },
  ];

  return (
    <section id='workflow' className='relative py-24 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20' />

      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
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
              <span>Simple Workflow</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
            >
              How AcademEase <span className='text-primary'>works</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className='text-lg text-zinc-400'
            >
              A simple yet powerful workflow designed to help you manage your
              academic tasks efficiently and stay on top of your studies.
            </motion.p>
          </div>

          {/* Workflow steps */}
          <div className='relative pl-4 md:pl-8'>
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={index}
                step={step}
                index={index}
                isLast={index === workflowSteps.length - 1}
              />
            ))}

            {/* Final step */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * workflowSteps.length }}
              viewport={{ once: true }}
              className='pl-8'
            >
              <div className='inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary'>
                <CheckCircle className='h-4 w-4 mr-2' />
                <span>Achieve academic success</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
