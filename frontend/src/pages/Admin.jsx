import React from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        const response = await fetch('/api/lots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        if (response.ok) navigate('/lots');
        else alert('Помилка додавання');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <h1>Додати лот</h1>
            <Form onSubmit={onSubmit} render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <Field name="title" component="input" placeholder="Назва" className="glass-input" required />
                    <Field name="description" component="textarea" placeholder="Опис" className="glass-input" required />
                    <Field name="start_price" component="input" type="number" placeholder="Ціна" className="glass-input" required />
                    <Field name="image_url" component="input" placeholder="URL фото" className="glass-input" required />
                    <Field name="category_id" component="select" className="glass-input" required>
                        <option value="">Оберіть категорію</option>
                        <option value="1">Електроніка</option>
                        <option value="2">Авто</option>
                        <option value="3">Мистецтво</option>
                    </Field>
                    <button type="submit" className="btn-neon">Додати</button>
                </form>
            )} />
        </div>
    );
};
export default Admin;