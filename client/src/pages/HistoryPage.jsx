import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import { Calendar } from 'lucide-react';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/stats/summary');
                setHistory(res.data.history || []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                
                <div className="animate-fade-in">
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Calendar className="text-gradient" size={28} />
                            Points History
                        </h2>

                        {loading ? (
                            <p>Loading your past glories...</p>
                        ) : history.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No history found yet. Start completing quests!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {history.map((day, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ fontWeight: 600 }}>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        <div style={{ 
                                            fontWeight: 700, 
                                            fontSize: '18px',
                                            color: day.points_earned >= 0 ? 'var(--accent-cyan)' : 'var(--diff-hard-penalty)'
                                        }}>
                                            {day.points_earned > 0 ? '+' : ''}{day.points_earned} pts
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
