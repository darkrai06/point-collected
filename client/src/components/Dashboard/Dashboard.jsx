import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import StatsCard from './StatsCard';
import TaskList from '../Tasks/TaskList';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            const res = await api.get('/stats/summary');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading stats', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Also reload stats when tasks are updated
    const handleTaskUpdated = () => {
        loadStats();
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ 
                display: 'flex', 
                gap: '24px', 
                marginBottom: '32px',
                flexWrap: 'wrap'
            }}>
                <StatsCard title="Total Points" value={stats?.total_points || 0} type="points" />
                <StatsCard title="Current Level" value={stats?.level || 1} type="level" subtitle={`${(stats?.total_points % 100)} / 100 to next level`} />
                <StatsCard title="Completed Tasks" value={stats?.tasks_completed || 0} type="tasks" />
                <StatsCard title="Best Streak" value={`${stats?.best_streak || 0} Days`} type="streak" />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px'
            }}>
                {/* Left Column: Tasks */}
                <div className="glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px' }}>Your Quests</h2>
                    </div>
                    <TaskList onTaskUpdated={handleTaskUpdated} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
