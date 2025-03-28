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
    try {
      const projectData = {
        project_name: projectName,
        project_description: projectDescription || null,
         // Replace with actual email if available
        start_date: startDate || null,
        end_date: endDate || null,
        sprint_duration_weeks: sprintDuration ? parseInt(sprintDuration) : null
      };
      

        await axios.post('http://127.0.0.1:8000/projects', projectData);
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
            <label>Project Description</label>
            <textarea
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
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
          <button type="submit" className="submit-button">Create Project</button>
        </form>
      </div>
      <style jsx>{`
        .add-project-container {
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
        .add-project-title {
          font-size: 2rem;
          color: black;
          margin-bottom: 20px;
        }
        .add-project-form {
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
        input, textarea {
          padding: 12px;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 5px;
          outline: none;
          transition: border 0.3s ease-in-out;
          color: black;
        }
        input:focus, textarea:focus {
          border-color: #305cb5;
        }
        .submit-button {
          width: 100%;
          padding: 15px;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          background: #4079e1;
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
