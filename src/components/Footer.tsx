'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Heart, Facebook, Youtube, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Subscribing...');
        
        // Check if Supabase is actually configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
            setTimeout(() => {
                setStatus('Subscribed successfully! (Demo Mode)');
                setEmail('');
            }, 1000);
            return;
        }

        try {
            const { error } = await supabase
                .from('newsletter_subscriptions')
                .insert([{ email }]);
            
            if (error) {
                console.error('Supabase Newsletter Error:', error);
                throw error;
            }
            
            setStatus('Subscribed successfully!');
            setEmail('');
        } catch (error: any) {
            console.error('Detailed Newsletter Error Catch:', {
                message: error.message || 'No message',
                code: error.code || 'No code',
                details: error.details || 'No details',
                hint: error.hint || 'No hint',
                fullError: error
            });
            
            if (error.code === '23505') {
                setStatus('You are already subscribed!');
            } else {
                setStatus(error.message || 'Failed to subscribe. Please try again.');
            }
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top-grid">

                    {/* Brand Info */}
                    <div className="footer-col brand-col">
                        <Link href="/" className="footer-logo-link">
                            <img
                                src="/rwflogo.gif"
                                alt="Rustam Welfare Foundation Logo"
                                className="footer-logo"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </Link>
                        <h3 className="footer-brand-name">Rustam Welfare Foundation</h3>
                        <p className="footer-tagline">
                            Dedicated to Serving Humanity with Compassion and Hope
                        </p>
                        <div className="social-links mt-1">
                            <a href="https://www.facebook.com/rustamwelfarefoundation/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.youtube.com/@rustamwelfarefoundation9556" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Youtube size={20} />
                            </a>
                            <a href="https://www.tiktok.com/@rustam.welfare.foundaton" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                                </svg>
                            </a>
                            <a href="http://instagram.com/zafarsabatkhel/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link href="#about">About Us</Link></li>
                            <li><Link href="#initiatives">Our Work</Link></li>
                            <li><Link href="#gallery">Gallery</Link></li>
                            <li><Link href="#donate">Donate Now</Link></li>
                            <li><Link href="#contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <MapPin size={18} className="footer-icon" />
                                <span>Rustam, Mardan, KPK, Pakistan</span>
                            </li>
                            <li>
                                <Phone size={18} className="footer-icon" />
                                <span>0300-9874758</span>
                            </li>
                            <li>
                                <Mail size={18} className="footer-icon" />
                                <span>zafarali030098@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Volunteer Spotlight */}
                    <div className="footer-col newsletter-col">
                        <div className="volunteer-spotlight mb-2">
                            <h4 className="footer-heading flex items-center gap-1">
                                Volunteer Spotlight <Heart size={16} className="text-green" />
                            </h4>
                            <p className="spotlight-text">
                                "Volunteering here changed my perspective on community service." - <em>Ahmed K.</em>
                            </p>
                            <Link href="#contact" className="volunteer-link">
                                Join our volunteer team <ArrowRight size={14} />
                            </Link>
                        </div>

                        <h4 className="footer-heading">Newsletter</h4>
                        <p className="newsletter-text">Subscribe to our updates.</p>
                        <form className="newsletter-form flex" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="newsletter-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="newsletter-btn">
                                <ArrowRight size={18} />
                            </button>
                        </form>
                        {status && <p className={`newsletter-status mt-1 ${status.includes('success') ? 'text-green' : 'text-gray'}`}>{status}</p>}
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Rustam Welfare Foundation. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
