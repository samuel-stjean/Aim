import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const isOnDashboard = router.pathname === '/projectDashboard';

  useEffect(() => {
    // Load user from session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || '');
      } catch (error) {
        console.error('Error parsing user from session:', error);
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    router.replace('/');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <header className="header">
      {/* Hide back button on dashboard */}
      {router.pathname !== '/dashboard' && (
      <button onClick={handleBack} className="back-button">
        <ArrowLeft size={24} />
      </button>
)}

      {/* Center title */}
      <span onClick={() => router.replace('/dashboard')} className="header-title" style={{ cursor: 'pointer' }}>
        A.I.M. Bot
      </span>

      {/* Username and dropdown */}
      {username && (
        <div className="user-display" ref={dropdownRef}>
          <span className="username" onClick={() => setShowDropdown(!showDropdown)}>
            Welcome, {username}
          </span>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

