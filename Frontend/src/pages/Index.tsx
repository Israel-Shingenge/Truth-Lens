import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContentDetector from '@/components/ContentDetector';
import HowItWorks from '@/components/HowItWorks';
import MediaLiteracyGuide from '@/components/MediaLiteracyGuide';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <ContentDetector />
        <HowItWorks />
        <MediaLiteracyGuide />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
