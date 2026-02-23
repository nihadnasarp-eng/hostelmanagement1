import React, { useState } from 'react';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../services/supabaseClient';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // Get role from profile table
            const { data: profile, error: profileError } = await supabase
                .from('Profile')
                .select('role')
                .eq('userId', data.user.id)
                .single();

            if (profileError) {
                console.warn("Profile fetch error:", profileError.message);
                // If profile not found, maybe redirect to a setup page or default
                // But let's try to be helpful
                if (profileError.code === 'PGRST116') {
                    // No profile found - this is common for manual auth users
                    alert("No profile found for this user. Defaulting to Student dashboard.");
                }
            }

            const role = (profile?.role || 'STUDENT').toUpperCase();
            console.log("Logged in user role:", role);

            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'WARDEN') navigate('/warden');
            else navigate('/student');
        }
        setLoading(false);
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '1rem'
        }}>
            <div className="card glass animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                borderRadius: '24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--primary)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'white'
                    }}>
                        <LogIn size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to your HMS account</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Register here</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
