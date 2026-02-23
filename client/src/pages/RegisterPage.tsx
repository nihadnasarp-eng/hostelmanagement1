import { useState } from 'react';
import { UserPlus, Mail, Lock, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../services/supabaseClient';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // Create user entry in the public Profile table (or User table if using that)
            // Assuming we use the schema provided earlier where User/Profile are separate
            const { error: profileError } = await supabase
                .from('Profile')
                .insert([
                    {
                        userId: data.user.id,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        role: formData.role
                    }
                ]);

            if (profileError) {
                alert("Error creating profile: " + profileError.message);
            } else {
                alert('Registration successful! Please check your email for confirmation.');
                navigate('/login');
            }
        }
        setLoading(false);
    };

    return (
        <div className="register-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            padding: '2rem'
        }}>
            <div className="card glass animate-fade-in" style={{
                width: '100%',
                maxWidth: '500px',
                padding: '2.5rem',
                borderRadius: '24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'var(--secondary)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'white'
                    }}>
                        <UserPlus size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the Hostel Management System</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                }}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                }}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                }}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                }}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
                        <select
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                background: 'white'
                            }}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="WARDEN">Warden</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'var(--secondary)' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : <>Register Now <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button onClick={() => navigate('/login')} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <Home size={18} /> Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
