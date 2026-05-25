import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
            window.location.reload();
        } else {
            alert(data.error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', color: '#fff' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>ВХІД У AURUM</h1>
            <div className="glass-panel" style={{ padding: '30px' }}>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="email" placeholder="Email" className="glass-input" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Пароль" className="glass-input" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-neon">Увійти</button>
                </form>
                
                <div style={{ marginTop: '25px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: 'bold' }}>Підказка для доступу:</p>
                    <p style={{ margin: '5px 0' }}><strong>Admin:</strong> admin@aurum.com | admin123</p>
                    <p style={{ margin: '0' }}><strong>User:</strong> user@test.com | user123</p>
                </div>
            </div>
        </div>
    );
};
export default Login;