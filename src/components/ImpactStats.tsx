'use client';

import React, { useEffect, useRef, useState } from 'react';
import './ImpactStats.css';
import { Users, Droplet, BookOpen, HeartPulse } from 'lucide-react';

const stats = [
    {
        id: 1,
        title: "Lives Impacted",
        endValue: 50000,
        icon: <Users size={32} />,
        suffix: "+"
    },
    {
        id: 2,
        title: "Water Wells Built",
        endValue: 120,
        icon: <Droplet size={32} />,
        suffix: ""
    },
    {
        id: 3,
        title: "Students Sponsored",
        endValue: 1500,
        icon: <BookOpen size={32} />,
        suffix: "+"
    },
    {
        id: 4,
        title: "Medical Camps",
        endValue: 45,
        icon: <HeartPulse size={32} />,
        suffix: ""
    }
];

const AnimatedCounter = ({ endValue, duration, suffix }: { endValue: number, duration: number, suffix: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let startTimestamp: number | null = null;
                const step = (timestamp: number) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    setCount(Math.floor(progress * endValue));
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        setCount(endValue);
                    }
                };
                window.requestAnimationFrame(step);
                if (countRef.current) {
                    observer.unobserve(countRef.current);
                }
            }
        }, { threshold: 0.5 });

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [endValue, duration]);

    return (
        <div ref={countRef} className="stat-number">
            {count.toLocaleString()}{suffix}
        </div>
    );
};

const ImpactStats = () => {
    return (
        <section className="impact-stats-section py-section">
            <div className="container">
                <div className="stats-header text-center mb-4">
                    <h2 className="section-title text-white">Our Impact in Numbers</h2>
                    <p className="text-white opacity-80" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        With your continuous support, we've been able to reach thousands of individuals and create lasting change across communities.
                    </p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-card reveal">
                            <div className="stat-icon-wrapper">
                                {stat.icon}
                            </div>
                            <AnimatedCounter endValue={stat.endValue} duration={2000} suffix={stat.suffix} />
                            <h3 className="stat-title">{stat.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactStats;
