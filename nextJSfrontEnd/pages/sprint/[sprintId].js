import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/header';

export default function SprintDetails() {
  const router = useRouter();
  const { sprintId } = router.query;
  const [sprint, setSprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchSprint() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/sprints`);
        const match = res.data.find(s => s.id === Number(sprintId));
        if (match) {
          setSprint(match);
        }
      } catch (err) {
        console.error('Error fetching sprint:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSprint();
  }, [router.isReady, sprintId]);

  if (loading) return <p>Loading...</p>;
  if (!sprint) return <p>Sprint not found.</p>;

  return (
    <div className="sprint-page-container">
      <Header />
      <div className="sprint-content">
        <h1 className="sprint-name">{sprint.name}</h1>
        <p className="sprint-description">{sprint.description}</p>
        <button className="prompt-button" disabled>
          Prompt for Sprint Tickets
        </button>
      </div>

      <style jsx>{`
        .sprint-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #4079e1;
          min-height: 100vh;
          padding: 40px;
        }

        .sprint-content {
          background: white;
          padding: 40px;
          border-radius: 10px;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          text-align: left;
        }

        .sprint-name {
          font-size: 2rem;
          font-weight: bold;
          color: #305cb5;
          margin-bottom: 20px;
        }

        .sprint-description {
          white-space: pre-wrap;
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 30px;
        }

        .prompt-button {
          background-color: #305cb5;
          color: white;
          font-size: 1.1rem;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
