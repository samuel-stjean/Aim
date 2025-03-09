import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../../styles/globals.css';
import Header from '../../components/header';

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      async function fetchProject() {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/projects?id=eq.${id}`);
          if (res.data.length > 0) {
            setProject(res.data[0]);
          }
        } catch (error) {
          console.error('Error fetching project details:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchProject();
    }
  }, [id]);

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
      `}</style>
    </div>
  );
}