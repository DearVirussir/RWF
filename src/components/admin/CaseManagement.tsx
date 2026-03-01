import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadImage } from '@/lib/uploadUtils';

const CaseManagement = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCase, setNewCase] = useState({
        title: '',
        description: '',
        amount_needed: 0,
        amount_raised: 0,
        status: 'Active',
        image_url: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching cases:', error);
        } else {
            setCases(data || []);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let finalImageUrl = newCase.image_url;

            if (uploadMode === 'file' && selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            if (!finalImageUrl) {
                alert('Please select a case image or provide a URL');
                setSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from('cases')
                .insert([{ ...newCase, image_url: finalImageUrl }]);

            if (!error) {
                setNewCase({ title: '', description: '', amount_needed: 0, amount_raised: 0, status: 'Active', image_url: '' });
                setSelectedFile(null);
                setShowAddForm(false);
                fetchCases();
            } else {
                alert('Failed to add case: ' + error.message);
            }
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteCase = async (id: string) => {
        if (confirm('Delete this case?')) {
            const { error } = await supabase
                .from('cases')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchCases();
            }
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Completed' : 'Active';
        const { error } = await supabase
            .from('cases')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchCases();
        }
    };

    if (loading) return <div className="p-4">Loading cases...</div>;

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-2">
                <h3>Case Management</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-1"
                >
                    {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Case</>}
                </button>
            </div>

            {showAddForm && (
                <div className="card mb-2" style={{ backgroundColor: 'var(--secondary-bg)' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Add New Case</h4>
                    <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={newCase.title}
                                onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                value={newCase.description}
                                onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                                required
                                className="form-control"
                                rows={4}
                            ></textarea>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Amount Needed (PKR) *</label>
                                <input
                                    type="number"
                                    value={newCase.amount_needed === 0 ? '' : newCase.amount_needed}
                                    onChange={e => setNewCase({ ...newCase, amount_needed: parseFloat(e.target.value) || 0 })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount Raised (PKR)</label>
                                <input
                                    type="number"
                                    value={newCase.amount_raised === 0 ? '' : newCase.amount_raised}
                                    onChange={e => setNewCase({ ...newCase, amount_raised: parseFloat(e.target.value) || 0 })}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={newCase.status}
                                    onChange={e => setNewCase({ ...newCase, status: e.target.value })}
                                    className="form-control"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Case Image Source *</label>
                            <div className="flex gap-1 mb-1">
                                <button
                                    type="button"
                                    onClick={() => setUploadMode('file')}
                                    className={`btn-outline ${uploadMode === 'file' ? 'active' : ''}`}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                >
                                    Upload from Device
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadMode('url')}
                                    className={`btn-outline ${uploadMode === 'url' ? 'active' : ''}`}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                >
                                    Image URL
                                </button>
                            </div>
                            
                            {uploadMode === 'file' ? (
                                <div className="file-upload-wrapper" style={{ 
                                    border: '2px dashed var(--border-light)', 
                                    padding: '1.5rem', 
                                    borderRadius: '8px', 
                                    textAlign: 'center',
                                    backgroundColor: 'var(--main-bg)'
                                }}>
                                    <input
                                        type="file"
                                        id="case-file"
                                        accept="image/*"
                                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="case-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <Upload size={24} className="text-green" />
                                        <span className="text-dark font-semibold">
                                            {selectedFile ? selectedFile.name : 'Click to select case image from device'}
                                        </span>
                                        <span className="text-gray" style={{ fontSize: '0.8rem' }}>Supports JPG, PNG, WEBP</span>
                                    </label>
                                </div>
                            ) : (
                                <input
                                    type="url"
                                    value={newCase.image_url}
                                    onChange={e => setNewCase({ ...newCase, image_url: e.target.value })}
                                    required={uploadMode === 'url'}
                                    placeholder="https://i.ibb.co/..."
                                    className="form-control"
                                />
                            )}
                        </div>

                        <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                            {submitting ? 'Adding...' : 'Save Case'}
                        </button>
                    </form>
                </div>
            )}

            {cases.length === 0 ? (
                <p className="text-gray mt-2">No active cases currently.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {cases.map(c => (
                        <div key={c.id} className="card" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
                            <div style={{ width: '200px', height: '150px', backgroundColor: '#E0E0E0', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                {c.image_url ? (
                                    <img src={c.image_url} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon color="#aaa" size={40} />
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-dark)' }}>{c.title}</h4>
                                    <button
                                        onClick={() => toggleStatus(c.id, c.status)}
                                        className="btn-outline"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    >
                                        {c.status === 'Active' ? 'Mark Completed' : 'Make Active'}
                                    </button>
                                </div>

                                <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {c.description}
                                </p>

                                <div style={{ display: 'flex', gap: '2rem', marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-gray)', display: 'block' }}>Amount Needed</span>
                                        <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>PKR {c.amount_needed.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-gray)', display: 'block' }}>Amount Raised</span>
                                        <span style={{ fontWeight: '700', color: 'var(--primary-green)' }}>PKR {c.amount_raised.toLocaleString()}</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                        <button
                                            onClick={() => deleteCase(c.id)}
                                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CaseManagement;
