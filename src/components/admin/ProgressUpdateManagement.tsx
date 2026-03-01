'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/uploadUtils';
import { Trash2, Plus, Image as ImageIcon, Upload, Save, X } from 'lucide-react';

const ProgressUpdateManagement = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [newUpdate, setNewUpdate] = useState({
        title: '',
        content: '',
        image_url: ''
    });

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('progress_updates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching updates:', error);
        else setUpdates(data || []);
        setLoading(false);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let finalImageUrl = newUpdate.image_url;

            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const { error } = await supabase
                .from('progress_updates')
                .insert([{
                    ...newUpdate,
                    image_url: finalImageUrl
                }]);

            if (error) throw error;

            setNewUpdate({ title: '', content: '', image_url: '' });
            setSelectedFile(null);
            setShowAddForm(false);
            fetchUpdates();
        } catch (error: any) {
            alert('Error adding update: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this update?')) return;

        const { error } = await supabase
            .from('progress_updates')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting update: ' + error.message);
        else fetchUpdates();
    };

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-1">
                <h3>Progress Updates & Success Stories</h3>
                <button 
                    className="btn-primary flex items-center gap-1"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Update</>}
                </button>
            </div>

            {showAddForm && (
                <div className="card mb-2 animate-fade-in">
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-1">
                        <div className="form-group">
                            <label>Update Title *</label>
                            <input
                                type="text"
                                value={newUpdate.title}
                                onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })}
                                className="form-control"
                                required
                                placeholder="e.g. Phase 1 of Ramadan Rashan Complete"
                            />
                        </div>

                        <div className="form-group">
                            <label>Content / Story *</label>
                            <textarea
                                value={newUpdate.content}
                                onChange={e => setNewUpdate({ ...newUpdate, content: e.target.value })}
                                className="form-control"
                                rows={4}
                                required
                                placeholder="Describe the achievement or news..."
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Image (Optional)</label>
                            <div className="flex gap-1 items-center">
                                <div className="file-upload-wrapper flex-1">
                                    <input
                                        type="file"
                                        id="update-file"
                                        accept="image/*"
                                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="update-file" className="form-control flex items-center justify-center gap-1 cursor-pointer">
                                        <Upload size={18} className="text-green" />
                                        {selectedFile ? selectedFile.name : 'Choose Image File'}
                                    </label>
                                </div>
                                <span className="text-gray">OR</span>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={newUpdate.image_url}
                                    onChange={e => setNewUpdate({ ...newUpdate, image_url: e.target.value })}
                                    className="form-control flex-1"
                                    disabled={!!selectedFile}
                                />
                            </div>
                        </div>

                        <div className="mt-1 flex justify-end">
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Posting...' : 'Post Update'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading updates...</p>
            ) : (
                <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {updates.map((item) => (
                        <div key={item.id} className="card p-1 flex flex-col gap-1 relative overflow-hidden" style={{ padding: '1.5rem' }}>
                            {item.image_url && (
                                <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }} 
                                />
                            )}
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                                <p className="text-gray" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    {item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}
                                </p>
                                <div className="flex justify-between items-center mt-auto pt-1 border-top">
                                    <span style={{ fontSize: '0.8rem' }} className="text-gray">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <button 
                                        className="text-red hover:underline flex items-center gap-05" 
                                        onClick={() => handleDelete(item.id)}
                                        style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {updates.length === 0 && <p className="text-gray">No updates posted yet.</p>}
                </div>
            )}
        </div>
    );
};

export default ProgressUpdateManagement;
