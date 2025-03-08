import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BlankHeader from '../components/blankheader'; // Import the BlankHeader component

export default function Home() {
  const [developers, setDevelopers] = useState([]);
  const [issues, setIssues] = useState([]);
  const router = useRouter(); // Use the router hook to enable routing

  // Fetch developers on page load
  useEffect(() => {
    async function fetchDevelopers() {
      const res = await axios.get('http://127.0.0.1:8000/developer'); // Adjust the backend URL if necessary
      setDevelopers(res.data);
    }
    fetchDevelopers();
  }, []);

  useEffect(() => {
    async function fetchIssues() {
      const res = await axios.get('http://127.0.0.1:8000/issues'); // Adjust the backend URL if necessary
      setIssues(res.data);
    }
    fetchIssues();
  }, []);

  // Handle redirect to the login page
  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegisterUser = () => {
    router.push('/new-user');
  };

  return (
    <div className="content">
      <BlankHeader /> {/* Using BlankHeader instead of Header */}

      {/* Bold Title (White) */}
      <h1 className="white-bold-title">A.I.M: A.I. Integrated Project Management</h1>

      <h2 className='black-title'>
      A.I.M Bot uses AI to streamline project management, automate Jira ticketing, 
      and optimize task allocation, boosting team productivity.
      </h2>

      <div className='button-container'>
        <button onClick={handleLogin} className='button'>Sign In</button>
        <button onClick={handleRegisterUser} className='button'>Register</button>
      </div>
    </div>
  );
}
