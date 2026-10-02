'use client';
import React from 'react';
import Link from 'next/link';
import {
  Airplay,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className='h-4 w-4' />, href: '#', label: 'GitHub' },
    { icon: <Twitter className='h-4 w-4' />, href: '#', label: 'Twitter' },
    { icon: <Instagram className='h-4 w-4' />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className='h-4 w-4' />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className='relative overflow-hidden border-t border-white/10 bg-black'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]' />

      {/* Glow effects */}
      <div className='absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] opacity-10' />
      <div className='absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] opacity-10' />

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-10'>
          <div className='md:col-span-2'>
            <Button
              className='flex justify-center items-center pb-2 pt-1 mb-6 px-0 hover:bg-transparent'
              variant='link'
              asChild
            >
              <Link href='/' className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary/80 to-primary/30 rounded-md flex items-center justify-center shadow-sm'>
                  <Airplay className='w-4 h-4 text-white' />
                </div>
                <h1 className='font-bold text-xl text-white'>
                  Academ
                  <span className='text-zinc-300'>Ease</span>
                  <span className='text-primary text-xs font-semibold'>
                    .{process.env.NEXT_PUBLIC_LOGO_SUBSCRIPT || 'app'}
                  </span>
                </h1>
              </Link>
            </Button>
            <p className='text-zinc-400 mb-6 max-w-md'>
              Empowering students to excel academically through smart
              organization, collaboration, and AI-powered assistance.
            </p>

            {/* Social links */}
            <div className='flex space-x-4 mb-8'>
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  aria-label={link.label}
                  className='p-2 rounded-full bg-white/5 text-zinc-400 hover:text-primary hover:bg-white/10 transition-colors duration-200'
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className='relative group'>
              {/* Gradient border */}
              <div
                className='absolute inset-0 rounded-xl p-[1px] -z-10'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(124, 58, 237, 0.5))',
                  maskImage:
                    'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                }}
              />

              <div className='p-4 rounded-xl bg-black/40 backdrop-blur-sm'>
                <h3 className='text-white font-medium mb-2'>Stay updated</h3>
                <p className='text-zinc-400 text-sm mb-3'>
                  Get the latest news and updates directly to your inbox.
                </p>
                <div className='flex'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    className='flex-1 bg-white/5 border border-white/10 rounded-l-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50'
                  />
                  <button className='bg-primary hover:bg-primary/90 text-default px-4 py-2 rounded-r-md transition-colors duration-200 text-sm font-medium'>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='font-semibold mb-4 text-white'>Product</h3>
            <ul className='space-y-3'>
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Roadmap', href: '#' },
                { label: 'Changelog', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className='text-zinc-400 hover:text-primary transition-colors duration-200 flex items-center group'
                  >
                    <span className='group-hover:translate-x-1 transition-transform duration-200'>
                      {link.label}
                    </span>
                    <ArrowUpRight className='ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4 text-white'>Resources</h3>
            <ul className='space-y-3'>
              {[
                { label: 'Blog', href: '#' },
                { label: 'Documentation', href: '#' },
                { label: 'Help Center', href: '#' },
                { label: 'Community', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className='text-zinc-400 hover:text-primary transition-colors duration-200 flex items-center group'
                  >
                    <span className='group-hover:translate-x-1 transition-transform duration-200'>
                      {link.label}
                    </span>
                    <ArrowUpRight className='ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4 text-white'>Company</h3>
            <ul className='space-y-3'>
              {[
                { label: 'About Us', href: '#about-us' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'Partners', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className='text-zinc-400 hover:text-primary transition-colors duration-200 flex items-center group'
                  >
                    <span className='group-hover:translate-x-1 transition-transform duration-200'>
                      {link.label}
                    </span>
                    <ArrowUpRight className='ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-white/10'>
          <p className='text-sm text-zinc-500 mb-4 md:mb-0'>
            &copy; {currentYear} AcademEase. All rights reserved.
          </p>

          <div className='flex space-x-6'>
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Service', href: '#' },
              { label: 'Cookie Policy', href: '#' },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className='text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200'
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
