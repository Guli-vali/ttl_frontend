"use client";

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { LANDING_CONFIG } from '@/constants/landing';

export const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
      
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
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
            {LANDING_CONFIG.howItWorks.title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Всего три простых шага до начала общения с людьми со всего мира
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {LANDING_CONFIG.howItWorks.steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Connection Line */}
              {index < LANDING_CONFIG.howItWorks.steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent z-0" />
              )}
              
              <AnimatedCard
                delay={index * 0.2}
                className="relative z-10 h-full text-center group hover:bg-white/10 transition-colors duration-300"
              >
                {/* Step Number */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg"
                >
                  {step.number}
                </motion.div>

                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Flow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Готовы начать?
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Присоединяйтесь к нашему сообществу и начните общение уже сегодня
              </p>
              
              {/* Progress Indicator */}
              <div className="flex justify-center items-center gap-4 mb-6">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: step * 0.2 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step}
                    </div>
                    {step < 3 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 40 }}
                        transition={{ delay: step * 0.2 + 0.3, duration: 0.5 }}
                        className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-2"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Features Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  { icon: "⚡", text: "Мгновенная регистрация" },
                  { icon: "🔒", text: "Безопасное общение" },
                  { icon: "📱", text: "Работает везде" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span>{feature.text}</span>
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
