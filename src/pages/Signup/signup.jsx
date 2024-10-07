import React, { useState } from 'react';
import { auth, db } from '../../firebase'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import './signup.css'; // Import your CSS file here
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '', // New field for phone number
    userType: '', // userType field
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}); // To store validation errors
  const [loading, setLoading] = useState(false); // To handle loading state
  const [success, setSuccess] = useState(false); // To track success

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

    // Phone number validation (Ensure it's not empty and follows a basic pattern)
    const phonePattern = /^[0-9]{10,15}$/; // Adjust this regex based on the country or phone number format you want to allow
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!phonePattern.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = 'Phone number must be between 10 to 15 digits';
      isValid = false;
    }

    // UserType validation
    if (!formData.userType) {
      validationErrors.userType = 'Please select a user type';
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
        // Firebase authentication
        const res = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        // Save additional user data to Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          email: formData.email,
          phoneNumber: formData.phoneNumber, // Store phone number
          userType: formData.userType,
        });

        setSuccess(true); // Set success state
        navigate('/list/home');
        console.log('User signed up successfully:', formData);
      } catch (error) {
        console.error('Error signing up:', error);
        setErrors({ firebase: error.message });
        console.log({ firebase: error.message });
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
          <h2>Sign Up</h2>
        </div>
        {success ? (
          <p className="success-message">Sign up successful! Please log in.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Combined fields for Full Name and Phone Number */}
            <div className="form-row">
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="1234567890"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
              </div>
            </div>

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

            {/* Select field for userType */}
            <div className="form-group">
              <label>User Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="admin">Admin</option>
                <option value="hospital_staff">Hospital Staff</option>
                <option value="warehouse_staff">WareHouse Staff</option>
              </select>
              {errors.userType && <p className="error">{errors.userType}</p>}
            </div>

            {errors.firebase && <p className="error">{errors.firebase}</p>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        )}
        <p className="signin-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
