
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../../styles/globals.css';
import Header from '../../components/header';

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { projectId } = router.query;


  useEffect(() => {
    if (!router.isReady) return;

    async function fetchData() {
      try {
        const projectRes = await axios.get(`http://127.0.0.1:8000/projects?id=eq.${projectId}`);
        if (projectRes.data.length > 0) {
          const projectData = projectRes.data[0];
          setProject(projectData);

          // fetch sprints for this project
          const sprintsRes = await axios.get(`http://127.0.0.1:8000/sprints`);
          const filtered = sprintsRes.data.filter(s => s.project_id === projectData.id);
          setSprints(filtered);
        }
      } catch (error) {
        console.error('Error fetching project or sprints:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router.isReady, projectId]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="project-details-container">
      <Header />
      <div className="form-box expanded">
        <button className="back-button" onClick={() => router.push('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1 className="project-title">{project.project_name}</h1>
        <p className="project-description">{project.project_description}</p>

        {/* Sprints Display */}
        {Array.isArray(sprints) && sprints.length > 0 && (
        <div className="sprints-container">
          {sprints.map((sprint) => (
            <button
              className="sprint-button"
              key={sprint.id}
              onClick={() => router.push(`/sprint/${sprint.id}`)}
            >
              {sprint.name}
            </button>
          ))}
        </div>
      )}


        <button className="outline-button" onClick={() => router.push(`/submit-project?id=${projectId}`)}>
          Submit Prompt for This Project
        </button>
      </div>

      <style jsx>{`
        .project-details-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          background-color: #4079e1;
          padding: 20px;
        }
        .form-box {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 800px;
          width: 80%;
        }
        .back-button {
          background: none;
          border: none;
          color: #305cb5;
          font-size: 1.2rem;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .back-button:hover {
          text-decoration: underline;
        }
        .project-title {
          font-size: 2.5rem;
          color: black;
          margin-bottom: 15px;
        }
        .project-description {
          font-size: 1.5rem;
          color: black;
          max-width: 90%;
          margin: 0 auto;
        }
        .outline-button {
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 1.2rem;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          background: #305cb5;
          color: white;
          cursor: pointer;
          transition: 0.3s ease-in-out;
        }
        .outline-button:hover {
          background: #264a8a;
        }
        .sprints-container {
          margin-top: 30px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sprint-button {
          padding: 12px 20px;
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
          background-color: #305cb5;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
          text-align: left;
        }

        .sprint-button:hover {
          background-color: #264a8a;
        }

    `}</style>
    </div>
  );
}
