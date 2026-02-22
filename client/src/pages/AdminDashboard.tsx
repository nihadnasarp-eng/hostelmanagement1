import React from 'react';
import Sidebar from '../components/Sidebar';
import { Users, Home, ClipboardList, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { name: 'Total Students', value: '248', icon: <Users />, color: '#6366f1' },
        { name: 'Rooms Available', value: '12', icon: <Home />, color: '#10b981' },
        { name: 'Pending Fees', value: '$2,450', icon: <DollarSign />, color: '#f59e0b' },
        { name: 'Active Complaints', value: '8', icon: <ClipboardList />, color: '#ef4444' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back to the management portal</p>
                    </div>
                    <button className="btn btn-primary">
                        Generate Report
                    </button>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat) => (
                        <div key={stat.name} className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Recent Registrations</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Student Name</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Room No</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Date</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 500 }}>Student {i}</td>
                                        <td style={{ padding: '1rem 0' }}>B-{100 + i}</td>
                                        <td style={{ padding: '1rem 0' }}>Feb 22, 2026</td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Notifications</h3>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
                            <AlertTriangle color="#f97316" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Water Leakage</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#9a3412' }}>Block A Room 204 needs immediate repair.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '12px', background: '#f0f9ff' }}>
                            <TrendingUp color="#0ea5e9" />
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Monthly Report</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369a1' }}>Revenue increased by 15% this month.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
