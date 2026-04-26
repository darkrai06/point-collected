import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Circle, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';

const diffColors = {
    easy: 'var(--diff-easy)',
    medium: 'var(--diff-medium)',
    hard: 'var(--diff-hard)',
    epic: 'var(--diff-epic)',
    easy_penalty: 'var(--diff-easy-penalty)',
    hard_penalty: 'var(--diff-hard-penalty)',
    custom: 'var(--diff-custom)'
};

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
    const { refreshUser } = useContext(AuthContext);
    const [completing, setCompleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [minInput, setMinInput] = useState('1');
    const [errorMsg, setErrorMsg] = useState('');

    const handleCompleteClick = () => {
        if (completing) return;
        setMinInput(task.minutes ? task.minutes.toString() : '1');
        setErrorMsg('');
        setShowModal(true);
    };

    const handleConfirmComplete = async () => {
        const minutes = parseInt(minInput);
        if (isNaN(minutes) || minutes <= 0) {
            setErrorMsg("Please enter a valid positive number of minutes.");
            return;
        }

        setShowModal(false);
        setCompleting(true);
        
        try {
            await api.patch(`/tasks/${task._id}/complete`, { minutes });
            await refreshUser(); // Update global points/level
            onTaskUpdated();
            setCompleting(false);
        } catch (err) {
            console.error('Failed to update task', err);
            setCompleting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this quest?')) {
            try {
                await api.delete(`/tasks/${task._id}`);
                onTaskDeleted();
            } catch (err) {
                console.error('Failed to delete', err);
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderLeft: `4px solid ${diffColors[task.difficulty] || diffColors.easy}`,
            borderRadius: '8px',
            marginBottom: '12px',
            transition: 'all 0.3s ease'
        }}>
            <div 
                onClick={handleCompleteClick}
                style={{
                    width: '24px', height: '24px', 
                    borderRadius: '50%',
                    border: `2px solid ${task.is_completed ? 'var(--accent-cyan)' : 'var(--text-secondary)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: completing ? 'default' : 'pointer',
                    color: task.is_completed ? 'var(--accent-cyan)' : 'transparent',
                    transition: 'all 0.2s',
                    background: task.is_completed ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                    marginRight: '16px'
                }}
            >
                {task.is_completed && <CheckCircle size={16} />}
            </div>
            
            <div style={{ flex: 1 }}>
                <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                }}>
                    {task.title}
                </h4>
                {task.description && (
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {task.description}
                    </p>
                )}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px' }}>
                    <span style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        color: diffColors[task.difficulty] || diffColors.easy
                    }}>
                        {task.is_completed 
                            ? `${task.difficulty.toUpperCase()} • ${task.minutes} min (${task.points * task.minutes} pts)`
                            : `${task.difficulty.toUpperCase()} (${task.points} pts/min)`}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                        {task.category}
                    </span>
                </div>
            </div>

            <button 
                onClick={handleDelete}
                style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    marginLeft: '16px'
                }}
            >
                <Trash2 size={18} />
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '350px', padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Quest Complete!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>How many minutes did you spend on "{task.title}"?</p>
                        
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <input 
                                type="number" 
                                value={minInput} 
                                onChange={(e) => setMinInput(e.target.value)} 
                                min="1" 
                                autoFocus
                            />
                        </div>
                        
                        {errorMsg && <p style={{ color: 'var(--diff-hard-penalty)', fontSize: '14px', marginBottom: '16px' }}>{errorMsg}</p>}
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={handleConfirmComplete}>Confirm</button>
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
