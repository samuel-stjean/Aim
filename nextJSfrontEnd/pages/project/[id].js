// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import '../../styles/globals.css';
// import Header from '../../components/header';

// export default function ProjectDetails() {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (!router.isReady) return;
  
//     async function fetchProject() {
//       try {
//         const res = await axios.get(`http://127.0.0.1:8000/projects?id=eq.${id}`);
//         if (res.data.length > 0) {
//           setProject(res.data[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching project details:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
  
//     fetchProject();
//   }, [router.isReady, id]);
  

//   if (loading) return <p>Loading...</p>;
//   if (!project) return <p>Project not found.</p>;

//   return (
//     <div className="project-details-container">
//       <Header />
//       <div className="form-box expanded">
//         <button className="back-button" onClick={() => router.push('/dashboard')}>
//           ← Back to Dashboard
//         </button>
//         <h1 className="project-title">{project.project_name}</h1>
//         <p className="project-description">{project.project_description}</p>
        
//         <button className="outline-button" onClick={() => router.push(`/submit-project?id=${id}`)}>
//           Submit Prompt for This Project
//         </button>
//       </div>
      
//       <style jsx>{`
//         .project-details-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 50vh;
//           background-color: #4079e1;
//           padding: 20px;
//         }
//         .form-box {
//           background: white;
//           padding: 40px;
//           border-radius: 10px;
//           box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//           text-align: center;
//           max-width: 800px;
//           width: 80%;
//         }
//         .back-button {
//           background: none;
//           border: none;
//           color: #305cb5;
//           font-size: 1.2rem;
//           cursor: pointer;
//           margin-bottom: 20px;
//         }
//         .back-button:hover {
//           text-decoration: underline;
//         }
//         .project-title {
//           font-size: 2.5rem;
//           color: black;
//           margin-bottom: 15px;
//         }
//         .project-description {
//           font-size: 1.5rem;
//           color: black;
//           max-width: 90%;
//           margin: 0 auto;
//         }
//         .outline-button {
//           margin-top: 30px;
//           padding: 12px 24px;
//           font-size: 1.2rem;
//           font-weight: bold;
//           border: none;
//           border-radius: 5px;
//           background: #305cb5;
//           color: white;
//           cursor: pointer;
//           transition: 0.3s ease-in-out;
//       }
// .outline-button:hover {
//   background: #264a8a;
// }

//       `}</style>
//     </div>
//   );
// }

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
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchData() {
      try {
        const projectRes = await axios.get(`http://127.0.0.1:8000/projects?id=eq.${id}`);
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
  }, [router.isReady, id]);

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
        {sprints.length > 0 && (
          <div className="sprints-container">
            {sprints.map((sprint) => (
              <div className="sprint-box" key={sprint.id}>
                <h3 className="sprint-name">{sprint.name}</h3>
                <p className="sprint-description">{sprint.description}</p>
              </div>
            ))}
          </div>
        )}

        <button className="outline-button" onClick={() => router.push(`/submit-project?id=${id}`)}>
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
          margin: 0 auto 30px;
        }
        .sprints-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }
        .sprint-box {
          background-color: #f4f6fb;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
          text-align: left;
        }
        .sprint-name {
          font-size: 1.3rem;
          font-weight: bold;
          color: #305cb5;
          margin-bottom: 10px;
        }
        .sprint-description {
          white-space: pre-wrap;
          font-size: 1rem;
          color: #333;
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
      `}</style>
    </div>
  );
}
