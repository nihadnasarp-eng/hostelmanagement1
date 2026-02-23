import Sidebar from '../components/Sidebar';
import { ClipboardList, MessageSquare, Clock, CheckCircle, AlertCircle, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [newStatus, setNewStatus] = useState('');

    const fetchComplaints = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Complaint')
            .select('*, profile:Profile(*, room:Room(*))')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            const formatted = data?.map(c => ({
                id: c.id,
                title: c.title,
                student: `${c.profile?.firstName} ${c.profile?.lastName}`,
                room: c.profile?.room?.number || 'N/A',
                date: new Date(c.createdAt).toLocaleDateString(),
                status: c.status,
                priority: 'Medium'
            })) || [];

            setComplaints(formatted);
            setStats({
                open: data?.filter(c => c.status === 'OPEN').length || 0,
                inProgress: data?.filter(c => c.status === 'IN_PROGRESS').length || 0,
                resolved: data?.filter(c => c.status === 'RESOLVED').length || 0
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleUpdateStatus = async () => {
        const { error } = await supabase
            .from('Complaint')
            .update({ status: newStatus })
            .eq('id', selectedComplaint.id);

        if (error) alert(error.message);
        else {
            setShowModal(false);
            fetchComplaints();
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'OPEN': return { bg: '#fee2e2', color: '#b91c1c' };
            case 'IN_PROGRESS': return { bg: '#fef9c3', color: '#854d0e' };
            case 'RESOLVED': return { bg: '#dcfce7', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Complaints Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Resolve issues and track maintenance requests</p>
                    </div>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <AlertCircle size={32} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.open}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Open</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Clock size={32} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.inProgress}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>In Progress</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <CheckCircle size={32} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.resolved}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Resolved</p>
                    </div>
                </section>

                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Complaints Queue</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {complaints.length > 0 ? complaints.map((c) => {
                            const style = getStatusStyle(c.status);
                            return (
                                <div key={c.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)',
                                    background: 'white'
                                }}>
                                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <MessageSquare size={20} color={style.color} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{c.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Submitted by <strong>{c.student}</strong> • Room {c.room} • {c.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.85rem', color: style.color, fontWeight: 600 }}>{c.status.replace('_', ' ')}</span>
                                        </div>
                                        <button className="btn"
                                            onClick={() => { setSelectedComplaint(c); setNewStatus(c.status); setShowModal(true); }}
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--primary)', color: 'white' }}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No complaints found.</p>
                        )}
                    </div>
                </section>

                {/* Update Status Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="card" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                            <h3>Update Complaint Status</h3>
                            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{selectedComplaint?.title}</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>New Status</label>
                                <select
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                            </div>
                            <button onClick={handleUpdateStatus} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                                Save Status
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ComplaintsPage;
