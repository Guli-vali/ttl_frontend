"use client";

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { LANDING_CONFIG } from '@/constants/landing';

export const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="testimonials" className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {LANDING_CONFIG.testimonials.title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {LANDING_CONFIG.testimonials.subtitle}
          </motion.p>
        </motion.div>

        {/* Placeholder Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="group"
          >
            <AnimatedCard
              delay={0.1}
              className="hover:bg-white/10 transition-colors duration-300 p-12 text-center"
            >
              {/* Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-6 text-yellow-400 opacity-70"
              >
                💬
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4">
                Отзывы бета-тестеров появятся здесь
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-2xl mx-auto">
                {LANDING_CONFIG.testimonials.placeholder}
              </p>

              {/* Call to Action */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 hover:bg-yellow-500/30 transition-colors duration-300"
              >
                <span>🚀</span>
                <span>Будьте первыми</span>
              </motion.div>
            </AnimatedCard>
          </motion.div>
        </motion.div>

        {/* Early Access Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-yellow-500/10 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ранний доступ
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Мы находимся в стадии активной разработки и приглашаем первых пользователей присоединиться к бета-тестированию
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "🔧", label: "Активная разработка" },
                  { icon: "👥", label: "Первые пользователи" },
                  { icon: "💡", label: "Ваши идеи важны" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">
                      {feature.icon}
                    </div>
                    <div className="text-sm text-gray-400">
                      {feature.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
