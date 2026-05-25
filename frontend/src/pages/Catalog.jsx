import React, { useState, useEffect } from 'react';
import Countdown from '../components/Countdown';

const Catalog = () => {
    const [lots, setLots] = useState([]);
    const [activeCat, setActiveCat] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchLots = () => {
        let url = `/api/lots?category=${activeCat}&sort=${sortOrder}`;
        fetch(url).then(res => res.json()).then(data => setLots(data));
    };

    useEffect(() => { fetchLots(); }, [activeCat, sortOrder]);

    const handleBid = async (lot) => {
        if (!user) return alert("Будь ласка, увійдіть у систему!");
        
        let targetTime = String(lot.end_time).includes('T') ? new Date(lot.end_time).getTime() : Number(lot.end_time);
        if (targetTime < Date.now()) return alert("Вибачте, торги за цим лотом вже завершено!");

        const amount = prompt(`Поточна ціна: $${lot.current_price}. Ваша ставка:`);
        if (!amount || parseFloat(amount) <= lot.current_price) return alert("Ставка має бути вищою за поточну!");

        const response = await fetch('/api/bids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lot_id: lot.id, user_id: user.id, amount: parseFloat(amount) })
        });

        if (response.ok) {
            alert("Ставку прийнято!");
            fetchLots();
        } else {
            alert("Помилка: торги вже завершено!");
        }
    };

    const handleDelete = (id) => {
        fetch(`/api/lots/${id}`, { method: 'DELETE' }).then(() => fetchLots());
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '30px', color: '#fff' }}>AURUM AUCTION</h1>
            
            <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['', '1', '2', '3'].map((cat, i) => (
                        <button key={i} onClick={() => setActiveCat(cat)} className={activeCat === cat ? 'btn-neon' : 'btn-outline'}>
                            {cat === '' ? 'Всі' : cat === '1' ? 'Електроніка' : cat === '2' ? 'Авто' : 'Мистецтво'}
                        </button>
                    ))}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Сортувати:</span>
                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? '' : 'asc')} className={sortOrder === 'asc' ? 'btn-neon' : 'btn-outline'} style={{ padding: '8px 16px', height: '40px' }}>Мін. ціна</button>
                    <button onClick={() => setSortOrder(sortOrder === 'desc' ? '' : 'desc')} className={sortOrder === 'desc' ? 'btn-neon' : 'btn-outline'} style={{ padding: '8px 16px', height: '40px' }}>Макс. ціна</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {lots.map(lot => {
                    let targetTime = String(lot.end_time).includes('T') ? new Date(lot.end_time).getTime() : Number(lot.end_time);
                    const isFinished = targetTime < Date.now();
                    
                    return (
                        <div key={lot.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '560px' }}>
                            <img src={lot.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
                            <h3 style={{ margin: '15px 0', color: '#fff' }}>{lot.title}</h3>
                            <p style={{ flexGrow: 1, color: '#94a3b8', fontSize: '14px' }}>{lot.description}</p>
                            
                            <Countdown endTime={lot.end_time} />
                            
                            <span style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#fff' }}>${lot.current_price}</span>
                            
                            {isFinished ? (
                                <button className="btn-outline" style={{ cursor: 'not-allowed', opacity: 0.5 }}>Торги завершено</button>
                            ) : (
                                <button onClick={() => handleBid(lot)} className="btn-neon">Зробити ставку</button>
                            )}
                            
                            {user?.role === 'admin' && (
                                <button onClick={() => handleDelete(lot.id)} className="btn-outline" style={{ marginTop: '10px', color: '#ef4444', borderColor: '#ef4444' }}>Видалити</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Catalog;