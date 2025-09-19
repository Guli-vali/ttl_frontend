"use client";

import { motion } from 'framer-motion';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { LANDING_CONFIG } from '@/constants/landing';

export const Demo = () => {
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
    <section id="demo" className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"
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
            {LANDING_CONFIG.demo.title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {LANDING_CONFIG.demo.description}
          </motion.p>
        </motion.div>

        {/* Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>

          {/* Demo Steps */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                How it works in practice
              </h3>
              <p className="text-gray-300">
                See the conversation flow from topic creation to real chat
              </p>
            </div>

            {[
              {
                step: "1",
                title: "Create a topic",
                description: "Share something you're passionate about",
                example: "Best street food in your city"
              },
              {
                step: "2", 
                title: "Native speakers join",
                description: "People who speak your target language respond",
                example: "Spanish speakers share their local favorites"
              },
              {
                step: "3",
                title: "Real conversation starts",
                description: "Chat naturally about shared interests",
                example: "Exchange recipes and cultural stories"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-2">
                    {item.description}
                  </p>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-yellow-400 text-sm font-medium">
                      Example: {item.example}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "50+", label: "Languages" },
            { number: "Real", label: "Conversations" },
            { number: "Free", label: "To Use" },
            { number: "PWA", label: "No App Store" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
