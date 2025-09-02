"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  whileHover?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0,
  whileHover = true,
  onClick 
}: AnimatedCardProps) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = whileHover ? {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  } : {};

  return (
    <motion.div
      variants={{ ...cardVariants, ...hoverVariants }}
      initial="hidden"
      whileInView="visible"
      whileHover={whileHover ? "hover" : undefined}
      viewport={{ once: true, margin: "-50px" }}
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 
        rounded-2xl p-6 shadow-xl
        transition-all duration-300 ease-out
        ${className}
      `}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      {children}
    </motion.div>
  );
};

export const GradientCard = ({ 
  children, 
  className = "", 
  delay = 0,
  gradient = "from-yellow-500/20 to-yellow-400/20"
}: AnimatedCardProps & { gradient?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${gradient}
        border border-white/10 backdrop-blur-sm
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
