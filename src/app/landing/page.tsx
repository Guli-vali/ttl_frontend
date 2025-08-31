import { Metadata } from 'next';
import { Navigation } from '@/components/landing/Navigation';
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Demo } from '@/components/landing/Demo';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'TalkToAliens - Общайтесь с людьми со всего мира на любом языке',
  description: 'Прогрессивное веб-приложение для языкового обмена. Создавайте карточки с темами для разговора и находите собеседников на выбранном языке.',
  keywords: 'языковой обмен, общение, PWA, многоязычность, чат, иностранные языки',
  authors: [{ name: 'TalkToAliens Team' }],
  openGraph: {
    title: 'TalkToAliens - Общайтесь с людьми со всего мира',
    description: 'Прогрессивное веб-приложение для языкового обмена',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'TalkToAliens',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkToAliens - Общайтесь с людьми со всего мира',
    description: 'Прогрессивное веб-приложение для языкового обмена',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Navigation />
      <Hero />
      <About />
      <HowItWorks />
      <Demo />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
