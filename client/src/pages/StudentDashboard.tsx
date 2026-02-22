import React from 'react';
import Sidebar from '../components/Sidebar';
import { CreditCard, ClipboardList, Info, MapPin, Calendar, Users } from 'lucide-react';

const StudentDashboard = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="STUDENT" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Hello, Alex Johnson</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Check your stay status and notifications</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card glass" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                        <h3 style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Room Details</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <MapPin size={24} />
                            <div>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem' }}>Block & Room</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>Block A, Room 302</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Users size={24} />
                            <div>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem' }}>Roommates</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>2 / 3 Occupied</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Fee Status</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monthly Rent</p>
                                <h2>$450.00</h2>
                            </div>
                            <span style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>Unpaid</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <CreditCard size={18} /> Pay Now
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>My Complaints</h3>
                            <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid var(--border)' }}>
                                New Complaint
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { title: 'AC Not Working', date: 'Feb 20, 2026', status: 'In Progress' },
                                { title: 'Wi-Fi Connectivity', date: 'Jan 15, 2026', status: 'Resolved' }
                            ].map((c, i) => (
                                <div key={i} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{c.title}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: c.status === 'Resolved' ? '#166534' : '#854d0e'
                                        }}>{c.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> {c.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ background: '#f8fafc' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Notice Board</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <Info color="var(--primary)" size={24} />
                            <p style={{ fontSize: '0.9rem' }}>Electricity maintenance scheduled for tomorrow between 2 PM to 4 PM.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Info color="var(--primary)" size={24} />
                            <p style={{ fontSize: '0.9rem' }}>Mess registration for the next semester is now open. Please register by Feb 28.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
