import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Target, Award, Calendar } from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const location = useLocation();

    return (
        <div className="glass" style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '260px',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px'
        }}>
            <div style={{ marginBottom: '40px' }}>
                <h2 className="text-gradient" style={{ fontSize: '24px', fontWeight: 800 }}>PointCollected</h2>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                        background: location.pathname === '/dashboard' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', borderRadius: '8px',
                        color: location.pathname === '/dashboard' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500
                    }}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </div>
                </Link>
                
                <Link to="/history" style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                        background: location.pathname === '/history' ? 'rgba(139, 92, 246, 0.1)' : 'transparent', borderRadius: '8px',
                        color: location.pathname === '/history' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500
                    }}>
                        <Calendar size={20} />
                        <span>History</span>
                    </div>
                </Link>
                {/* Visual placeholders for future expansion */}
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                    color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                    <Target size={20} />
                    <span>Quests (Coming Soon)</span>
                </div>
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                    color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                    <Award size={20} />
                    <span>Leaderboard</span>
                </div>
            </div>

            {user && (
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>{user.username}</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-purple)' }}>Level {user.level || 1}</div>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'transparent', padding: '8px', color: 'var(--text-secondary)' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
