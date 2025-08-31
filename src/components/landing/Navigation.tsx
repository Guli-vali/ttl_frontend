"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { GradientButton } from '@/components/ui/GradientButton';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'О приложении', href: '#about' },
    { name: 'Как это работает', href: '#how-it-works' },
    { name: 'Демо', href: '#demo' },
    { name: 'Отзывы', href: '#testimonials' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">👽</span>
            <span className="text-xl font-bold text-white">TalkToAliens</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <GradientButton
              variant="outline"
              size="sm"
              href="/auth"
            >
              Войти
            </GradientButton>
            <GradientButton
              size="sm"
              href="/auth"
            >
              Начать
            </GradientButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block transition-all duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-white block mt-1 transition-all duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block mt-1 transition-all duration-300"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        variants={menuVariants}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-white/10"
      >
        <div className="px-4 py-6 space-y-4">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              variants={menuItemVariants}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-white hover:text-purple-400 transition-colors duration-300 text-lg font-medium"
            >
              {item.name}
            </motion.a>
          ))}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <GradientButton
              variant="outline"
              size="sm"
              href="/auth"
              className="w-full"
            >
              Войти
            </GradientButton>
            <GradientButton
              size="sm"
              href="/auth"
              className="w-full"
            >
              Начать
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};
