'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Calendar,
  Bot,
  Clock,
  Kanban,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Free',
    description:
      'Perfect for individual students getting started with academic organization.',
    price: '0',
    features: [
      'Basic Kanban board (up to 3 columns)',
      'Up to 20 tasks per month',
      'Basic study notes (5 notes)',
      'Simple Pomodoro timer',
      'Limited AI task suggestions',
      'Email support (48h response)',
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    color: 'blue',
    gradientFrom: 'rgba(59, 130, 246, 0.5)',
    gradientTo: 'rgba(37, 99, 235, 0.5)',
    icon: <Zap className='h-5 w-5' />,
  },
  {
    name: 'Pro',
    description:
      'Everything you need for serious academic success and productivity.',
    price: '9.99',
    features: [
      'Advanced Kanban with unlimited columns',
      'Unlimited tasks and subtasks',
      'Unlimited study notes with rich text',
      'Advanced Pomodoro with analytics',
      'Full AI study assistant & scheduling',
      'Dashboard with progress analytics',
      'Priority support (24h response)',
      'Calendar integration',
    ],
    popular: true,
    buttonText: 'Get Pro',
    buttonVariant: 'default' as const,
    color: 'purple',
    gradientFrom: 'rgba(139, 92, 246, 0.5)',
    gradientTo: 'rgba(124, 58, 237, 0.5)',
    icon: <Shield className='h-5 w-5' />,
  },
  {
    name: 'Team',
    description: 'For study groups and academic teams working collaboratively.',
    price: '19.99',
    features: [
      'Everything in Pro plan',
      'Team workspaces (up to 10 members)',
      'Collaborative study notes',
      'Shared task assignments',
      'Team progress analytics',
      'Resource sharing library',
      'Admin controls & permissions',
      'Dedicated support (12h response)',
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    color: 'emerald',
    gradientFrom: 'rgba(16, 185, 129, 0.5)',
    gradientTo: 'rgba(5, 150, 105, 0.5)',
    icon: <Users className='h-5 w-5' />,
  },
];

// Feature icons mapping
const featureIcons: Record<string, React.ReactNode> = {
  Kanban: <Kanban className='h-4 w-4' />,
  tasks: <Check className='h-4 w-4' />,
  notes: <FileText className='h-4 w-4' />,
  Pomodoro: <Clock className='h-4 w-4' />,
  AI: <Bot className='h-4 w-4' />,
  Dashboard: <LayoutDashboard className='h-4 w-4' />,
  Calendar: <Calendar className='h-4 w-4' />,
};

// Helper function to get icon for feature
const getFeatureIcon = (feature: string) => {
  for (const [keyword, icon] of Object.entries(featureIcons)) {
    if (feature.includes(keyword)) {
      return icon;
    }
  }
  return <Check className='h-4 w-4' />;
};

export const PricingSection = () => {
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
    <section id='pricing' className='relative py-24 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px] opacity-20' />
      <div className='absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-20' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-sm mb-4'
          >
            <Sparkles className='w-3.5 h-3.5 mr-2 text-primary' />
            <span>Simple Pricing</span>
          </motion.div>

          <motion.h2
            className='text-3xl md:text-5xl font-bold tracking-tight mb-6'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Plans for every{' '}
            <span className='text-primary'>student&apos;s needs</span>
          </motion.h2>

          <motion.p
            className='text-lg text-zinc-400 max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Choose the perfect plan to support your academic journey. All plans
            include a 14-day free trial with no credit card required. Upgrade,
            downgrade, or cancel anytime.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={cn(
                'group relative rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg',
                plan.popular
                  ? 'bg-black/40 backdrop-blur-md'
                  : 'bg-black/30 backdrop-blur-md'
              )}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              {/* Gradient border */}
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl p-[1px] -z-10',
                  plan.popular
                    ? 'opacity-100'
                    : 'opacity-30 group-hover:opacity-100'
                )}
                style={{
                  background: `linear-gradient(135deg, ${plan.gradientFrom}, ${plan.gradientTo})`,
                  maskImage:
                    'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Gradient hover effect */}
              <div
                className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20 rounded-2xl'
                style={{
                  backgroundImage: `linear-gradient(135deg, ${plan.gradientFrom}, ${plan.gradientTo})`,
                }}
              />

              {plan.popular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-medium bg-primary text-default-50 rounded-full shadow-sm'>
                  Most Popular
                </div>
              )}

              <div className='mb-6'>
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:scale-110`}
                >
                  {plan.icon}
                </div>

                <h3 className='text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300'>
                  {plan.name}
                </h3>
                <p className='text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300'>
                  {plan.description}
                </p>
              </div>

              <div className='mb-6 flex items-baseline'>
                <span className='text-4xl font-bold text-white'>
                  ${plan.price}
                </span>
                <span className='text-zinc-400 ml-1'>/month</span>
              </div>

              <ul className='mb-8 space-y-3'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-start'>
                    <div className='mr-3 mt-1 flex-shrink-0 text-primary transition-transform duration-200 group-hover:scale-110'>
                      {getFeatureIcon(feature)}
                    </div>
                    <span className='text-zinc-300'>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.buttonVariant}
                className={cn(
                  'w-full transition-all duration-300 rounded-full',
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-default'
                    : 'hover:bg-primary/10 hover:text-primary border-white/20'
                )}
              >
                <Link
                  href='/signup'
                  className='flex items-center justify-center w-full'
                >
                  {plan.buttonText}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison feature */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className='inline-block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-all duration-300'>
            <p className='text-zinc-300 flex items-center justify-center'>
              <span className='font-semibold mr-2'>
                100% satisfaction guaranteed.
              </span>
              Try AcademEase risk-free with our 30-day money-back guarantee.
              <Sparkles className='ml-2 h-4 w-4 text-primary' />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
