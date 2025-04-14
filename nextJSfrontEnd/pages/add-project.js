import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Header from '../components/header';

export default function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [team, setTeam] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sprintDuration, setSprintDuration] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      alert('You must be logged in to create a project.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/projects', {
        id: Date.now(), // Replace if backend handles ID
        project_name: projectName,
        project_description: projectDescription,
        project_manager_id: user.id,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to add project:', error);
      alert('Error creating project.');
    }
  };

  return (
    <div className="add-project-container">
      <Header />
      <div className="form-box">
        <h1 className="add-project-title">Add New Project</h1>
        <form onSubmit={handleSubmit} className="add-project-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Team Name</label>
              <input
                type="text"
                placeholder="Enter team name"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>

            <div className="input-group full-width">
              <label>Project Description</label>
              <textarea
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Sprint Duration (in days)</label>
              <input
                type="number"
                placeholder="Enter sprint duration"
                value={sprintDuration}
                onChange={(e) => setSprintDuration(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Create Project
          </button>
        </form>
      </div>

      <style jsx>{`
        .add-project-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background-color: #4079e1;
          padding: 20px;
        }

        .form-box {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
          text-align: left;
          max-width: 700px;
          width: 100%;
        }

        .add-project-title {
          font-size: 2.2rem;
          color: black;
          margin-bottom: 30px;
          text-align: center;
        }

        .add-project-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          font-size: 1rem;
          font-weight: bold;
          color: black;
          margin-bottom: 6px;
        }

        input,
        textarea {
          padding: 12px;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: border 0.3s ease-in-out;
          color: black;
        }

        input:focus,
        textarea:focus {
          border-color: #305cb5;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-button {
          width: 100%;
          padding: 15px;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          background: #4079e1;
          color: white;
          cursor: pointer;
          transition: 0.3s ease-in-out;
        }

        .submit-button:hover {
          background: #305cb5;
        }
      `}</style>
    </div>
  );
}
