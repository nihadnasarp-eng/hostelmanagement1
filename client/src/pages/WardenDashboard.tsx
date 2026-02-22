import Sidebar from '../components/Sidebar';
import { ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';

const WardenDashboard = () => {
    const tasks = [
        { student: 'John Doe', issue: 'Leaking Tap', room: 'A-102', time: '2h ago', priority: 'High' },
        { student: 'Jane Smith', issue: 'Internet Down', room: 'B-205', time: '5h ago', priority: 'Medium' },
        { student: 'Mike Ross', issue: 'Furniture Issue', room: 'C-301', time: '1d ago', priority: 'Low' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role="WARDEN" />
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Warden Control Panel</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage daily operations and student complaints</p>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Clock size={32} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>14</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Issues</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <CheckCircle size={32} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>128</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Resolved This Month</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Users size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ margin: 0 }}>42</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Registrations</p>
                    </div>
                </section>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Active Complaints Queue</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map((task, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                background: '#fff'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ClipboardList color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{task.issue}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {task.student} • Room {task.room} • {task.time}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        background: task.priority === 'High' ? '#fee2e2' : '#fef9c3',
                                        color: task.priority === 'High' ? '#b91c1c' : '#854d0e',
                                        textTransform: 'uppercase'
                                    }}>
                                        {task.priority}
                                    </span>
                                    <button className="btn" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white' }}>
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WardenDashboard;
