import React, { useState } from 'react';
import { auth, db } from '../../firebase'; // Import Firebase auth and Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import './login.css'; // Import your CSS file here
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(false);
      const navigate = useNavigate();
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const validate = () => {
        let validationErrors = {};
        let isValid = true;
    
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
          validationErrors.email = 'Email is required';
          isValid = false;
        } else if (!emailPattern.test(formData.email)) {
          validationErrors.email = 'Invalid email format';
          isValid = false;
        }
    
        // Password validation (At least 8 characters)
        if (!formData.password) {
          validationErrors.password = 'Password is required';
          isValid = false;
        } else if (formData.password.length < 8) {
          validationErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        }
    
        setErrors(validationErrors);
        return isValid;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validate()) {
          setLoading(true); // Set loading state
          try {
            // Firebase sign-in
            await signInWithEmailAndPassword(
              auth,
              formData.email,
              formData.password
            );
    
            setSuccess(true); // Set success state
            navigate('/list/home');
            console.log('User signed in successfully:', formData);
          } catch (error) {
            console.error('Error signing in:', error);
            setErrors({ firebase: error.message });
          } finally {
            setLoading(false); // Reset loading state
          }
        } else {
          console.log('Validation failed!');
        }
      };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <img src="logo.png" alt="Logo" className="signup-logo" />
          <h2>Sign In</h2>
        </div>
        {success ? (
          <p className="success-message">Sign up successful! Please log in.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Combined fields for Full Name and Phone Number */}
            

            {/* Combined fields for Email and Password */}
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="*******"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign In'}
            </button>
          </form>
        )}
        <p className="signin-link">
          Don't have an account? <a href="/login">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
