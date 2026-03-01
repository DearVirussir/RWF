'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Team', href: '#staff' },
        { name: 'Cases', href: '#cases' },
        { name: 'Our Work', href: '#initiatives' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Donate', href: '#donate' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container flex items-center justify-between">
                <Link href="/" className="logo-link">
                    <img
                        src="/rwflogo.gif"
                        alt="Rustam Welfare Foundation Logo"
                        className="navbar-logo"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-links desktop-only flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="nav-item">
                            {link.name}
                        </Link>
                    ))}
                    <Link href="#donate" className="btn-primary donate-btn">
                        Donate Now
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <div className="mobile-only">
                    <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links flex flex-col items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="mobile-nav-item"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="#donate"
                        className="btn-primary mt-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Donate Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
