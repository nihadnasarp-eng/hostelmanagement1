import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { CreditCard, MapPin, Calendar, Users, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const StudentDashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [room, setRoom] = useState<any>(null);
    const [fees, setFees] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });

    const fetchStudentData = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchStudentData();
    }, []);

    const handleReportComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('Complaint')
            .insert([{
                profileId: profile.id,
                title: newComplaint.title,
                description: newComplaint.description,
                status: 'OPEN'
            }]);

        if (error) alert(error.message);
        else {
            setShowModal(false);
            setNewComplaint({ title: '', description: '' });
            fetchStudentData();
        }
    };

    const unpaidFee = fees.find(f => f.status === 'PENDING');

    if (loading) return <div>Loading...</div>;

    return (
        <div className="main-layout">
            <Sidebar role="STUDENT" />
            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Hello, {profile?.firstName || 'Student'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Check your stay status and notifications</p>
                </header>

                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card glass animate-fade-in" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
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

                    <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
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

                <div className="grid-2-1" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>My Complaints</h3>
                            <button className="btn" onClick={() => setShowModal(true)} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid var(--border)' }}>
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
                                            fontWeight: 600,
                                            color: c.status === 'RESOLVED' ? '#166534' : c.status === 'OPEN' ? '#b91c1c' : '#854d0e'
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

                    <div className="card animate-fade-in" style={{ background: '#f8fafc', animationDelay: '0.3s' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Notice Board</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No new notifications.</p>
                    </div>
                </div>

                {/* Report Complaint Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                            <h3>Report New Issue</h3>
                            <form onSubmit={handleReportComplaint} style={{ marginTop: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Issue Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Leaking Tap"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        value={newComplaint.title}
                                        onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea
                                        rows={4}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', resize: 'none' }}
                                        value={newComplaint.description}
                                        onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Submit Report
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
