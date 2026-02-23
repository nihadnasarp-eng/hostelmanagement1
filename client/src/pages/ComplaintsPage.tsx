import Sidebar from '../components/Sidebar';
import { ClipboardList, MessageSquare, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            const { data, error } = await supabase
                .from('Complaint')
                .select('*, profile:Profile(*, room:Room(*))');
            if (error) console.error(error);
            else {
                const formatted = data?.map(c => ({
                    id: c.id,
                    title: c.title,
                    student: `${c.profile?.firstName} ${c.profile?.lastName}`,
                    room: c.profile?.room?.number || 'N/A',
                    date: new Date(c.createdAt).toLocaleDateString(),
                    status: c.status,
                    priority: 'Medium' // Schema doesn't have priority yet
                })) || [];
                setComplaints(formatted);
            }
            setLoading(false);
        };
        fetchComplaints();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'OPEN': return { bg: '#fee2e2', color: '#b91c1c' };
            case 'IN_PROGRESS': return { bg: '#fef9c3', color: '#854d0e' };
            case 'RESOLVED': return { bg: '#dcfce7', color: '#166534' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="WARDEN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Complaints Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Resolve issues and track maintenance requests</p>
                    </div>
                    <button className="btn btn-primary">
                        <ClipboardList size={18} /> New Report
                    </button>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <AlertCircle size={32} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>4</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Open</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Clock size={32} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>8</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>In Progress</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <CheckCircle size={32} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>142</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Resolved</p>
                    </div>
                </section>

                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Complaints Queue</h3>
                        <button className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'white' }}>
                            <Filter size={16} /> Filter by Status
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {complaints.map((c) => {
                            const style = getStatusStyle(c.status);
                            return (
                                <div key={c.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    background: 'white',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: style.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
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
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '10px',
                                                background: c.priority === 'High' ? '#fee2e2' : '#f1f5f9',
                                                color: c.priority === 'High' ? '#b91c1c' : '#64748b',
                                                display: 'block',
                                                marginBottom: '0.25rem'
                                            }}>
                                                {c.priority} PRIORITY
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: style.color, fontWeight: 600 }}>{c.status.replace('_', ' ')}</span>
                                        </div>
                                        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--primary)', color: 'white' }}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ComplaintsPage;
