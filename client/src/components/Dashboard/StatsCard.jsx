import { Activity, Trophy, Star, CheckCircle } from 'lucide-react';

const StatsCard = ({ title, value, type, subtitle }) => {
    
    const getIcon = () => {
        switch(type) {
            case 'points': return <Star className="text-gradient" size={24} />;
            case 'level': return <Trophy color="#8B5CF6" size={24} />;
            case 'streak': return <Activity color="#FBBF24" size={24} />;
            case 'tasks': return <CheckCircle color="#4ADE80" size={24} />;
            default: return null;
        }
    };

    return (
        <div className="glass" style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            minWidth: '200px'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: '12px'
            }}>
                {getIcon()}
            </div>
            <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
                {subtitle && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</div>}
            </div>
        </div>
    );
};

export default StatsCard;
