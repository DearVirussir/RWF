'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/uploadUtils';
import { Save, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

const AppealManagement = () => {
    const [appeal, setAppeal] = useState<any>({
        title: '',
        subtitle: '',
        description: '',
        goal_amount: 0,
        current_amount: 0,
        image_url: '',
        is_active: false,
        is_ramadan_theme: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchAppeal();
    }, []);

    const fetchAppeal = async () => {
        setLoading(true);
        // Get the single record without filtering by is_active
        const { data, error } = await supabase
            .from('special_appeals')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching appeal:', error);
            // Even on error, we keep the default state so it doesn't crash
        } else if (data) {
            setAppeal(data);
        } else {
            // No record in DB yet - we already have defaults in state, 
            // but we can set them again for clarity if needed.
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            let finalImageUrl = appeal.image_url;

            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const payload = {
                ...appeal,
                image_url: finalImageUrl,
                goal_amount: parseFloat(appeal.goal_amount) || 0,
                current_amount: parseFloat(appeal.current_amount) || 0
            };

            let result;
            if (appeal.id) {
                result = await supabase
                    .from('special_appeals')
                    .update(payload)
                    .eq('id', appeal.id);
            } else {
                result = await supabase
                    .from('special_appeals')
                    .insert([payload]);
            }

            if (result.error) throw result.error;

            setStatus({ type: 'success', message: 'Special Appeal updated successfully!' });
            setSelectedFile(null);
            fetchAppeal();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">Loading appeal settings...</div>;

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-1">
                <h3>Special Appeal Settings</h3>
                <span className="text-gray" style={{ fontSize: '0.9rem' }}>This section appears directly below the Hero section.</span>
            </div>

            {status && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'} mb-1`} style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {status.message}
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSave} className="flex flex-col gap-1">
                    <div className="form-group">
                        <label>Main Title *</label>
                        <input
                            type="text"
                            value={appeal.title || ''}
                            onChange={e => setAppeal({ ...appeal, title: e.target.value })}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Badge / Subtitle (e.g. Special Ramadan Appeal 2026)</label>
                        <input
                            type="text"
                            value={appeal.subtitle || ''}
                            onChange={e => setAppeal({ ...appeal, subtitle: e.target.value })}
                            className="form-control"
                            placeholder="A small badge that highlights the specific campaign"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={appeal.description || ''}
                            onChange={e => setAppeal({ ...appeal, description: e.target.value })}
                            className="form-control"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Goal Amount (PKR)</label>
                            <input
                                type="number"
                                value={appeal.goal_amount || 0}
                                onChange={e => setAppeal({ ...appeal, goal_amount: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Current Amount Raised (PKR)</label>
                            <input
                                type="number"
                                value={appeal.current_amount || 0}
                                onChange={e => setAppeal({ ...appeal, current_amount: e.target.value })}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Campaign Image (Best: 800x600 resolution)</label>
                        <div className="flex gap-1 items-start">
                            <div style={{ 
                                width: '120px', 
                                height: '90px', 
                                backgroundColor: 'var(--secondary-bg)', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border-light)'
                            }}>
                                {appeal.image_url ? (
                                    <img src={appeal.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon color="#aaa" size={30} />
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <div className="file-upload-wrapper" style={{ 
                                    border: '2px dashed var(--border-light)', 
                                    padding: '0.75rem', 
                                    borderRadius: '8px', 
                                    textAlign: 'center',
                                    backgroundColor: 'var(--main-bg)'
                                }}>
                                    <input
                                        type="file"
                                        id="appeal-file"
                                        accept="image/*"
                                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="appeal-file" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Upload size={18} className="text-green" />
                                        <span className="text-dark font-semibold">
                                            {selectedFile ? selectedFile.name : 'Change Image'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div className="form-group flex items-center gap-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={appeal.is_active || false}
                                onChange={e => setAppeal({ ...appeal, is_active: e.target.checked })}
                                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_active" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                <strong style={{ color: '#059669', fontSize: '1.1rem' }}>Show on Website?</strong>
                                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-gray)' }}>Turn on/off this section.</p>
                            </label>
                        </div>

                        <div className="form-group flex items-center gap-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <input
                                type="checkbox"
                                id="is_ramadan_theme"
                                checked={appeal.is_ramadan_theme || false}
                                onChange={e => setAppeal({ ...appeal, is_ramadan_theme: e.target.checked })}
                                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_ramadan_theme" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                <strong>Apply Ramadan Theme?</strong>
                                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-gray)' }}>Uses Green & Golden colors.</p>
                            </label>
                        </div>
                    </div>

                    <div className="mt-1">
                        <button type="submit" className="btn-primary flex items-center gap-1" disabled={saving}>
                            {saving ? 'Saving Changes...' : <><Save size={18} /> Save & Update Website</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppealManagement;
