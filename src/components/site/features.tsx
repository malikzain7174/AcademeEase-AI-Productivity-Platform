'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  BrainCircuit,
  BarChart3,
  Users,
  Bell,
  Zap,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Calendar className='h-6 w-6' />,
      title: 'Smart Task Management',
      description:
        'Organize assignments, exams, and projects with intelligent prioritization based on deadlines and importance.',
      color: 'blue',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Time Tracking',
      description:
        'Monitor study sessions and track productivity patterns to optimize your learning schedule.',
      color: 'purple',
    },
    {
      icon: <BrainCircuit className='h-6 w-6' />,
      title: 'AI Study Assistant',
      description:
        'Get personalized study recommendations and resources based on your learning style and course material.',
      color: 'emerald',
    },
    {
      icon: <BarChart3 className='h-6 w-6' />,
      title: 'Progress Analytics',
      description:
        'Visualize your academic progress with detailed analytics and performance insights.',
      color: 'amber',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Collaborative Tools',
      description:
        'Work seamlessly with classmates on group projects with real-time collaboration features.',
      color: 'rose',
    },
    {
      icon: <Bell className='h-6 w-6' />,
      title: 'Smart Reminders',
      description:
        'Never miss a deadline with customizable notifications and reminders for upcoming tasks.',
      color: 'cyan',
    },
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id='features' className='relative py-24 overflow-hidden'>
      {/* Background elements - grid pattern for contrast with About section */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]' />

      {/* Decorative blobs */}
      <div className='absolute top-1/3 left-0 h-72 w-72 bg-blue-500/5 rounded-full blur-3xl dark:bg-blue-500/10' />
      <div className='absolute bottom-1/3 right-0 h-72 w-72 bg-purple-500/5 rounded-full blur-3xl dark:bg-purple-500/10' />

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
            <span>Powerful Features</span>
          </motion.div>

          <motion.h2
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Tools designed for{' '}
            <span className='text-primary'>academic success</span>
          </motion.h2>

          <motion.p
            className='text-lg text-muted-foreground max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            AcademEase combines intelligent task management, productivity
            analytics, and AI-powered assistance to help you excel in your
            academic journey.
          </motion.p>
        </div>

        {/* Features grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='group relative bg-card hover:bg-card/80 border border-border rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-lg'
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-500/5 rounded-bl-full rounded-tr-2xl transition-all duration-300 group-hover:bg-${feature.color}-500/10`}
              />

              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-500/10 text-${feature.color}-500 dark:bg-${feature.color}-500/20 dark:text-${feature.color}-400 mb-4 transition-all duration-200 group-hover:scale-105`}
              >
                {feature.icon}
              </div>

              <h3 className='text-xl font-bold mb-3 relative z-10'>
                {feature.title}
              </h3>

              <p className='text-muted-foreground mb-4 relative z-10'>
                {feature.description}
              </p>

              <div className='flex items-center text-sm text-primary'>
                <span className='mr-2'>Learn more</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='transition-transform duration-200 group-hover:translate-x-1'
                >
                  <path d='M5 12h14'></path>
                  <path d='m12 5 7 7-7 7'></path>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight feature */}
        <motion.div
          className='mt-20 relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-lg'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className='absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 bg-primary/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 left-0 -mb-12 -ml-12 h-40 w-40 bg-primary/10 rounded-full blur-3xl'></div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12'>
            <div className='flex flex-col justify-center'>
              <Badge
                variant='outline'
                className='w-fit mb-4 bg-primary/10 text-primary border-primary/20'
              >
                <Lightbulb className='w-3.5 h-3.5 mr-1.5' />
                Featured
              </Badge>

              <h3 className='text-2xl md:text-3xl font-bold mb-4'>
                AI-Powered Study Assistant
              </h3>

              <p className='text-muted-foreground mb-6'>
                Our AI Study Assistant analyzes your learning patterns, course
                materials, and academic goals to provide personalized study
                recommendations, resource suggestions, and adaptive learning
                paths that optimize your educational journey.
              </p>

              <ul className='space-y-3 mb-8'>
                {[
                  'Personalized study plans based on your learning style',
                  'Smart content recommendations from trusted academic sources',
                  'Adaptive quizzing that focuses on knowledge gaps',
                  'Progress tracking with detailed insights',
                ].map((item, i) => (
                  <li key={i} className='flex items-start'>
                    <div className='mr-3 mt-1 flex-shrink-0 text-primary'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z'
                          fill='currentColor'
                        />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='relative flex items-center justify-center'>
              <div className='relative w-full max-w-sm aspect-[4/3] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl overflow-hidden border border-border/50'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-4/5 h-4/5 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 p-4 flex flex-col'>
                    <div className='flex items-center mb-4'>
                      <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3'>
                        <BrainCircuit className='w-4 h-4' />
                      </div>
                      <div className='text-sm font-medium'>
                        AI Study Assistant
                      </div>
                    </div>

                    <div className='space-y-2 mb-auto'>
                      <div className='h-2 bg-muted rounded-full w-full'></div>
                      <div className='h-2 bg-muted rounded-full w-4/5'></div>
                      <div className='h-2 bg-muted rounded-full w-2/3'></div>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-2'>
                      <div className='h-8 bg-primary/10 rounded-md flex items-center justify-center text-xs text-primary'>
                        Study Plan
                      </div>
                      <div className='h-8 bg-muted rounded-md flex items-center justify-center text-xs'>
                        Resources
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className='absolute top-0 right-0 w-12 h-12 bg-primary/20 rounded-bl-full'></div>
                <div className='absolute bottom-0 left-0 w-12 h-12 bg-primary/20 rounded-tr-full'></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
