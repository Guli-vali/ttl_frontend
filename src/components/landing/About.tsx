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
        ease: [0.25, 0.1, 0.25, 1]
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

        {/* Key Benefits */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-6">
              What makes us different?
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Topics you actually care about",
                description: "Practice languages through discussions about your passions - from cooking to space exploration, not boring textbook scenarios."
              },
              {
                icon: "🌍",
                title: "Invite friends from social media",
                description: "Share your conversation topics on social platforms and invite native speakers you already know to join your discussions."
              },
              {
                icon: "🗣️",
                title: "Street-level conversations",
                description: "Practice like you're chatting with locals in a foreign country - natural, spontaneous, and real."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 rounded-2xl p-6 border border-white/10 backdrop-blur-sm h-full">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
