"use client";

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { LANDING_CONFIG } from '@/constants/landing';

export const About = () => {
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
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
      
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl"
      />
      
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-2xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
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
            {LANDING_CONFIG.about.title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {LANDING_CONFIG.about.description}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {LANDING_CONFIG.about.features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <AnimatedCard
                delay={index * 0.1}
                className="h-full text-center group-hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.split(' ')[0]}
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {feature.split(' ').slice(1).join(' ')}
                </p>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-white mb-6">
              Почему TalkToAliens?
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Простота использования",
                  description: "Интуитивно понятный интерфейс, который работает на всех устройствах"
                },
                {
                  title: "Веселье",
                  description: "Благодаря интересным темам общение будет проходить легко и быстро"
                },
                {
                  title: "Мгновенная связь",
                  description: "Находите собеседников в реальном времени без задержек"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Глобальное сообщество
                </h4>
                <p className="text-gray-300 text-sm mb-6">
                  Присоединяйтесь к раннему доступу и будьте среди первых пользователей
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { number: "150+", label: "Стран" },
                    { number: "50+", label: "Языков" },
                    { number: "24/7", label: "Активность" }
                  ].map((stat, index) => (
                    <div key={index}>
                      <div className="text-2xl font-bold text-yellow-400">
                        {stat.number}
                      </div>
                      <div className="text-xs text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
