import React, { useState } from 'react';
import { login } from '../../api';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/toast';
import { validateEmail, validatePassword } from '../../utils/validation';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await login({ email, password });
      sessionStorage.setItem('token', response.token);
      showSuccess('Login successful!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      showError(error.userMessage || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don&apos;t have an account? <a href="/register">Register here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;