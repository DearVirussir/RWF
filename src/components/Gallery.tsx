'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar } from 'lucide-react';
import './Gallery.css';

const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fallback initial data
    const defaultItems = [
        { id: '1', title: 'Medical Camp 2023', category: 'Healthcare', image_url: '', description: 'Providing free checkups for the underprivileged.', event_date: '2023-11-15T10:00:00Z' },
        { id: '2', title: 'School Supplies', category: 'Education', image_url: '', description: 'Distributed 500 bags to students.', event_date: '2023-08-20T08:00:00Z' },
        { id: '3', title: 'Flood Relief Efforts', category: 'Relief', image_url: '', description: 'Emergency packages for affected families.', event_date: '2022-09-10T14:30:00Z' },
        { id: '4', title: 'Clean Water Project', category: 'Community', image_url: '', description: 'Installation of a new water pump.', event_date: '2024-01-05T09:00:00Z' },
        { id: '5', title: 'Winter Clothes Drive', category: 'Relief', image_url: '', description: 'Warm clothing distribution.', event_date: '2024-02-12T11:00:00Z' },
        { id: '6', title: 'Women Empowerment', category: 'Education', image_url: '', description: 'Vocational training workshop.', event_date: '2024-03-08T10:00:00Z' },
    ];

    useEffect(() => {
        const fetchGallery = async () => {
            // Check if Supabase is actually configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
                setGalleryItems(defaultItems);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            if (error || !data || data.length === 0) {
                setGalleryItems(defaultItems);
            } else {
                setGalleryItems(data);
            }
            setLoading(false);
        };

        fetchGallery();
    }, []);

    return (
        <section id="gallery" className="py-section bg-light">
            <div className="container">
                <h2 className="section-title">Our Work in Action</h2>
                <p className="text-center text-gray mb-2" style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                    Explore the impact of your contributions. Here are some of our recent activities and campaigns
                    dedicated to making a difference.
                </p>

                <div className="gallery-grid">
                    {galleryItems.map((item) => (
                        <div key={item.id} className="gallery-item group">
                            <div className="gallery-img-placeholder">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="group-hover:scale-110" loading="lazy" />
                                ) : (
                                    <span className="text-gray opacity-50">Image</span>
                                )}
                            </div>
                            <div className="gallery-overlay">
                                <div style={{ transform: 'translateY(10px)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
                                    <span className="gallery-category mb-1">{item.category}</span>
                                    <h3 className="gallery-item-title">{item.title}</h3>

                                    {item.description && (
                                        <p className="gallery-desc">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.event_date && (
                                        <div className="gallery-date">
                                            <Calendar size={14} />
                                            <span>{new Date(item.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
