import Sidebar from '../components/Sidebar';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, Download, Calendar } from 'lucide-react';

const FeesPage = () => {
    const transactions = [
        { id: '1', student: 'Alex Johnson', amount: '$450', date: 'Feb 15, 2026', status: 'PAID', method: 'Credit Card' },
        { id: '2', student: 'Sarah Williams', amount: '$450', date: 'Feb 12, 2026', status: 'PAID', method: 'UPI' },
        { id: '3', student: 'Emily Brown', amount: '$450', date: 'Feb 20, 2026', status: 'PENDING', method: '-' },
        { id: '4', student: 'Michael Scott', amount: '$450', date: 'Feb 01, 2026', status: 'OVERDUE', method: '-' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="ADMIN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1>Fee Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track payments, dues and revenue</p>
                    </div>
                    <button className="btn btn-primary">
                        <DollarSign size={18} /> Record Payment
                    </button>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <TrendingUp size={24} />
                            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>+12% vs last month</span>
                        </div>
                        <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue (Feb)</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>$42,850</h2>
                    </div>

                    <div className="card" style={{ background: 'white', borderLeft: '4px solid #f59e0b' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Dues</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>$3,150</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.85rem' }}>
                            <AlertCircle size={14} /> 12 Students have pending fees
                        </div>
                    </div>

                    <div className="card" style={{ background: 'white', borderLeft: '4px solid #ef4444' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Overdue Amount</p>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>$900</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem' }}>
                            <AlertCircle size={14} /> 2 Overdue accounts
                        </div>
                    </div>
                </section>

                <section className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Recent Transactions</h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'white' }}>
                                <Calendar size={16} /> Filter Date
                            </button>
                            <button className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'white' }}>
                                <Download size={16} /> Download
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Student</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Method</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{t.student}</td>
                                        <td style={{ padding: '1rem' }}>{t.amount}</td>
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
                                        <td style={{ padding: '1rem' }}>{t.method}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                                <Download size={16} />
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

export default FeesPage;
