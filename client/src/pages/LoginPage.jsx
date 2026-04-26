import { Link } from 'react-router-dom';
import Login from '../components/Auth/Login';

const LoginPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }} className="text-gradient">PointCollected</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Gamify your daily tasks</p>
            </div>
            
            <Login />
            
            <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;
