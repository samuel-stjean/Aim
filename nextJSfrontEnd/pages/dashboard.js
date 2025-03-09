import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../styles/globals.css';
import Header from '../components/header';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    router.push(`/project/${projectId}`);
  };

  const handleAddProject = () => {
    router.push('/add-project');
  };

  const handleManageTeams = () => {
    router.push('/teams');
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="form-box">
        <h1 className="dashboard-title">Project Dashboard</h1>
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card" 
              onClick={() => handleProjectClick(project.id)}
            >
              <h2>{project.project_name}</h2>
            </div>
          ))}
        </div>
        <div className="dashboard-actions">
          <button className="manage-teams-button" onClick={handleManageTeams}>
            Manage Teams
          </button>
          <button className="add-project-button" onClick={handleAddProject}>
            +
          </button>
        </div>
      </div>
      <style jsx>{`
        .dashboard-container {
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
        .dashboard-title {
          font-size: 2rem;
          color: black;
          margin-bottom: 20px;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        .project-card {
          background: #4079e1;
          padding: 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .project-card:hover {
          transform: scale(1.05);
          background: #264a8a;
        }
        .dashboard-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .manage-teams-button, .add-project-button {
          padding: 10px 20px;
          font-size: 1.2rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background: #4079e1;
          color: white;
          transition: background 0.3s;
        }
        .add-project-button {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .manage-teams-button:hover, .add-project-button:hover {
          background: #264a8a;
        }
      `}</style>
    </div>
  );
}
