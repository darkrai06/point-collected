import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const { username, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        const success = await register({ username, email, password });
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registration failed');
        }
    };

    return (
        <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }} className="text-gradient">Create Account</h2>
            {error && <div style={{ color: '#F87171', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required minLength="6" />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required minLength="6" />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
