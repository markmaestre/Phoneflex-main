import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg);
      }
    }
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <h2>Login</h2>
      <div className="input-container">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div className="input-container">
        <i className="fas fa-lock"></i>
        <input
          type={showPassword ? 'text' : 'password'} // Toggle password visibility
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)}></i>
      </div>
      <button type="submit">Log in</button>
      {error && <div className="error">{error}</div>}
      <div className="remember-forgot">
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <a href="/forgot-password">Forgot password?</a>
      </div>
      <div className="account-link">
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </form>
  );
};

export default Login;
