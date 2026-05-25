import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './AuctionStyles.css';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <Router>
            <header style={{ padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', maxWidth: '1280px', margin: '0 auto' }}>
                     <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '26px' }}>
                        <span style={{ fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            AURUM<span style={{ color: 'var(--accent-blue)', marginLeft: '5px' }}>AUCTION</span>
                        </span>
                    </Link>

                    <nav style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <Link to="/" style={linkStyle}>Головна</Link>
                        <Link to="/lots" style={linkStyle}>Каталог</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" style={{...linkStyle, color: 'var(--accent-purple)'}}>Адмін</Link>
                        )}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {user ? (
                            <>
                                <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{user.username}</span>
                                <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', fontSize: '14px' }}>Вийти</button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-neon">Увійти</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lots" element={<Catalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </Router>
    );
};

const linkStyle = {
    color: 'var(--text-main)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '16px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
};

export default App;