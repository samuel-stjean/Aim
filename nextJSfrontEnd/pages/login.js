import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BlankHeader from '../components/blankheader';
import { Eye, EyeOff } from 'lucide-react'; // Icons for visibility toggle
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };

    try {

      const response = await axios.get('http://127.0.0.1:8000/login', { params: formData });

      sessionStorage.clear();
      
      alert(`Setting Up User ID ${sessionStorage.getItem('user_id')}`)

      if (!response.data) {
        console.error('Invalid login credentials');
        router.push('/login'); // Redirect to login page if credentials are invalid
        return;
      }

      else {
        alert(`Setting Up User ID Before ${response.data[0].id}`);
        sessionStorage.setItem('userId', JSON.stringify(response.data[0].id));
        alert(`Setting Up User ID After ${sessionStorage.getItem('userId')}`)
      }
    
      console.log('Logging in with:', { email, password });
      router.push('/projectDashboard'); // Redirect after login
    } catch (error) {
      console.error('Error during login:', error);
      router.push('/login'); // Redirect to login page on error
    }
  };

  return (
    <div className="login-container">
      <BlankHeader />
      <div className="login-box">
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-link">
          New User? <Link href="/new-user">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

