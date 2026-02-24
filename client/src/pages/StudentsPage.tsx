import Sidebar from '../components/Sidebar';
import { Search, Mail, Phone, MapPin, X, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
                role: s.role,
                userId: s.userId,
                joinDate: new Date(s.createdAt).toLocaleDateString(),
                status: 'Active'
            })) || [];
            // Only show students, not admins (unless the admin wants to see everyone)
            setStudents(formatted.filter(s => s.role === 'STUDENT'));
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

    const handleDeleteStudent = async () => {
        if (!selectedStudent) return;

        const { error } = await supabase
            .from('Profile')
            .delete()
            .eq('id', selectedStudent.id);

        if (error) {
            alert("Error deleting student: " + error.message);
        } else {
            setShowDeleteModal(false);
            alert("Student profile and associated data removed.");
            fetchStudents();
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="main-layout">
            <Sidebar role="ADMIN" />
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Student Directory</h1>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>Loading students...</p>
                        ) : filteredStudents.length > 0 ? filteredStudents.map((student) => (
                            <div key={student.id} className="card animate-fade-in" style={{ border: '1px solid var(--border)', position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: 'var(--primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', fontWeight: 700, flexShrink: 0
                                    }}>
                                        {student.name[0]}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h3 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name}</h3>
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
                                        <Mail size={16} style={{ flexShrink: 0 }} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Phone size={16} style={{ flexShrink: 0 }} /> {student.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <MapPin size={16} style={{ flexShrink: 0 }} /> Room {student.roomNo}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn"
                                            onClick={() => { setSelectedStudent(student); setNewRoomId(student.roomId || ''); setShowModal(true); }}
                                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
                                            Assign
                                        </button>
                                        <button className="btn"
                                            onClick={() => { setSelectedStudent(student); setShowDeleteModal(true); }}
                                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.joinDate}</span>
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
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
                            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                            <h3>Remove Student?</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '2rem' }}>
                                This will remove <strong>{selectedStudent?.name}</strong> from the system and unassign any rooms.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn"
                                    style={{ flex: 1, background: '#f1f5f9', border: 'none', color: 'var(--text-main)' }}>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteStudent}
                                    className="btn"
                                    style={{ flex: 1, background: '#ef4444', border: 'none', color: 'white' }}>
                                    Confirm Removal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentsPage;

