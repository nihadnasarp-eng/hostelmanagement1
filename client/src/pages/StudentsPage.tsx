import Sidebar from '../components/Sidebar';
import { UserPlus, Search, Download, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from('Profile')
                .select('*, room:Room(*)');
            if (error) console.error(error);
            else {
                const formatted = data?.map(s => ({
                    id: s.id,
                    name: `${s.firstName} ${s.lastName}`,
                    email: s.email || 'N/A', // Assuming email might be in profile or joined
                    phone: s.phoneNumber || 'N/A',
                    room: s.room?.number || 'Unassigned',
                    joinDate: new Date(s.createdAt).toLocaleDateString(),
                    status: 'Active' // Dummy status for now
                })) || [];
                setStudents(formatted);
            }
            setLoading(false);
        };
        fetchStudents();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Student Directory</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage and view all hostel residents</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" style={{ border: '1px solid var(--border)', background: 'white' }}>
                            <Download size={18} /> Export CSV
                        </button>
                        <button className="btn btn-primary">
                            <UserPlus size={18} /> Register Student
                        </button>
                    </div>
                </header>

                <section className="card">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search students by name, email or room..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {students.map((student) => (
                            <div key={student.id} className="card animate-fade-in" style={{ border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700
                                    }}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{student.name}</h3>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: student.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                            color: student.status === 'Active' ? '#166534' : '#64748b',
                                            padding: '0.1rem 0.6rem',
                                            borderRadius: '10px',
                                            fontWeight: 600
                                        }}>
                                            {student.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Mail size={16} /> {student.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Phone size={16} /> {student.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <MapPin size={16} /> Room {student.room}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joined: {student.joinDate}</span>
                                    <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudentsPage;
