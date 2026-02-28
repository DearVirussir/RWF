import React from 'react';
import Link from 'next/link';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-overlay"></div>

            <div className="container hero-content text-center flex flex-col items-center justify-center">
                <div className="hero-artistic-text animate-fade-in">We Care Your Needs</div>

                <h1 className="hero-headline animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Rustam Welfare Foundation
                </h1>

                <p className="hero-subheadline animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    Dedicated to Serving Humanity with Compassion and Hope
                </p>

                <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <Link href="#donate" className="btn-primary hero-btn">
                        Donate Now
                    </Link>
                    <Link href="#about" className="btn-outline hero-btn outline-white">
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
