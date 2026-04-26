import { useState } from 'react';
import api from '../../services/api';

const AddTask = ({ onTaskAdded }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'personal',
        difficulty: 'easy',
        custom_points: ''
    });

    const { title, description, category, difficulty, custom_points } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            setFormData({ title: '', description: '', category: 'personal', difficulty: 'easy', custom_points: '' });
            setOpen(false);
            onTaskAdded();
        } catch (err) {
            console.error('Error adding task', err);
        }
    };

    if (!open) {
        return (
            <button 
                className="btn-primary" 
                onClick={() => setOpen(true)}
                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-cyan)', border: '1px dashed rgba(0, 240, 255, 0.3)', boxShadow: 'none' }}
            >
                + Add New Quest
            </button>
        );
    }

    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>New Quest</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text" name="title" value={title} onChange={onChange} placeholder="Quest Title" required />
                </div>
                <div className="form-group">
                    <textarea name="description" value={description} onChange={onChange} placeholder="Description (optional)" rows="2"></textarea>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <select name="category" value={category} onChange={onChange}>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                            <option value="health">Health</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <select name="difficulty" value={difficulty} onChange={onChange}>
                            <option value="easy">Easy (5 pts/min)</option>
                            <option value="medium">Medium (10 pts/min)</option>
                            <option value="hard">Hard (20 pts/min)</option>
                            <option value="epic">Epic (50 pts/min)</option>
                            <option value="easy_penalty">Penalty Easy (-5 pts/min)</option>
                            <option value="hard_penalty">Penalty Hard (-10 pts/min)</option>
                            <option value="custom">Custom (pts/min)</option>
                        </select>
                    </div>
                </div>
                {difficulty === 'custom' && (
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <input type="number" name="custom_points" value={custom_points} onChange={onChange} placeholder="Custom Pts/Min" required />
                    </div>
                )}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Quest</button>
                    <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;
