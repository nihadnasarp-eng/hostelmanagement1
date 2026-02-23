import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const WardenDashboard = () => {
    const [stats, setStats] = useState({
        pending: 0,
        resolved: 0,
        newStudents: 0
    });
    const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWardenData = async () => {
            // Fetch stats
            const { count: pendingCount } = await supabase.from('Complaint').select('*', { count: 'exact', head: true }).eq('status', 'OPEN');
            const { count: resolvedCount } = await supabase.from('Complaint').select('*', { count: 'exact', head: true }).eq('status', 'RESOLVED');
            const { count: studentCount } = await supabase.from('Profile').select('*', { count: 'exact', head: true });

            setStats({
                pending: pendingCount || 0,
                resolved: resolvedCount || 0,
                newStudents: studentCount || 0
            });

            // Fetch recent complaints
            const { data: complaintData } = await supabase
                .from('Complaint')
                .select('*, profile:Profile(*)')
                .order('createdAt', { ascending: false })
                .limit(5);

            setRecentComplaints(complaintData || []);
            setLoading(false);
        };
        fetchWardenData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="WARDEN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Warden Control Panel</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage daily operations and student complaints</p>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Clock size={32} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.pending}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Issues</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <CheckCircle size={32} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.resolved}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Resolved Overall</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Users size={32} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>{stats.newStudents}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Students</p>
                    </div>
                </section>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Active Complaints Queue</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentComplaints.length > 0 ? recentComplaints.map((task, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                background: '#fff'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ClipboardList color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{task.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {task.profile?.firstName} {task.profile?.lastName} • Room {task.profile?.roomId || 'N/A'} • {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        background: task.status === 'OPEN' ? '#fee2e2' : '#dcfce7',
                                        color: task.status === 'OPEN' ? '#b91c1c' : '#166534',
                                        textTransform: 'uppercase'
                                    }}>
                                        {task.status}
                                    </span>
                                    <button className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white' }}>
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No complaints found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WardenDashboard;
