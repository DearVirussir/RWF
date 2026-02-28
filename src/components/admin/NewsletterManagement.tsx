'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, Trash2, Loader2, Download } from 'lucide-react';

const NewsletterManagement = () => {
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching emails:', error);
        } else {
            setEmails(data || []);
        }
        setLoading(false);
    };

    const deleteEmail = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscription?')) return;

        const { error } = await supabase
            .from('newsletter_subscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Failed to delete.');
        } else {
            fetchEmails();
        }
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Subscribed At\n"
            + emails.map(e => `${e.email},${new Date(e.created_at).toLocaleString()}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscriptions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="newsletter-management">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-xl font-bold">Newsletter Subscriptions</h3>
                    <p className="text-gray">Total Subscribers: {emails.length}</p>
                </div>
                <button 
                    onClick={exportToCSV} 
                    className="btn-outline flex items-center gap-1"
                    disabled={emails.length === 0}
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <div className="flex justify-center py-2">
                        <Loader2 className="animate-spin text-green" />
                    </div>
                ) : emails.length === 0 ? (
                    <p className="text-center py-2 text-gray">No subscriptions yet.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Email Address</th>
                                    <th>Subscribed Date</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emails.map((item) => (
                                    <tr key={item.id}>
                                        <td className="font-semibold">
                                            <div className="flex items-center gap-1">
                                                <Mail size={16} className="text-gray" />
                                                {item.email}
                                            </div>
                                        </td>
                                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td className="text-right">
                                            <button 
                                                onClick={() => deleteEmail(item.id)}
                                                className="btn-icon text-red"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterManagement;
