import Sidebar from '../components/Sidebar';
import { UserPlus, Search, Download, Mail, Phone, MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [newRoomId, setNewRoomId] = useState('');

    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Profile')
            .select('*, room:Room(*)');
        if (error) console.error(error);
        else {
            const formatted = data?.map(s => ({
                id: s.id,
                name: `${s.firstName} ${s.lastName}`,
                email: s.email || 'N/A',
                phone: s.phoneNumber || 'N/A',
                roomNo: s.room?.number || 'Unassigned',
                roomId: s.roomId,
                joinDate: new Date(s.createdAt).toLocaleDateString(),
                status: 'Active'
            })) || [];
            setStudents(formatted);
        }
        setLoading(false);
    };

    const fetchRooms = async () => {
        const { data } = await supabase.from('Room').select('*').eq('status', 'AVAILABLE');
        setRooms(data || []);
    };

    useEffect(() => {
        fetchStudents();
        fetchRooms();
    }, []);

    const handleAssignRoom = async () => {
        if (!selectedStudent || !newRoomId) return;

        const { error } = await supabase
            .from('Profile')
            .update({ roomId: newRoomId })
            .eq('id', selectedStudent.id);

        if (error) alert(error.message);
        else {
            setShowModal(false);
            fetchStudents();
            fetchRooms();
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Student Directory</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage and view all hostel residents</p>
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
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>Loading students...</p>
                        ) : filteredStudents.length > 0 ? filteredStudents.map((student) => (
                            <div key={student.id} className="card animate-fade-in" style={{ border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: 'var(--primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', fontWeight: 700
                                    }}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{student.name}</h3>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: '#dcfce7',
                                            color: '#166534',
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
                                        <MapPin size={16} /> Room {student.roomNo}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joined: {student.joinDate}</span>
                                    <button className="btn"
                                        onClick={() => { setSelectedStudent(student); setNewRoomId(student.roomId || ''); setShowModal(true); }}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
                                        Assign Room
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No students found.</p>
                        )}
                    </div>
                </section>

                {/* Assign Room Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="card" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                            <h3>Assign Room</h3>
                            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>For {selectedStudent?.name}</p>
                            <div style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Available Room</label>
                                <select
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    value={newRoomId}
                                    onChange={e => setNewRoomId(e.target.value)}
                                >
                                    <option value="">No Room / Unassigned</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>Room {r.number} ({r.type})</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={handleAssignRoom} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                                Update Assignment
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentsPage;
