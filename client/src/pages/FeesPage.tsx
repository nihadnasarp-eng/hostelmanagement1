import Sidebar from '../components/Sidebar';
import { DollarSign, TrendingUp, AlertCircle, Download, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const FeesPage = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingDues: 0,
        overdueAmount: 0,
        pendingCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [newFee, setNewFee] = useState({
        profileId: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'PENDING'
    });

    const fetchFees = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('Fee')
            .select('*, profile:Profile(*)');

        if (error) {
            console.error(error);
        } else {
            const formatted = data?.map(f => ({
                id: f.id,
                student: `${f.profile?.firstName} ${f.profile?.lastName}`,
                amount: f.amount,
                date: new Date(f.dueDate).toLocaleDateString(),
                status: f.status,
                method: 'N/A'
            })) || [];

            setTransactions(formatted);

            const revenue = data?.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0) || 0;
            const pending = data?.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0) || 0;
            const overdue = data?.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.amount, 0) || 0;
            const pCount = data?.filter(f => f.status === 'PENDING').length || 0;

            setStats({
                totalRevenue: revenue,
                pendingDues: pending,
                overdueAmount: overdue,
                pendingCount: pCount
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFees();
        // Fetch profiles for the modal dropdown
        const fetchProfiles = async () => {
            const { data } = await supabase.from('Profile').select('*');
            setProfiles(data || []);
        };
        fetchProfiles();
    }, []);

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('Fee')
            .insert([newFee]);

        if (error) alert(error.message);
        else {
            setShowModal(false);
            fetchFees();
            setNewFee({ profileId: '', amount: 0, dueDate: new Date().toISOString().split('T')[0], status: 'PENDING' });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Fee Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track payments, dues and revenue</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <DollarSign size={18} /> Record Fee / Payment
                    </button>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <TrendingUp size={24} />
                        </div>
                        <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue (Paid)</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${stats.totalRevenue.toLocaleString()}</h2>
                    </div>

                    <div className="card" style={{ background: 'white', borderLeft: '4px solid #f59e0b' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Dues</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${stats.pendingDues.toLocaleString()}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                            <AlertCircle size={14} /> {stats.pendingCount} unpaid records
                        </div>
                    </div>

                    <div className="card" style={{ background: 'white', borderLeft: '4px solid #ef4444' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Overdue Amount</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>${stats.overdueAmount.toLocaleString()}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
                            <AlertCircle size={14} /> Action required
                        </div>
                    </div>
                </section>

                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Recent Transactions</h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Student</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Due Date</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? transactions.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{t.student}</td>
                                        <td style={{ padding: '1rem' }}>${t.amount}</td>
                                        <td style={{ padding: '1rem' }}>{t.date}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                background: t.status === 'PAID' ? '#dcfce7' : t.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                                                color: t.status === 'PAID' ? '#166534' : t.status === 'PENDING' ? '#854d0e' : '#b91c1c'
                                            }}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Record Fee Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="card" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                            <h3>Record New Fee</h3>
                            <form onSubmit={handleRecordPayment} style={{ marginTop: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Student</label>
                                    <select
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        value={newFee.profileId}
                                        onChange={e => setNewFee({ ...newFee, profileId: e.target.value })}
                                    >
                                        <option value="">Choose a student...</option>
                                        {profiles.map(p => (
                                            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        value={newFee.amount}
                                        onChange={e => setNewFee({ ...newFee, amount: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        value={newFee.dueDate}
                                        onChange={e => setNewFee({ ...newFee, dueDate: e.target.value })}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                                    <select
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        value={newFee.status}
                                        onChange={e => setNewFee({ ...newFee, status: e.target.value })}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PAID">Paid</option>
                                        <option value="OVERDUE">Overdue</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Save Fee Record
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FeesPage;
