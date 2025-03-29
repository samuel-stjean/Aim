import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BlankHeader from '../components/blankheader';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.password != formData.confirmPassword){
      setError('Passwords do not match');
      return;
    }

    const user = {
      //id: Math.floor(Math.random() * 1000),  // Generate a random ID or let the DB handle it
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };


    try {
      // Send user to backend
      const response = await axios.post('http://127.0.0.1:8000/createUser', {
        ...user,
        id: Math.floor(Math.random() * 10000), // still needed unless backend is auto-incrementing
      });
  
      if (response.data && response.data.length > 0) {
        const savedUser = response.data[0];
        sessionStorage.setItem('user', JSON.stringify(savedUser)); // Save entire user object
        sessionStorage.clear();
        router.replace('/dashboard');
      } else {
        setError('Something went wrong. Please try again.');
      }
  
    } catch (error) {
      console.error('Error adding developer:', error);
      setError('Error during registration. Try again.');
    }
  };

  return (
    <div className="register-container">
      <BlankHeader />
      <div className="register-box">
        <h2 className="register-title">Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="input-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleChange} 
                required 
                placeholder="First name"
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleChange} 
                required 
                placeholder="Last name"
              />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username} 
                onChange={handleChange} 
                required 
                placeholder="Username"
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="Email"
              />
            </div>
            <div className="input-group password-group">
              <label>Password</label>
              <div className="password-container">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="input-group password-group">
              <label>Confirm Password</label>
              <div className="password-container">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  placeholder="Confirm password"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
