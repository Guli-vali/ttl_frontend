"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PhoneMockupProps {
  className?: string;
}

export const PhoneMockup = ({ className = '' }: PhoneMockupProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const slides = [
    {
      title: "Create Topic",
      content: [
        { 
          type: "input",
          placeholder: "What's your favorite street food?",
          language: "🇺🇸 English",
          action: "typing..."
        },
        { 
          type: "preview",
          title: "Best street food in your city",
          description: "Share your local favorites and discover new flavors from around the world",
          language: "🇺🇸 English"
        }
      ]
    },
    {
      title: "Native Speakers Join",
      content: [
        { 
          type: "notification",
          user: "Maria (🇪🇸)",
          message: "¡Hola! I love tacos al pastor from Mexico City!",
          time: "2 min ago"
        },
        { 
          type: "notification",
          user: "Ahmed (🇪🇬)",
          message: "Falafel in Cairo is amazing! Have you tried it?",
          time: "1 min ago"
        },
        { 
          type: "notification",
          user: "Yuki (🇯🇵)",
          message: "Takoyaki in Osaka is my favorite street food!",
          time: "now"
        }
      ]
    },
    {
      title: "Real Conversation",
      content: [
        { 
          type: "message",
          user: "Maria",
          message: "I make tacos at home! Want the recipe?",
          time: "14:30",
          isOwn: false
        },
        { 
          type: "message",
          user: "You",
          message: "Yes please! I love trying new recipes",
          time: "14:31",
          isOwn: true
        },
        { 
          type: "message",
          user: "Ahmed",
          message: "I can share my falafel recipe too!",
          time: "14:32",
          isOwn: false
        }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Typing effect for first slide
  useEffect(() => {
    if (currentSlide === 0) {
      setIsTyping(true);
      const text = "What's your favorite street food?";
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypingText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setIsTyping(false), 1000);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    } else {
      setTypingText('');
      setIsTyping(false);
    }
  }, [currentSlide]);

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
                <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto mt-2"></div>
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
                    {/* Topic Creation */}
                    {item.type === "input" && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-300">{item.language}</span>
                          <span className="text-xs text-yellow-400 animate-pulse">
                            {isTyping ? "typing..." : "ready"}
                          </span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                          <p className="text-white text-sm">
                            {typingText}
                            {isTyping && <span className="animate-pulse">|</span>}
                          </p>
                        </div>
                      </div>
                    )}

                    {item.type === "preview" && (
                      <div>
                        <h4 className="text-white font-medium text-sm mb-1">{item.title}</h4>
                        <p className="text-gray-300 text-xs mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">{item.language}</span>
                          <span className="text-xs text-yellow-400">Ready to share</span>
                        </div>
                      </div>
                    )}

                    {/* Notifications */}
                    {item.type === "notification" && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                          {item.user.split(' ')[0][0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium text-sm">{item.user}</span>
                            <span className="text-xs text-gray-400">{item.time}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{item.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    {item.type === "message" && (
                      <div className={`flex ${item.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-2 ${
                          item.isOwn 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-white/20 text-white'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium opacity-70">{item.user}</span>
                            <span className="text-xs opacity-70">{item.time}</span>
                          </div>
                          <p className="text-sm">{item.message}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 flex items-center justify-around">
                  {['💡', '🔔', '💬'].map((icon, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${
                        index === currentSlide ? 'bg-yellow-500' : 'bg-transparent'
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
                 className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full opacity-80"
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
                 className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full opacity-80"
      />
    </motion.div>
  );
};
