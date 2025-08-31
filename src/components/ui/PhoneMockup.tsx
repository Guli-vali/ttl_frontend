"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PhoneMockupProps {
  className?: string;
}

export const PhoneMockup = ({ className = '' }: PhoneMockupProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Карточки тем",
      content: [
        { text: "Существует ли любовь?", lang: "🇷🇺 Русский", users: 12 },
        { text: "What's your favorite movie?", lang: "🇺🇸 English", users: 8 },
        { text: "¿Cuál es tu comida favorita?", lang: "🇪🇸 Español", users: 5 }
      ]
    },
    {
      title: "Чат",
      content: [
        { user: "Анна", message: "Привет! Как дела?", time: "14:30" },
        { user: "You", message: "Привет! Хорошо, спасибо! А у тебя?", time: "14:31" },
        { user: "Анна", message: "Отлично! Готова обсудить тему 😊", time: "14:32" }
      ]
    },
    {
      title: "Профиль",
      content: [
        { label: "Языки", value: "🇷🇺 🇺🇸 🇪🇸" },
        { label: "Темы создано", value: "15" },
        { label: "Чатов", value: "47" }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {/* Phone Frame */}
      <div className="relative mx-auto w-64 h-[500px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-between px-6 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="pt-8 h-full">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="h-full p-4"
            >
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-white font-semibold text-lg">
                  {slides[currentSlide].title}
                </h3>
                <div className="w-12 h-1 bg-purple-500 rounded-full mx-auto mt-2"></div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {slides[currentSlide].content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5"
                  >
                    {currentSlide === 0 && (
                      <div>
                        <p className="text-white font-medium text-sm">{item.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-300">{item.lang}</span>
                          <span className="text-xs text-purple-400">{item.users} участников</span>
                        </div>
                      </div>
                    )}
                    
                    {currentSlide === 1 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{item.user}</span>
                          <span className="text-xs text-gray-400">{item.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{item.message}</p>
                      </div>
                    )}
                    
                    {currentSlide === 2 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{item.label}</span>
                        <span className="text-white font-medium text-sm">{item.value}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 flex items-center justify-around">
                  {['🏠', '💬', '👤'].map((icon, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${
                        index === currentSlide ? 'bg-purple-500' : 'bg-transparent'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full opacity-80"
      />
      
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500 rounded-full opacity-80"
      />
    </motion.div>
  );
};
