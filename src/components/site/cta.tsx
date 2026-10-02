'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Kanban,
  Bot,
  Clock,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const CTASection = () => {
  return (
    <section id='get-started' className='relative py-24 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-sm mb-4'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 text-primary' />
            <span>Join Today</span>
          </motion.div>

          <motion.h2
            className='text-3xl md:text-5xl font-bold tracking-tight text-center mb-6 max-w-4xl text-white'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Ready to transform your{' '}
            <span className='text-primary'>academic experience</span>?
          </motion.h2>

          <motion.p
            className='text-lg text-zinc-400 text-center max-w-3xl mb-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of students who have already improved their
            productivity, grades, and academic satisfaction with AcademEase.
            Start your 14-day free trial today.
          </motion.p>
        </div>

        <div className='flex flex-col lg:flex-row gap-12 items-center'>
          {/* Left side - CTA card */}
          <motion.div
            className='w-full lg:w-1/2'
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className='group relative rounded-2xl p-8 md:p-10 shadow-lg overflow-hidden bg-black/40 backdrop-blur-md'>
              {/* Gradient border */}
              <div
                className='absolute inset-0 rounded-2xl p-[1px] -z-10'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(124, 58, 237, 0.5))',
                  maskImage:
                    'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                }}
              />

              {/* Gradient hover effect */}
              <div
                className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20 rounded-2xl'
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
                }}
              />

              <div className='relative'>
                <GraduationCap className='h-12 w-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-200' />

                <h3 className='text-2xl md:text-3xl font-bold mb-4 text-white'>
                  Get Started in Minutes
                </h3>

                <p className='text-zinc-400 mb-8 group-hover:text-zinc-300 transition-colors duration-300'>
                  Setting up your academic workspace is quick and easy. Import
                  your schedule, add your courses, and start organizing your
                  academic life right away.
                </p>

                <ul className='space-y-4 mb-8'>
                  {[
                    'No credit card required',
                    '14-day free trial of all Pro features',
                    'Cancel anytime, no commitments',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start'>
                      <div className='mr-3 mt-1 flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-200'>
                        <CheckCircle2 className='h-5 w-5' />
                      </div>
                      <span className='text-zinc-300'>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className='flex flex-col sm:flex-row gap-4'>
                  <Button
                    className={cn(
                      'group transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 text-default',
                      'hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                    )}
                    asChild
                  >
                    <Link
                      href='/signup'
                      className='flex items-center justify-center'
                    >
                      Get started for free
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                    </Link>
                  </Button>

                  <Button
                    variant='outline'
                    className='transition-all duration-300 rounded-full hover:bg-primary/10 hover:text-primary border-white/20'
                    asChild
                  >
                    <Link href='#pricing'>View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Feature highlights */}
          <motion.div
            className='w-full lg:w-1/2'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className='space-y-6'>
              <div className='flex items-center justify-center mb-8'>
                <div className='flex -space-x-4'>
                  {[1, 2, 3, 4, 5].map((img) => (
                    <div
                      key={img}
                      className='relative w-12 h-12 rounded-full border-2 border-black overflow-hidden'
                    >
                      <img
                        src={`https://i.pravatar.cc/150?img=${img + 10}`}
                        alt='User avatar'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ))}
                </div>
                <div className='ml-4'>
                  <p className='font-medium text-white'>
                    Trusted by 10,000+ students
                  </p>
                  <div className='flex items-center mt-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className='w-4 h-4 text-amber-400 fill-amber-400'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                      </svg>
                    ))}
                    <span className='ml-2 text-sm text-zinc-400'>
                      4.9/5 rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature highlights */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  {
                    icon: <Kanban className='h-5 w-5' />,
                    title: 'Kanban Board',
                    description:
                      'Visualize your academic workflow with customizable columns and drag-and-drop tasks.',
                  },
                  {
                    icon: <Bot className='h-5 w-5' />,
                    title: 'AI Assistant',
                    description:
                      'Get personalized study recommendations and task prioritization based on your habits.',
                  },
                  {
                    icon: <Clock className='h-5 w-5' />,
                    title: 'Pomodoro Timer',
                    description:
                      'Boost focus with customizable study intervals and break reminders.',
                  },
                  {
                    icon: <FileText className='h-5 w-5' />,
                    title: 'Study Notes',
                    description:
                      'Create, organize, and access your study materials directly within your workspace.',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className='group relative rounded-xl p-4 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-200'
                  >
                    {/* Subtle gradient border */}
                    <div
                      className='absolute inset-0 rounded-xl p-[1px] -z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-300'
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
                        maskImage:
                          'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                      }}
                    />

                    <div className='flex items-start'>
                      <div className='mr-3 flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200'>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className='text-white font-medium mb-1 group-hover:text-primary transition-colors duration-200'>
                          {feature.title}
                        </h4>
                        <p className='text-zinc-400 text-sm'>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
