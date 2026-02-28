'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
    BarChart3,
    Image as ImageIcon,
    FileText,
    MessageSquare,
    DollarSign,
    LogOut,
    FolderOpen
} from 'lucide-react';
import './AdminDashboard.css';

interface AdminDashboardProps {
    session: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
    const [activeTab, setActiveTab] = useState('stats');

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stats':
                return <StatisticsDashboard />;
            case 'cases':
                return <CaseManagement />;
            case 'staff':
                return <StaffManagement />;
            case 'gallery':
                return <GalleryManagement />;
            case 'newsletter':
                return <NewsletterManagement />;
            case 'updates':
                return <ProgressUpdates />;
            case 'donations':
                return <DonationTracking />;
            case 'messages':
                return <ContactMessages />;
            default:
                return <StatisticsDashboard />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <img src="https://i.ibb.co/vC9QCp6X/RWF-logo.png" alt="Logo" className="admin-sidebar-logo" />
                    <h3>Admin Panel</h3>
                </div>

                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                        <BarChart3 size={20} /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>
                        <FolderOpen size={20} /> Case Management
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
                        <Briefcase size={20} /> Staff & Volunteers
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
                        <ImageIcon size={20} /> Gallery Management
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'newsletter' ? 'active' : ''}`} onClick={() => setActiveTab('newsletter')}>
                        <MailIcon size={20} /> Newsletter
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'updates' ? 'active' : ''}`} onClick={() => setActiveTab('updates')}>
                        <FileText size={20} /> Progress Updates
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
                        <DollarSign size={20} /> Donations Info
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                        <MessageSquare size={20} /> Messages
                    </button>
                </nav>

                <div className="admin-logout-container">
                    <div className="admin-user-info">
                        <span className="text-xs text-gray">Logged in as:</span>
                        <span className="admin-email truncate">{session.user.email}</span>
                    </div>
                    <button onClick={handleLogout} className="admin-logout-btn btn-outline">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
                </header>
                <div className="admin-content-area">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};

// ------------- Tab Components -------------
import GalleryManagement from './admin/GalleryManagement';
import ContactMessages from './admin/ContactMessages';
import CaseManagement from './admin/CaseManagement';
import StaffManagement from './admin/StaffManagement';
import NewsletterManagement from './admin/NewsletterManagement';
import { Briefcase, Mail as MailIcon } from 'lucide-react';

const StatisticsDashboard = () => {
    const [stats, setStats] = useState({
        cases: 0,
        messages: 0,
        images: 0,
        subscribers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    { count: casesCount },
                    { count: messagesCount },
                    { count: imagesCount },
                    { count: subsCount }
                ] = await Promise.all([
                    supabase.from('cases').select('*', { count: 'exact', head: true }),
                    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
                    supabase.from('gallery').select('*', { count: 'exact', head: true }),
                    supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    cases: casesCount || 0,
                    messages: messagesCount || 0,
                    images: imagesCount || 0,
                    subscribers: subsCount || 0
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-stats-grid">
            <div className="stat-card">
                <h3>Newsletter Subscribers</h3>
                <p className="stat-value text-green">{loading ? '...' : stats.subscribers}</p>
            </div>
            <div className="stat-card">
                <h3>Active Cases</h3>
                <p className="stat-value">{loading ? '...' : stats.cases}</p>
            </div>
            <div className="stat-card">
                <h3>Unread Messages</h3>
                <p className="stat-value">{loading ? '...' : stats.messages}</p>
            </div>
            <div className="stat-card">
                <h3>Gallery Images</h3>
                <p className="stat-value">{loading ? '...' : stats.images}</p>
            </div>

            <div className="stat-card full-width mt-2">
                <h3>Welcome to the Rustam Welfare Foundation Admin Dashboard</h3>
                <p className="mt-1 text-gray">
                    Use the sidebar to navigate between different management modules.
                    You can manage newsletter subscribers, upload images to the gallery, post progress updates, manage cases, and read messages from the contact form.
                </p>
            </div>
        </div>
    );
};

const ProgressUpdates = () => <div className="card"><h3>Progress Updates</h3><p>Post recent news and success stories. (Coming Soon)</p></div>;
const DonationTracking = () => <div className="card"><h3>Donations</h3><p>View and verify incoming donations. (Coming Soon)</p></div>;

export default AdminDashboard;
