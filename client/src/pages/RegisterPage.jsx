import { Link } from 'react-router-dom';
import Register from '../components/Auth/Register';

const RegisterPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }} className="text-gradient">PointCollected</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Start your journey today</p>
            </div>
            
            <Register />
            
            <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Log in</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
