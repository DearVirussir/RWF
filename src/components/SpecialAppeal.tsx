'use client';

import React, { useState, useEffect } from 'react';
import './RamadanAppeal.css'; 
import { ShoppingBag, Heart, Loader, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const SpecialAppeal = () => {
    const [appeal, setAppeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const defaultAppeal = {
        title: 'Special Ramadan Appeal 2026',
        subtitle: 'Eid Shopping for 600+ Orphans & Rashan Distribution',
        description: 'Once again, in this Ramadan, we are committed to providing Eid shopping for our orphans and food packages for widows. Your generous support can bring a smile to those who need it most.',
        goal_amount: 2000000,
        current_amount: 235000,
        image_url: 'https://i.ibb.co/QjDjVVZN/ramadan.jpg',
        is_active: true,
        is_ramadan_theme: true
    };

    useEffect(() => {
        fetchAppeal();
    }, []);

    const fetchAppeal = async () => {
        try {
            const { data, error } = await supabase
                .from('special_appeals')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!error && data) {
                setAppeal(data);
            } else if (error) {
                console.error('Error fetching appeal:', error);
            }
        } catch (err) {
            console.error('Error fetching appeal:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader className="animate-spin text-green" size={40} />
        </div>
    );

    if (!appeal || appeal.is_active === false) return null;

    const displayAppeal = appeal;

    const progress = displayAppeal.goal_amount > 0 
        ? Math.min(Math.round((displayAppeal.current_amount / displayAppeal.goal_amount) * 100), 100) 
        : 0;


    return (
        <section id="special-appeal" className={`ramadan-appeal-section py-section ${displayAppeal.is_ramadan_theme ? 'ramadan-theme' : 'general-theme'}`}>
            <div className="container">
                <div className="appeal-card animate-fade-in">
                    {displayAppeal.subtitle && <div className="appeal-badge">{displayAppeal.subtitle}</div>}
                    
                    <div className="appeal-grid">
                        <div className="appeal-content">
                            <h2 className="appeal-title">{displayAppeal.title}</h2>
                            <p className="appeal-description">
                                {displayAppeal.description}
                            </p>
                            
                            <div className="appeal-stats">
                                <div className="appeal-stat-item">
                                    <div className="stat-icon"><ShoppingBag size={24} /></div>
                                    <div className="stat-info">
                                        <h4>Campaign Progress</h4>
                                        <p>Goal: {Math.round(displayAppeal.goal_amount).toLocaleString()} PKR | Raised: {Math.round(displayAppeal.current_amount).toLocaleString()} PKR</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{progress}% of goal reached</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="appeal-footer">
                                <a href="#donate" className="btn-primary">
                                    <Heart size={18} className="mr-2" /> Donate to this Appeal
                                </a>
                            </div>
                        </div>
                        
                        <div className="appeal-visual">
                            <div className="visual-wrapper" style={{ borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                                {displayAppeal.image_url ? (
                                    <img 
                                        src={displayAppeal.image_url} 
                                        alt={displayAppeal.title} 
                                        className="appeal-img"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '350px', background: 'var(--secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon size={60} color="var(--text-gray)" />
                                    </div>
                                )}
                                <div className="visual-overlay">
                                    <div className="overlay-text">
                                        <span>Join our mission</span>
                                        <span>Change a life today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialAppeal;
