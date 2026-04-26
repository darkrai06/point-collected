import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        const success = await login({ email, password });
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }} className="text-gradient">Welcome Back</h2>
            {error && <div style={{ color: '#F87171', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
