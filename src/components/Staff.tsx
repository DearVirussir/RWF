'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './Staff.css';

const Staff = () => {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultStaff = [
        { id: '1', name: 'Zafar Sabat Khiel', position: 'Chairman', image_url: 'https://i.ibb.co/LD9zWTFz/Whats-App-Image-2026-01-13-at-2-41-53-PM.jpg' }
    ];

    useEffect(() => {
        const fetchStaff = async () => {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
                setStaff(defaultStaff);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('staff')
                .select('*')
                .order('created_at', { ascending: true });

            if (error || !data || data.length === 0) {
                setStaff(defaultStaff);
            } else {
                setStaff(data);
            }
            setLoading(false);
        };

        fetchStaff();
    }, []);

    return (
        <section id="staff" className="py-section bg-light">
            <div className="container">
                <h2 className="section-title">Our Team & Volunteers</h2>
                <p className="text-center text-gray mb-2" style={{ maxWidth: '750px', margin: '0 auto 3rem auto' }}>
                    Meet the dedicated individuals who make our mission possible. Our team and volunteers work tirelessly to bring hope and support to communities.
                </p>

                <div className="staff-grid">
                    {staff.map((member) => (
                        <div key={member.id} className="staff-card card">
                            <div className="staff-image-wrapper">
                                {member.image_url ? (
                                    <img src={member.image_url} alt={member.name} className="staff-img" />
                                ) : (
                                    <div className="staff-placeholder">No Image</div>
                                )}
                            </div>
                            <div className="staff-info">
                                <h3 className="staff-name">{member.name}</h3>
                                <p className="staff-position">{member.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Staff;
