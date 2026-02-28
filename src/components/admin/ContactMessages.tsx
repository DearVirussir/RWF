import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2 } from 'lucide-react';

const ContactMessages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const markAsRead = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ is_read: !currentStatus })
            .eq('id', id);

        if (!error) {
            fetchMessages();
        }
    };

    const deleteMessage = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchMessages();
            }
        }
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-2">
                <h3>Contact Messages</h3>
                <button onClick={fetchMessages} className="btn-outline">Refresh</button>
            </div>

            {messages.length === 0 ? (
                <p className="text-gray">No messages found.</p>
            ) : (
                <div className="messages-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className="card" style={{ padding: '1.5rem', borderLeft: msg.is_read ? '4px solid #E0E0E0' : '4px solid var(--primary-green)' }}>
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {msg.subject}
                                        {!msg.is_read && <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-green)', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>New</span>}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                                        From: {msg.name} ({msg.email}) • {new Date(msg.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => markAsRead(msg.id, msg.is_read)}
                                        className="btn-outline"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    >
                                        {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className="btn-outline"
                                        style={{ padding: '0.4rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--secondary-bg)', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
