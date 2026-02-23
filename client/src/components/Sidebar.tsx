import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, ClipboardList, CreditCard, LogOut } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Sidebar = ({ role }: { role: string }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: `/${role.toLowerCase()}` },
        { name: 'Rooms', icon: <Home size={20} />, path: '/rooms' },
        { name: 'Students', icon: <Users size={20} />, path: '/students' },
        { name: 'Fees', icon: <CreditCard size={20} />, path: '/fees' },
        { name: 'Complaints', icon: <ClipboardList size={20} />, path: '/complaints' },
    ];

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            background: 'white',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem',
            position: 'fixed'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0 1rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '12px', color: 'white' }}>
                    <Home size={24} />
                </div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>HostelEase</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            marginBottom: '0.5rem',
                            backgroundColor: location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: location.pathname === item.path ? 600 : 400,
                            transition: 'all 0.2s'
                        }}
                    >
                        {item.icon}
                        {item.name}
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                    }}>
                        {role[0]}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>User Name</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
