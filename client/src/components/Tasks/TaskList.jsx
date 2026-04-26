import { useState, useEffect } from 'react';
import api from '../../services/api';
import TaskItem from './TaskItem';
import AddTask from './AddTask';

const TaskList = ({ onTaskUpdated }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tasks', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleTaskChange = () => {
        loadTasks();
        if (onTaskUpdated) onTaskUpdated();
    };

    if (loading) return <div>Loading quests...</div>;

    return (
        <div>
            <AddTask onTaskAdded={handleTaskChange} />
            
            <div style={{ marginTop: '24px' }}>
                {tasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        No active quests. Add one above!
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem 
                        key={task._id} 
                            task={task} 
                            onTaskUpdated={handleTaskChange} 
                            onTaskDeleted={handleTaskChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
