import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, ClipboardList, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Sidebar = ({ role }: { role: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

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

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header */}
            <div style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '64px',
                background: 'white',
                borderBottom: '1px solid var(--border)',
                padding: '0 1.5rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 40,
            }} className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px', color: 'white', display: 'flex' }}>
                        <Home size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>HostelEase</h2>
                </div>
                <button
                    onClick={toggleSidebar}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 45,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                width: '280px',
                height: '100vh',
                background: 'white',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 50,
                transition: 'transform 0.3s ease',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
            }} className="sidebar-container">
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
                            onClick={() => {
                                navigate(item.path);
                                setIsOpen(false);
                            }}
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
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>User</p>
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

            <style>{`
                @media (min-width: 1025px) {
                    .sidebar-container {
                        transform: translateX(0) !important;
                    }
                    .mobile-header {
                        display: none !important;
                    }
                }
                @media (max-width: 1024px) {
                    .mobile-header {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
