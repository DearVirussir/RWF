import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Plus, Image as ImageIcon, Briefcase } from 'lucide-react';

const StaffManagement = () => {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        position: '',
        image_url: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching staff:', error);
        } else {
            setStaff(data || []);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const { error } = await supabase
            .from('staff')
            .insert([newStaff]);

        if (!error) {
            setNewStaff({ name: '', position: '', image_url: '' });
            setShowAddForm(false);
            fetchStaff();
        } else {
            alert('Failed to add staff member: ' + error.message);
        }
        setSubmitting(false);
    };

    const deleteStaff = async (id: string) => {
        if (confirm('Delete this staff member?')) {
            const { error } = await supabase
                .from('staff')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchStaff();
            }
        }
    };

    if (loading) return <div className="p-4">Loading staff directory...</div>;

    return (
        <div className="admin-tab-content">
            <div className="flex justify-between items-center mb-2">
                <h3>Staff & Volunteer Management</h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-1"
                >
                    {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Member</>}
                </button>
            </div>

            {showAddForm && (
                <div className="card mb-2" style={{ backgroundColor: 'var(--secondary-bg)' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Add New Staff Member</h4>
                    <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Position / Role *</label>
                                <input
                                    type="text"
                                    value={newStaff.position}
                                    onChange={e => setNewStaff({ ...newStaff, position: e.target.value })}
                                    required
                                    placeholder="e.g. Volunteer, Director"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                value={newStaff.image_url}
                                onChange={e => setNewStaff({ ...newStaff, image_url: e.target.value })}
                                required
                                placeholder="https://i.ibb.co/..."
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                            {submitting ? 'Adding...' : 'Save Member'}
                        </button>
                    </form>
                </div>
            )}

            {staff.length === 0 ? (
                <p className="text-gray mt-2">No staff listed yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {staff.map(member => (
                        <div key={member.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '12px', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: '180px', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {member.image_url ? (
                                    <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon color="#aaa" size={40} />
                                )}
                            </div>
                            <div className="flex flex-col flex-1 w-full" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--accent-emphasis)' }}>{member.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary-green)', marginBottom: '1rem', fontWeight: '600' }}>
                                    <Briefcase size={16} />
                                    <span>{member.position}</span>
                                </div>

                                <div className="flex justify-center items-center w-full" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                                    <button
                                        onClick={() => deleteStaff(member.id)}
                                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Remove Member"
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

export default StaffManagement;
