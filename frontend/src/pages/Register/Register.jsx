import React, { useState } from 'react';
import { register } from '../../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { showError, showSuccess } from '../../utils/toast';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    const nameValidation = validateRequired(name, 'Name');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }
    
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
      const response = await register({ name, email, password });
      sessionStorage.setItem('token', response.token);
      showSuccess('Registration successful!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      showError(error.userMessage || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;