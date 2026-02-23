import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { CreditCard, Info, MapPin, Calendar, Users } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const StudentDashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [room, setRoom] = useState<any>(null);
    const [fees, setFees] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profileData } = await supabase
                .from('Profile')
                .select('*, room:Room(*)')
                .eq('userId', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setRoom(profileData.room);

                const { data: feeData } = await supabase
                    .from('Fee')
                    .select('*')
                    .eq('profileId', profileData.id);
                setFees(feeData || []);

                const { data: complaintData } = await supabase
                    .from('Complaint')
                    .select('*')
                    .eq('profileId', profileData.id)
                    .order('createdAt', { ascending: false });
                setComplaints(complaintData || []);
            }
            setLoading(false);
        };
        fetchStudentData();
    }, []);

    const unpaidFee = fees.find(f => f.status === 'PENDING');

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="STUDENT" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Hello, {profile?.firstName || 'Student'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Check your stay status and notifications</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card glass" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                        <h3 style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Room Details</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <MapPin size={24} />
                            <div>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem' }}>Block & Room</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{room ? `Room ${room.number}` : 'Not Assigned'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Users size={24} />
                            <div>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem' }}>Type</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{room?.type || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Fee Status</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Latest Due</p>
                                <h2>{unpaidFee ? `$${unpaidFee.amount}` : '$0.00'}</h2>
                            </div>
                            <span style={{
                                background: unpaidFee ? '#fee2e2' : '#dcfce7',
                                color: unpaidFee ? '#b91c1c' : '#166534',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>{unpaidFee ? 'Unpaid' : 'Paid'}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={!unpaidFee}>
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
                            {complaints.length > 0 ? complaints.map((c, i) => (
                                <div key={i} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{c.title}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: c.status === 'RESOLVED' ? '#166534' : '#854d0e'
                                        }}>{c.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> {new Date(c.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No complaints found.</p>
                            )}
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
