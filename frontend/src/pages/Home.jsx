import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '70vh',
            textAlign: 'center' 
        }}>
            
            {/* Головний блок */}
            <div className="glass-panel" style={{ padding: '60px', maxWidth: '800px' }}>
                <h1 style={{ 
                    fontSize: '64px', 
                    marginBottom: '20px', 
                    background: 'linear-gradient(90deg, #ffffff, #3498db)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Твій преміум-аукціон
                </h1>
                
                <p style={{ 
                    fontSize: '20px', 
                    color: 'var(--text-muted)', 
                    marginBottom: '40px',
                    lineHeight: '1.6'
                }}>
                    Найсучасніша платформа для продажу та купівлі ексклюзивних лотів. 
                    Ставки в реальному часі, повна прозорість та дизайн, що надихає.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/lots" className="btn-neon" style={{ padding: '15px 40px', fontSize: '18px' }}>
                        Розпочати торги
                    </Link>
                    <button className="btn-outline" style={{ padding: '15px 40px', fontSize: '18px' }}>
                        Дізнатися більше
                    </button>
                </div>
            </div>

            {/* Додаткові фішки (статистика) */}
            <div style={{ display: 'flex', gap: '30px', marginTop: '60px' }}>
                {[
                    { label: 'Лотів продано', val: '1,200+' },
                    { label: 'Активні ставки', val: '450' },
                    { label: 'Користувачів', val: '8.5k' }
                ].map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '20px 40px', minWidth: '180px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-blue)' }}>{item.val}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;