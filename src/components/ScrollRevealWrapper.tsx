'use client';

import React, { useEffect } from 'react';

const ScrollRevealWrapper = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animated if we only want it to happen once
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Add reveal class to all major sections
        // Wait briefly to ensure DOM is ready
        setTimeout(() => {
            const sections = document.querySelectorAll('section > .container > div, section > .container > h2, .reveal');
            sections.forEach(sec => {
                if (!sec.classList.contains('reveal')) {
                    sec.classList.add('reveal');
                }
                observer.observe(sec);
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    return <>{children}</>;
};

export default ScrollRevealWrapper;
