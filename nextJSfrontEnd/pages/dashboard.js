import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../styles/globals.css';
import Header from '../components/header';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.replace('/');
    }
  }, []);
  
  useEffect(() => {
    if (!user) return;
  
    async function fetchProjects() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/projects');
        const userProjects = res.data.filter(
          (project) => project.project_manager_id === user.id
        );
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  
    fetchProjects();
  }, [user]);
  

  const handleProjectClick = (projectId) => {
    router.push(`/project/${projectId}`);
  };

  const handleAddProject = () => {
    router.push('/add-project');
  };

  const handleManageTeams = () => {
    router.push('/teams');
  };

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-content-wrapper">
        <div className="dashboard-content">
          <h1 className="black-bold-title">Project Dashboard</h1>

          <div className="dashboard-toolbar">
            <button className="manage-teams-button" onClick={handleManageTeams}>
              Manage Teams
          </button>

          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />

          <button className="add-project-button" onClick={handleAddProject}>
            + Add Project
          </button>
        </div>
          <div className="projects-scroll-container">
          {projects.length === 0 ? (
            <div className="empty-state-message">
              <p className="black-title">
                You don’t have any projects yet. Click Add Project to start one!
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state-message">
              <p className="black-title">No projects match your search.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
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
          )}
          </div>


          
        </div>
      </div>
    </div>
  );
}
