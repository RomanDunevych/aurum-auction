const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const setupDemoLots = () => {
    const timePlus2H = Date.now() + 2 * 60 * 60 * 1000; 
    const timePlus1H = Date.now() + 1 * 60 * 60 * 1000; 
    const timeMinus1H = Date.now() - 1 * 60 * 60 * 1000;

    
    db.run(`UPDATE Lots SET end_time = ? WHERE id = 1`, [timePlus2H]);
    db.run(`UPDATE Lots SET end_time = ? WHERE id = 2`, [timePlus1H]);
    db.run(`UPDATE Lots SET end_time = ? WHERE id = 3`, [timeMinus1H]);

    db.get(`SELECT COUNT(*) as count FROM Lots`, (err, row) => {
        if (row && row.count === 0) {
            const lots = [
                ['MacBook Pro', 'Потужний ноутбук для роботи', 1200, 1200, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 1, timePlus2H],
                ['Porsche 911', 'Спортивний автомобіль', 50000, 50000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', 2, timePlus1H],
                ['Картина "Зоряна ніч"', 'Класичне мистецтво', 500, 500, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', 3, timeMinus1H]
            ];
            lots.forEach(l => {
                db.run(`INSERT INTO Lots (title, description, start_price, current_price, image_url, category_id, status_id, end_time) VALUES (?,?,?,?,?,?,?,?)`, [...l, 1]);
            });
        }
    });
};
setupDemoLots();

app.get('/api/lots', (req, res) => {
    const { category, sort } = req.query;
    let query = `SELECT Lots.*, Categories.name AS category_name FROM Lots JOIN Categories ON Lots.category_id = Categories.id`;
    let params = [];
    
    if (category && category !== '') { query += ` WHERE Lots.category_id = ?`; params.push(parseInt(category)); }
    if (sort === 'asc') query += ` ORDER BY Lots.current_price ASC`;
    else if (sort === 'desc') query += ` ORDER BY Lots.current_price DESC`;
    else query += ` ORDER BY Lots.id DESC`;
    
    db.all(query, params, (err, rows) => res.json(rows));
});

app.post('/api/lots', (req, res) => {
    const { title, description, start_price, image_url, category_id } = req.body;
    const end_time = Date.now() + 24 * 60 * 60 * 1000; 
    
    db.run(
        `INSERT INTO Lots (title, description, start_price, current_price, image_url, category_id, status_id, end_time) VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [title, description, parseFloat(start_price), parseFloat(start_price), image_url, parseInt(category_id), end_time],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.delete('/api/lots/:id', (req, res) => {
    db.run(`DELETE FROM Lots WHERE id = ?`, req.params.id, () => res.json({ success: true }));
});

app.post('/api/bids', (req, res) => {
    const { lot_id, user_id, amount } = req.body;
    db.get(`SELECT end_time FROM Lots WHERE id = ?`, [lot_id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'Лот не знайдено' });
        
        let targetTime = String(row.end_time).includes('T') ? new Date(row.end_time).getTime() : Number(row.end_time);
        if (targetTime < Date.now()) return res.status(403).json({ error: 'Торги завершено!' });
        
        db.run(`INSERT INTO Bids (lot_id, user_id, amount) VALUES (?, ?, ?)`, [lot_id, user_id, amount], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            db.run(`UPDATE Lots SET current_price = ? WHERE id = ?`, [amount, lot_id], () => res.json({ success: true }));
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM Users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
        if (!user) return res.status(401).json({ error: 'Невірні дані' });
        res.json({ user });
    });
});

app.listen(5001, () => console.log('Server running on port 5001'));