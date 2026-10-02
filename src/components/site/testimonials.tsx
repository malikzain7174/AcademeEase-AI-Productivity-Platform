'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Marquee } from './marquee';

// Aceternity-inspired testimonial card
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: {
    content: string;
    author: string;
    role: string;
    avatar: string;
    rating: number;
  };
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6',
        'hover:shadow-xl transition-all duration-300 hover:border-white/20',
        'w-[320px] md:w-[350px] mx-4 my-2'
      )}
    >
      {/* Gradient hover effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10' />

      {/* Quote icon */}
      <div className='absolute top-6 right-6 text-white/10 group-hover:text-primary/20 transition-colors duration-300'>
        <Quote className='h-10 w-10' />
      </div>

      {/* Rating */}
      <div className='flex mb-4'>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4 mr-1',
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-zinc-600'
              )}
            />
          ))}
      </div>

      {/* Content */}
      <p className='text-zinc-300 mb-6 relative z-10 group-hover:text-white transition-colors duration-300'>
        {testimonial.content}
      </p>

      {/* Author */}
      <div className='flex items-center'>
        <div className='relative h-10 w-10 rounded-full overflow-hidden mr-3 border border-white/10 group-hover:border-white/20 transition-colors duration-300'>
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className='w-full h-full object-cover'
          />
        </div>
        <div>
          <h4 className='font-medium text-white group-hover:text-primary transition-colors duration-300'>
            {testimonial.author}
          </h4>
          <p className='text-sm text-zinc-400'>{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  // Testimonials focused on actual app features
  const testimonials = [
    {
      content:
        'The kanban board completely transformed how I organize my assignments. Being able to visualize my workflow has made a huge difference in my productivity.',
      author: 'Alex Johnson',
      role: 'Computer Science Student',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
    },
    {
      content:
        'Breaking down complex projects into subtasks has been a game-changer. I no longer feel overwhelmed by large assignments.',
      author: 'Sarah Williams',
      role: 'Biology Major',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
    },
    {
      content:
        "The AI assistant helps me prioritize my tasks effectively. It's like having a personal study coach guiding me through my semester.",
      author: 'Michael Chen',
      role: 'Engineering Student',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4,
    },
    {
      content:
        "The Pomodoro timer feature has significantly improved my focus during study sessions. I'm getting more done in less time.",
      author: 'Emma Rodriguez',
      role: 'Psychology Major',
      avatar: 'https://i.pravatar.cc/150?img=4',
      rating: 5,
    },
    {
      content:
        'Having my notes integrated with my tasks keeps everything in one place. No more switching between different apps to find what I need.',
      author: 'David Kim',
      role: 'Business Student',
      avatar: 'https://i.pravatar.cc/150?img=8',
      rating: 4,
    },
    {
      content:
        "The dashboard gives me a perfect overview of my upcoming deadlines. I haven't missed an assignment since I started using AcademEase.",
      author: 'Olivia Taylor',
      role: 'Literature Major',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
    },
  ];

  return (
    <section id='testimonials' className='relative py-24 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20' />

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
            <span>Student Success</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
          >
            What students are <span className='text-primary'>saying</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-lg text-zinc-400 max-w-3xl mx-auto'
          >
            Students across various disciplines are using AcademEase to
            transform their academic workflow and achieve better results.
          </motion.p>
        </div>

        {/* Testimonials marquee */}
        <div className='overflow-hidden py-4'>
          <Marquee className='py-4' pauseOnHover>
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </Marquee>

          <Marquee className='py-4' pauseOnHover reverse>
            {testimonials.slice(3).map((testimonial, index) => (
              <TestimonialCard
                key={index + 3}
                testimonial={testimonial}
                index={index + 3}
              />
            ))}
          </Marquee>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <a
            href='/signup'
            className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-black font-medium hover:bg-primary/90 transition-colors duration-200'
          >
            Start organizing your academic life
          </a>
        </motion.div>
      </div>
    </section>
  );
}
