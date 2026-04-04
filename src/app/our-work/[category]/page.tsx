'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryStories() {
    const params = useParams();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categorySlug = params.category as string || '';

    // Convert slug back to title for display and query (e.g., 'small-business-stalls' -> 'Small Business Stalls')
    const categoryTitle = categorySlug
        .split('-')
        .map(word => {
            // handle edge cases for matching DB exactly
            if(word.toLowerCase() === 'help' && categorySlug.includes('education')) return 'Help';
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');

    useEffect(() => {
        if (!categoryTitle) return;

        const fetchStories = async () => {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .eq('category', categoryTitle)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setStories(data);
            }
            setLoading(false);
        };

        fetchStories();
    }, [categoryTitle]);

    return (
        <main className="min-h-screen flex flex-col bg-light">
            {/* The navbar handles its own state. Giving it a div wrapper to force solid mode isn't needed strictly but adds padding */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                <Navbar />
            </div>
            
            <div style={{ paddingTop: '120px', flex: 1 }} className="container py-section">
                <Link href="/#our-work" className="btn-outline mb-2 flex items-center gap-1 text-sm" style={{ padding: '0.4rem 0.8rem', width: 'fit-content', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Programs
                </Link>
                
                <div className="text-center mb-3">
                    <h1 className="section-title">{categoryTitle} Initiatives</h1>
                    <p className="text-gray" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        Explore our transparent impact. Below are the specific success stories and proof of work for our {categoryTitle} programs.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center p-4">Loading stories...</div>
                ) : stories.length === 0 ? (
                    <div className="text-center p-4 text-gray card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h4 className="mb-1 text-dark">No stories yet!</h4>
                        <p>No success stories have been uploaded to this category yet. Please check back later or start a campaign!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {stories.map((story) => (
                            <div key={story.id} className="card group" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '240px', overflow: 'hidden', position: 'relative', backgroundColor: '#e2e8f0' }}>
                                    {story.image_url && (
                                        <img 
                                            src={story.image_url} 
                                            alt={story.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                                            className="group-hover:scale-105"
                                        />
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary-green)' }}>{story.title}</h3>
                                    <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                                        {story.description}
                                    </p>
                                    {story.event_date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--text-gray)', fontSize: '0.85rem' }}>
                                            <Calendar size={14} />
                                            <span>{new Date(story.event_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
