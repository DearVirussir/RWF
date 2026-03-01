'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './Cases.css';

const Cases = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultCases = [
        {
            id: '1',
            title: 'Emergency Medical Support for Ali',
            description: 'Ali urgently needs funds for a life-saving surgery. The family cannot afford the full medical expenses.',
            amount_needed: 500000,
            amount_raised: 200000,
            image_url: 'https://i.ibb.co/k2cr632d/Whats-App-Image-2026-02-25-at-3-25-38-PM-1.jpg',
            status: 'Active'
        },
        {
            id: '2',
            title: 'School Rebuild Initiative',
            description: 'We are raising funds to rebuild a local primary school that was severely damaged in recent floods.',
            amount_needed: 1000000,
            amount_raised: 750000,
            image_url: 'https://i.ibb.co/k2cr632d/Whats-App-Image-2026-02-25-at-3-25-38-PM-1.jpg',
            status: 'Active'
        }
    ];

    useEffect(() => {
        const fetchCases = async () => {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
                setCases(defaultCases);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('cases')
                .select('*')
                .eq('status', 'Active')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                setCases(defaultCases);
            } else {
                setCases(data);
            }
            setLoading(false);
        };

        fetchCases();
    }, []);

    if (cases.length === 0 && !loading) return null;

    return (
        <section id="cases" className="py-section">
            <div className="container">
                <h2 className="section-title">Urgent Cases</h2>
                <p className="text-center text-gray mb-2" style={{ maxWidth: '750px', margin: '0 auto 3rem auto' }}>
                    These are the most critical situations demanding immediate attention. Your contribution can provide life-saving relief today.
                </p>

                <div className="cases-grid">
                    {cases.map((c) => {
                        const progress = c.amount_needed > 0 ? (c.amount_raised / c.amount_needed) * 100 : 0;
                        return (
                            <div key={c.id} className="case-card card">
                                <div className="case-image-wrapper">
                                    {c.image_url ? (
                                        <img src={c.image_url} alt={c.title} className="case-img" loading="lazy" />
                                    ) : (
                                        <div className="case-placeholder">No Image</div>
                                    )}
                                    <div className="case-status">{c.status}</div>
                                </div>

                                <div className="case-content">
                                    <h3 className="case-title">{c.title}</h3>
                                    <p className="case-desc">{c.description}</p>

                                    <div className="case-progress-wrapper">
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                        <div className="progress-stats">
                                            <div>
                                                <span className="stat-label">Raised</span>
                                                <span className="stat-value">Rs {c.amount_raised.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="stat-label">Goal</span>
                                                <span className="stat-value">Rs {c.amount_needed.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="#donate" className="btn-primary w-full mt-1 flex justify-center">
                                        Donate to this Cause
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Cases;
