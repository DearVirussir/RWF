'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminDashboard from '@/components/AdminDashboard';
import './admin.css';

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // As per requirement, this is a secure login to Supabase.
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (!session) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card card">
                    <div className="text-center mb-2">
                        <img src="https://i.ibb.co/vC9QCp6X/RWF-logo.png" alt="Logo" className="admin-login-logo" />
                        <h2 className="mt-1">Admin Login</h2>
                    </div>

                    {error && <div className="admin-error-msg">{error}</div>}

                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <AdminDashboard session={session} />;
}
