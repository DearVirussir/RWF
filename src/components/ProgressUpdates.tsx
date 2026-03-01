'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Calendar } from 'lucide-react';
import './ProgressUpdates.css';

const ProgressUpdates = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultUpdates = [
        { id: 'f1', title: 'Phase 1: Ramadan Rashan Distribution', content: 'We have successfully completed the first phase of our Ramadan food package distribution, reaching over 200 families in rural areas.', image_url: 'https://i.ibb.co/k2cr632d/Whats-App-Image-2026-02-25-at-3-25-38-PM-1.jpg', created_at: new Date().toISOString() },
        { id: 'f2', title: 'New Secondary School Project', content: 'Construction has begun on our new vocational training center. This project aims to empower local youth with technical skills.', image_url: 'https://i.ibb.co/k2cr632d/Whats-App-Image-2026-02-25-at-3-25-38-PM-1.jpg', created_at: new Date().toISOString() },
        { id: 'f3', title: 'Mobile Clinic Success', content: 'Our mobile healthcare unit served over 500 patients last month, providing essential medical checkups and free medicines.', image_url: 'https://i.ibb.co/k2cr632d/Whats-App-Image-2026-02-25-at-3-25-38-PM-1.jpg', created_at: new Date().toISOString() }
    ];

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        const { data, error } = await supabase
            .from('progress_updates')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (!error && data && data.length > 0) {
            setUpdates(data);
        } else {
            console.log('Using default updates (No data found or error)');
            setUpdates(defaultUpdates);
        }
        setLoading(false);
    };

    if (loading) return null;

    return (
        <section id="updates" className="py-section updates-section">
            <div className="container">
                <div className="section-header text-center mb-3">
                    <h2 className="section-title">Latest Updates & Success Stories</h2>
                    <p className="text-gray">Stay informed about our recent activities and witness the impact of your support.</p>
                </div>

                <div className="updates-grid">
                    {updates.map((update) => (
                        <div key={update.id} className="update-card reveal">
                            {update.image_url && (
                                <div className="update-image">
                                    <img src={update.image_url} alt={update.title} loading="lazy" />
                                </div>
                            )}
                            <div className="update-content">
                                <div className="update-date">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(update.created_at).toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>
                                <h3 className="update-title">{update.title}</h3>
                                <p className="update-excerpt">
                                    {update.content.length > 150 
                                        ? update.content.substring(0, 150) + '...' 
                                        : update.content}
                                </p>
                                <button className="read-more-btn">
                                    Read Full Story <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgressUpdates;
