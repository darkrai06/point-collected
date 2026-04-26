import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Flame } from 'lucide-react';

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ 
            height: 'var(--nav-height)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 32px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '32px'
        }}>
            <div>
                <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Dashboard</h1>
            </div>

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '20px', color: '#FBBF24', fontWeight: 600 }}>
                        <Flame size={18} fill={user.current_streak > 0 ? '#FBBF24' : 'transparent'} />
                        <span>{user.current_streak || 0} Day Streak</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '18px' }}>
                        <span className="text-gradient">{user.total_points || 0} pts</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
