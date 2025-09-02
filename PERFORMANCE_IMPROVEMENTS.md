# Рекомендации по улучшению производительности и анимаций

## 🚀 Оптимизация производительности

### 1. Lazy Loading и Code Splitting

#### Динамический импорт компонентов
```typescript
// Вместо статического импорта
import { Hero } from '@/components/landing/Hero';

// Используйте динамический импорт
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/landing/Hero'), {
  loading: () => <div className="h-screen bg-slate-900 animate-pulse" />,
  ssr: false // Для компонентов с анимациями
});
```

#### Оптимизация изображений
```typescript
import Image from 'next/image';

// Используйте Next.js Image компонент
<Image
  src="/hero-image.jpg"
  alt="Hero Image"
  width={1200}
  height={600}
  priority // Для above-the-fold изображений
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. Bundle Optimization

#### Анализ размера бандла
```bash
# Установка анализатора
npm install --save-dev @next/bundle-analyzer

# В next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // конфигурация
});

# Запуск анализа
ANALYZE=true npm run build
```

#### Tree Shaking для Framer Motion
```typescript
// Вместо импорта всего framer-motion
import { motion } from 'framer-motion';

// Импортируйте только нужные компоненты
import { motion, AnimatePresence } from 'framer-motion';
```

### 3. Оптимизация шрифтов

#### Предзагрузка критических шрифтов
```typescript
// В layout.tsx
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});
```

#### Font Display Swap
```css
/* В globals.css */
@font-face {
  font-family: 'CustomFont';
  font-display: swap;
  src: url('/fonts/custom-font.woff2') format('woff2');
}
```

## 🎭 Оптимизация анимаций

### 1. GPU Acceleration

#### Использование transform вместо top/left
```typescript
// ❌ Плохо - вызывает reflow
const badAnimation = {
  animate: { top: 100, left: 100 }
};

// ✅ Хорошо - использует GPU
const goodAnimation = {
  animate: { x: 100, y: 100 }
};
```

#### Will-change для сложных анимаций
```typescript
// Добавьте will-change для элементов с постоянными анимациями
<motion.div
  className="will-change-transform"
  animate={{ rotate: 360 }}
  transition={{ duration: 20, repeat: Infinity }}
>
  {/* контент */}
</motion.div>
```

### 2. Reduced Motion Support

#### Поддержка prefers-reduced-motion
```typescript
import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};

// Использование в компонентах
const prefersReduced = useReducedMotion();

const animationVariants = prefersReduced ? {} : {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### 3. Intersection Observer Optimization

#### Кастомный хук для оптимизации
```typescript
import { useEffect, useRef, useState, useCallback } from 'react';

export const useOptimizedScrollAnimation = (
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Отключаем observer после первого срабатывания
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(callback, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, threshold, rootMargin]);

  return { elementRef, isVisible };
};
```

### 4. Staggered Animations Optimization

#### Оптимизированные staggered анимации
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      // Используйте easeOut для лучшей производительности
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    // Используйте transform для GPU acceleration
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
```

## 📱 Мобильная оптимизация

### 1. Touch Interactions

#### Оптимизация для touch устройств
```typescript
// Увеличиваем размер touch targets
const TouchButton = ({ children, ...props }) => (
  <button
    className="min-h-[44px] min-w-[44px] touch-manipulation"
    {...props}
  >
    {children}
  </button>
);

// Отключаем hover эффекты на touch устройствах
const HoverCard = ({ children }) => (
  <div className="group">
    <div className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
      {children}
    </div>
  </div>
);
```

### 2. Viewport Optimization

#### Оптимизация для мобильных экранов
```typescript
// В layout.tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFDF20'
};
```

## 🔧 Дополнительные оптимизации

### 1. Memory Management

#### Очистка анимаций
```typescript
useEffect(() => {
  const animation = animate(element, { x: 100 });
  
  return () => {
    animation.stop(); // Останавливаем анимацию при размонтировании
  };
}, []);
```

### 2. Debouncing Scroll Events

#### Оптимизация обработки скролла
```typescript
import { useCallback } from 'react';

const useDebouncedScroll = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};
```

### 3. CSS-in-JS Optimization

#### Оптимизация стилей
```typescript
// Используйте CSS переменные для динамических значений
const AnimatedComponent = styled.div`
  --animation-duration: ${props => props.duration || '0.3s'};
  transition: all var(--animation-duration) ease-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;
```

## 📊 Мониторинг производительности

### 1. Performance Monitoring

#### Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Отправка метрик в аналитику
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Custom Performance Marks

#### Измерение времени загрузки компонентов
```typescript
useEffect(() => {
  performance.mark('hero-section-start');
  
  // Компонент загружен
  performance.mark('hero-section-end');
  performance.measure('hero-section', 'hero-section-start', 'hero-section-end');
  
  const measure = performance.getEntriesByName('hero-section')[0];
  console.log(`Hero section loaded in ${measure.duration}ms`);
}, []);
```

## 🎯 Целевые метрики

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Дополнительные метрики
- **FCP (First Contentful Paint)**: < 1.5s
- **TTI (Time to Interactive)**: < 3.8s
- **TBT (Total Blocking Time)**: < 300ms

### Анимации
- **60 FPS**: Все анимации должны работать на 60 FPS
- **Smooth Scrolling**: Плавная прокрутка без лагов
- **Reduced Motion**: Поддержка пользователей с ограниченными возможностями

## 🔍 Инструменты для анализа

### 1. Chrome DevTools
- Performance tab для анализа анимаций
- Memory tab для отслеживания утечек памяти
- Network tab для оптимизации загрузки

### 2. Lighthouse
```bash
# Запуск Lighthouse
npx lighthouse http://localhost:3000/landing --output=html --output-path=./lighthouse-report.html
```

### 3. Bundle Analyzer
```bash
# Анализ размера бандла
npm run analyze
```

### 4. React DevTools Profiler
- Профилирование компонентов
- Анализ времени рендеринга
- Отслеживание ре-рендеров

## 📈 План внедрения оптимизаций

### Этап 1: Критические оптимизации
1. ✅ Добавить "use client" директивы
2. ✅ Оптимизировать анимации с GPU acceleration
3. ✅ Добавить поддержку reduced motion
4. ✅ Оптимизировать изображения

### Этап 2: Производительность
1. 🔄 Внедрить lazy loading
2. 🔄 Оптимизировать bundle size
3. 🔄 Добавить code splitting
4. 🔄 Настроить caching

### Этап 3: Мониторинг
1. 📊 Интегрировать Web Vitals
2. 📊 Настроить performance monitoring
3. 📊 Добавить error tracking
4. 📊 Создать performance dashboard

### Этап 4: Продвинутые оптимизации
1. 🚀 Внедрить Service Worker
2. 🚀 Добавить PWA функциональность
3. 🚀 Оптимизировать для offline режима
4. 🚀 Добавить push notifications

---

Эти оптимизации помогут достичь отличной производительности и плавных анимаций на всех устройствах.
