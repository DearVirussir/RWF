'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Staff from '@/components/Staff';
import Cases from '@/components/Cases';
import KeyInitiatives from '@/components/KeyInitiatives';

import Donation from '@/components/Donation';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollRevealWrapper from '@/components/ScrollRevealWrapper';
import SpecialAppeal from '@/components/SpecialAppeal';
export default function Home() {

  return (
    <ScrollRevealWrapper>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <SpecialAppeal />
        <Cases />

        <About />
        <Donation />
        <KeyInitiatives />
        
        <section id="staff" className="py-section bg-light text-center">
            <div className="container">
                <div className="animate-fade-in">
                    <Staff />
                </div>
            </div>
        </section>

        <Contact />
        <Footer />
      </main>
    </ScrollRevealWrapper>
  );
}
