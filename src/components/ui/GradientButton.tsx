"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  href?: string;
}

export const GradientButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  href
}: GradientButtonProps) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium rounded-xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-600 to-pink-600
      hover:from-purple-700 hover:to-pink-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-purple-500
    `,
    secondary: `
      bg-gradient-to-r from-blue-600 to-cyan-600
      hover:from-blue-700 hover:to-cyan-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-500
    `,
    outline: `
      bg-transparent border-2 border-purple-500
      hover:bg-purple-500/10 text-purple-400
      hover:text-purple-300 focus:ring-purple-500
    `
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: { duration: 0.6 }
    }
  };

  const Component = href ? 'a' : 'button';
  const componentProps = href ? { href } : { onClick, type: 'button' as const };

  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="inline-block"
    >
      <Component
        {...componentProps}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          variants={rippleVariants}
          initial="initial"
          whileHover="animate"
        />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Component>
    </motion.div>
  );
};

export const FloatingButton = ({ children, ...props }: GradientButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <GradientButton
        {...props}
        size="lg"
        className="rounded-full w-16 h-16 p-0 shadow-2xl"
      >
        {children}
      </GradientButton>
    </motion.div>
  );
};
