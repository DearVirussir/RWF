import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

const GalleryManagement = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newImage, setNewImage] = useState({
        title: '',
        description: '',
        event_date: '',
        category: 'General',
        image_url: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching gallery:', error);
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Convert empty string to null for timestamp
        const payload = {
            ...newImage,
            event_date: newImage.event_date ? new Date(newImage.event_date).toISOString() : null
        };

        const { error } = await supabase
            .from('gallery')
            .insert([payload]);

        if (!error) {
            setNewImage({ title: '', description: '', event_date: '', category: 'General', image_url: '' });
            setShowAddForm(false);
            fetchImages();
        } else {
            alert('Failed to add image: ' + error.message);
        }
        setSubmitting(false);
    };

    const deleteImage = async (id: string) => {
        if (confirm('Delete this image?')) {
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchImages();
            }
        }
    };

    if (loading) return <div className="p-4">Loading gallery...</div>;

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-2">
                <h3>Gallery Management</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-1"
                >
                    {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Image</>}
                </button>
            </div>

            {showAddForm && (
                <div className="card mb-2" style={{ backgroundColor: 'var(--secondary-bg)' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Add New Gallery Item</h4>
                    <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Title / Caption *</label>
                                <input
                                    type="text"
                                    value={newImage.title}
                                    onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    value={newImage.category}
                                    onChange={e => setNewImage({ ...newImage, category: e.target.value })}
                                    className="form-control"
                                >
                                    <option value="General">General</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Relief">Emergency Relief</option>
                                    <option value="Community">Community</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={newImage.description}
                                    onChange={e => setNewImage({ ...newImage, description: e.target.value })}
                                    placeholder="Short description of the event..."
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={newImage.event_date}
                                    onChange={e => setNewImage({ ...newImage, event_date: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                value={newImage.image_url}
                                onChange={e => setNewImage({ ...newImage, image_url: e.target.value })}
                                required
                                placeholder="https://i.ibb.co/..."
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                            {submitting ? 'Adding...' : 'Save to Gallery'}
                        </button>
                    </form>
                </div>
            )}

            {images.length === 0 ? (
                <p className="text-gray mt-2">No images in gallery yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {images.map(img => (
                        <div key={img.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
                            <div style={{ width: '100%', height: '180px', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {img.image_url ? (
                                    <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon color="#aaa" size={40} />
                                )}
                            </div>
                            <div className="flex flex-col flex-1" style={{ padding: '1.25rem' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{img.title}</h4>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--secondary-bg)', padding: '4px 8px', borderRadius: '4px', fontWeight: '500', display: 'inline-block', marginTop: '4px' }}>
                                            {img.category}
                                        </span>
                                    </div>
                                </div>
                                {img.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', margin: '0.5rem 0', flex: 1 }}>{img.description}</p>}

                                <div className="flex justify-between items-center" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                                        {img.event_date ? new Date(img.event_date).toLocaleDateString() : 'No date'}
                                    </span>
                                    <button
                                        onClick={() => deleteImage(img.id)}
                                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Delete Image"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryManagement;
