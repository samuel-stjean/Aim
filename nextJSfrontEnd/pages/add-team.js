import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../styles/globals.css';
import Header from '../components/header';

export default function AddTeam() {
  const [teamName, setTeamName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/teams', {
        team_name: teamName,
      });
      router.push('/teams'); // Redirect after adding team
    } catch (error) {
      console.error('Failed to add team:', error);
      alert('Error creating team.');
    }
  };

  return (
    <div className="add-team-container">
      <Header />
      <div className="form-box">
        <h1 className="add-team-title">Add New Team</h1>
        <form onSubmit={handleSubmit} className="add-team-form">
          <div className="input-group">
            <label>Team Name</label>
            <input
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Create Team</button>
        </form>
      </div>
      <style jsx>{`
        .add-team-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #4079e1;
          padding: 20px;
        }
        .form-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .add-team-title {
          font-size: 2rem;
          color: black;
          margin-bottom: 20px;
        }
        .add-team-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .input-group label {
          font-size: 1rem;
          font-weight: bold;
          color: black;
          margin-bottom: 5px;
        }
        input {
          padding: 12px;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 5px;
          outline: none;
          transition: border 0.3s ease-in-out;
          color: black;
        }
        input:focus {
          border-color: #305cb5;
        }
        .submit-button {
          width: 100%;
          padding: 15px;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          background: #305cb5;
          color: white;
          cursor: pointer;
          transition: 0.3s ease-in-out;
        }
        .submit-button:hover {
          background: #264a8a;
        }
      `}</style>
    </div>
  );
}
