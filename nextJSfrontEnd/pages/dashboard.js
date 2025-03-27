import React, { useEffect, useState } from 'react';
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
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-content-wrapper">
        <div className="dashboard-content">
          <h1 className="black-bold-title">Project Dashboard</h1>
          <div className="projects-scroll-container">
            <div className="projects-grid">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <h2 className="project-title">{project.project_name}</h2>
                  <p className="project-description">{project.project_description}</p>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
}
