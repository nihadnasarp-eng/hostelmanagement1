import Sidebar from '../components/Sidebar';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const RoomsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data, error } = await supabase
                .from('Room')
                .select('*');
            if (error) console.error(error);
            else setRooms(data || []);
            setLoading(false);
        };
        fetchRooms();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Room Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage hostel rooms, types and availability</p>
                    </div>
                    <button className="btn btn-primary">
                        <Plus size={18} /> Add New Room
                    </button>
                </header>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search by room number or type..."
                                className="glass"
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
                        <button className="btn" style={{ border: '1px solid var(--border)', background: 'white' }}>
                            <Filter size={18} /> Filters
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Room No</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Type</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Capacity</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Rent/Month</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading rooms...</td>
                                    </tr>
                                ) : rooms.map((room) => (
                                    <tr key={room.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{room.number}</td>
                                        <td style={{ padding: '1rem' }}>{room.type}</td>
                                        <td style={{ padding: '1rem' }}>{room.capacity}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                background: room.status === 'AVAILABLE' ? '#dcfce7' : room.status === 'FULL' ? '#fee2e2' : '#fef9c3',
                                                color: room.status === 'AVAILABLE' ? '#166534' : room.status === 'FULL' ? '#b91c1c' : '#854d0e'
                                            }}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{room.price}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RoomsPage;
