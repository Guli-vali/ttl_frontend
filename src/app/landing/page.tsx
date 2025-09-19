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
  title: 'TalkToAliens - Communicate with people from around the world in any language',
  description: 'Progressive web application for language exchange. Create cards with conversation topics and find conversation partners in your chosen language.',
  keywords: 'language exchange, communication, PWA, multilingual, chat, foreign languages',
  authors: [{ name: 'TalkToAliens Team' }],
  openGraph: {
    title: 'TalkToAliens - Communicate with people from around the world',
    description: 'Progressive web application for language exchange',
    type: 'website',
    locale: 'en_US',
    siteName: 'TalkToAliens',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalkToAliens - Communicate with people from around the world',
    description: 'Progressive web application for language exchange',
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
    <main className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Demo />
      <About />
      <HowItWorks />
      {/* <Demo /> */}
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
    </main>
  );
}
