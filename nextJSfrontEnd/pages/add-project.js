import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Header from '../components/header';

export default function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
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
        id: Date.now(),
        project_name: projectName,
        project_description: projectGoal,
        project_scope: projectScope,             
        project_timeline: projectTimeline,       
        project_manager_id: user.id
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
        <h1 className="add-project-title">New Project Setup</h1>
        <form onSubmit={handleSubmit} className="add-project-form">
          <div className="input-group">
            <label>Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>
          <div className="input-group">
            <label>Project Goal:</label>
            <textarea
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
              placeholder="Describe the high-level objective of your project"
              rows={2}
              required
            />
          </div>
          <div className="input-group">
            <label>Project Scope:</label>
            <textarea
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              placeholder="Define the key features and boundaries of your project along with the tech stack you plan to use"
              rows={2}
            />
          </div>
          <div className="input-group">
            <label>Project Timeline:</label>
            <textarea
              value={projectTimeline}
              onChange={(e) => setProjectTimeline(e.target.value)}
              placeholder="What's the timeline for completion?"
              rows={2}
            />
          </div>
          <button type="submit" className="submit-button">
            Generate Outline
          </button>
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
          max-width: 500px;
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
          text-align: left;
          color: black;
        }
        label {
          font-weight: bold;
          margin-bottom: 6px;
          display: block;
          color: black;
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 5px;
          resize: vertical;
        }
        input:focus, textarea:focus {
          border-color: #305cb5;
          outline: none;
        }
        .submit-button {
          width: 100%;
          padding: 14px;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          background-color: #4079e1;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
        }
        .submit-button:hover {
          background-color: #264a8a;
        }
      `}</style>
    </div>
  );
}
