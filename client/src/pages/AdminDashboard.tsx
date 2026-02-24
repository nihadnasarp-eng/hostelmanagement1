import Sidebar from '../components/Sidebar';
import { Users, Home, ClipboardList, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { name: 'Total Students', value: '0', icon: <Users />, color: '#6366f1' },
        { name: 'Rooms Available', value: '0', icon: <Home />, color: '#10b981' },
        { name: 'Pending Fees', value: '$0', icon: <DollarSign />, color: '#f59e0b' },
        { name: 'Active Complaints', value: '0', icon: <ClipboardList />, color: '#ef4444' },
    ]);
    const [recentStudents, setRecentStudents] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Stats
            const { count: studentCount } = await supabase.from('Profile').select('*', { count: 'exact', head: true });
            const { count: roomCount } = await supabase.from('Room').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE');
            const { data: fees } = await supabase.from('Fee').select('amount').eq('status', 'PENDING');
            const { count: complaintCount } = await supabase.from('Complaint').select('*', { count: 'exact', head: true }).eq('status', 'OPEN');

            const totalPendingFees = fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

            setStats([
                { name: 'Total Students', value: (studentCount || 0).toString(), icon: <Users />, color: '#6366f1' },
                { name: 'Rooms Available', value: (roomCount || 0).toString(), icon: <Home />, color: '#10b981' },
                { name: 'Pending Fees', value: `$${totalPendingFees}`, icon: <DollarSign />, color: '#f59e0b' },
                { name: 'Active Complaints', value: (complaintCount || 0).toString(), icon: <ClipboardList />, color: '#ef4444' },
            ]);

            // Recent Registrations
            const { data: students } = await supabase
                .from('Profile')
                .select('*, room:Room(*)')
                .order('id', { ascending: false }) // Fallback since no createdAt in Profile schema snippet
                .limit(5);

            setRecentStudents(students || []);
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="main-layout">
            <Sidebar role="ADMIN" />
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem', fontSize: '1.8rem' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back to the management portal</p>
                    </div>
                    <button className="btn btn-primary" style={{ width: 'auto' }}>
                        Generate Report
                    </button>
                </header>

                <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat, index) => (
                        <div key={stat.name} className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: `${index * 0.1}s` }}>
                            <div style={{
                                background: stat.color + '20',
                                color: stat.color,
                                padding: '1rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.name}</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div className="card" style={{ overflowX: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Recent Registrations</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Student Name</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Room No</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Role</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentStudents.length > 0 ? recentStudents.map((s) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                                        <td style={{ padding: '1rem 0' }}>{s.room?.number || 'Unassigned'}</td>
                                        <td style={{ padding: '1rem 0' }}>{s.role}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                background: '#dcfce7',
                                                color: '#166534',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600
                                            }}>Active</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent registrations.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>System Health</h3>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', background: '#f0f9ff' }}>
                            <TrendingUp color="#0ea5e9" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Real-time Syncing</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369a1' }}>Supabase connection is stable and active.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
                            <AlertTriangle color="#f97316" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Database Status</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#9a3412' }}>Waiting for new entries to display statistics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
