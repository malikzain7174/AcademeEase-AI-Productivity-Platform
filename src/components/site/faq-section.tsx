'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Minus, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// More focused and minimal set of FAQs
const faqs = [
  {
    question: 'How does the Kanban board help with my studies?',
    answer:
      "Our Kanban board lets you visualize your academic workflow by organizing tasks into customizable columns like 'To Do', 'In Progress', and 'Done'. This visual approach helps you prioritize assignments, track progress, and maintain a clear overview of your academic workload at a glance.",
  },
  {
    question:
      'What makes the AI assistant different from other productivity tools?',
    answer:
      'Our AI assistant is specifically trained on academic patterns and student workflows. It analyzes your task history, deadlines, and study habits to provide personalized recommendations for task prioritization, optimal study schedules, and effective time management strategies tailored to your unique academic needs.',
  },
  {
    question: 'Can I access AcademEase on multiple devices?',
    answer:
      'Yes, AcademEase is fully responsive and works seamlessly across all your devices. Your data syncs automatically in real-time, so you can start a task on your laptop during class and continue on your phone between lectures without missing a beat.',
  },
  {
    question: 'Is there a limit to how many notes I can create?',
    answer:
      'Free users can create up to 5 study notes, while Pro and Team users enjoy unlimited notes with rich text formatting, image embedding, and integration with tasks. Notes can be organized by subject, tagged for easy retrieval, and linked directly to related tasks.',
  },
  {
    question: 'How does the Pomodoro timer enhance productivity?',
    answer:
      'Our Pomodoro timer is designed specifically for academic work, with customizable study/break intervals. Pro users get advanced analytics that track your focus patterns over time, identifying your peak productivity periods and suggesting optimal study schedules based on your personal data.',
  },
];

export default function FAQSection() {
  return (
    <section id='faq' className='relative py-20 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20' />

      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section header */}
        <div className='text-center mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-sm mb-4'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 text-primary' />
            <span>Quick Answers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl font-bold tracking-tight mb-4'
          >
            Frequently Asked <span className='text-primary'>Questions</span>
          </motion.h2>
        </div>

        {/* FAQ Accordion */}
        <div className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='space-y-4'>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className={cn(
                    'overflow-hidden',
                    'backdrop-blur-sm',
                    'transition-all duration-200'
                  )}
                >
                  <div className='relative'>
                    {/* Gradient border */}
                    <div
                      className='absolute inset-0 rounded-xl p-[1px] -z-10 opacity-30 group-hover:opacity-100'
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(124, 58, 237, 0.5))',
                        maskImage:
                          'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    <AccordionTrigger className='px-6 py-4 text-left font-medium text-lg group rounded-xl bg-black/40 border border-white/10 hover:border-white/20 group-data-[state=open]:rounded-b-none'>
                      <div className='flex items-center'>
                        <HelpCircle className='h-5 w-5 mr-3 text-primary opacity-70 group-hover:opacity-100 transition-opacity duration-200' />
                        <span className='group-hover:text-primary transition-colors duration-200'>
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className='px-6 py-4 text-zinc-400 border border-t-0 border-white/10 rounded-b-xl bg-black/40'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className='mt-12 text-center'
        >
          <a
            href='/contact'
            className='inline-flex items-center justify-center px-6 py-2 rounded-full text-zinc-300 hover:text-primary border border-white/10 hover:border-primary/50 transition-all duration-200 text-sm'
          >
            Have more questions? Contact us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
