'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Staff from '@/components/Staff';
import Cases from '@/components/Cases';
import KeyInitiatives from '@/components/KeyInitiatives';
import Gallery from '@/components/Gallery';
import Donation from '@/components/Donation';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollRevealWrapper from '@/components/ScrollRevealWrapper';
import SpecialAppeal from '@/components/SpecialAppeal';
import { Users } from 'lucide-react';

export default function Home() {
  const [showStaff, setShowStaff] = useState(false);

  return (
    <ScrollRevealWrapper>
      <main className="min-h-screen">
        <Navbar />
        <Gallery />
        <Cases />
        <About />
        <Donation />
        <KeyInitiatives />
        
        <section className="py-section bg-light text-center">
            <div className="container">
                {!showStaff ? (
                    <button 
                        onClick={() => setShowStaff(true)}
                        className="btn-secondary flex items-center gap-1"
                        style={{ margin: '0 auto' }}
                    >
                        <Users size={20} /> View Our Team & Staff
                    </button>
                ) : (
                    <div className="animate-fade-in">
                        <Staff />
                        <button 
                            onClick={() => setShowStaff(false)}
                            className="btn-outline mt-2"
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                        >
                            Hide Team Members
                        </button>
                    </div>
                )}
            </div>
        </section>

        <Contact />
        <Footer />
      </main>
    </ScrollRevealWrapper>
  );
}
