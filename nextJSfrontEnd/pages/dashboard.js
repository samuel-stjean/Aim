import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../styles/globals.css';
import Header from '../components/header';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
  
      async function fetchProjects() {
        try {
          const res = await axios.get('http://127.0.0.1:8000/projects');
          
          // ✅ Check user before filtering
          if (parsedUser) {
            const userProjects = res.data.filter(
              (project) => project.project_manager_id === parsedUser.id
            );
            setProjects(userProjects);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
  
      fetchProjects();
    } else {
      router.replace('/');
    }
  }, []);
  

  const handleProjectClick = (projectId) => {
    router.push(`/project/${projectId}`);
  };

  const handleAddProject = () => {
    router.push('/add-project');
  };

  const handleManageTeams = () => {
    router.push('/manage-team');  
  };
  

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-content-wrapper">
        <div className="dashboard-content">
          <h1 className="black-bold-title">Project Dashboard</h1>

          {user && (
            <div className="user-info">
              <p style={{fontSize: '1.1 rem', color: 'black', textAlign: 'center'}}><strong>Welcome,</strong> {user.firstName} {user.lastName}</p>
              {/* <p style={{fontSize: '1.1 rem', color: 'black', textAlign: 'center'}}><strong>Email:</strong> {user.email}</p> */}
            </div>
          )}

          <div className="projects-scroll-container">
            <div className="projects-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h2 className="project-title">{project.project_name}</h2>
                    <p className="project-description">{project.project_description}</p>
                  </div>
                ))
              ) : (
                <p className = "black-title">You don’t have any projects yet. Click + to add one!</p>
              )}
            </div>
          </div>

          <div className="dashboard-actions">
            <button className="manage-teams-button" onClick={handleManageTeams}>
              Manage Team
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
