import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/header';

export default function SprintDetails() {
  const router = useRouter();
  const { sprintId } = router.query;
  const [sprint, setSprint] = useState(null);
  const [outline, setOutline] = useState(null);
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

  const handleClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/generate_sprint_outline`, {
        params: { id: sprintId },
      });
      const outlineString = JSON.stringify(response.data, null, 2);
      alert(`Generated Sprint Outline:\n\n${outlineString}`);
      setOutline(outlineString);
    } catch (error) {
      console.error('Error generating sprint outline:', error);
      alert('Failed to generate sprint outline. Please try again.');
    }
  };

  return (
    <div className="sprint-page-container">
      <Header />
      <div className="sprint-content">
        <h1 className="sprint-name">{sprint.name}</h1>
        <p className="sprint-description">{sprint.description}</p>
        <button className="prompt-button" onClick={handleClick}>
          Prompt for Sprint
        </button>
        {outline && (
          <div className="sprint-outline">
            {JSON.parse(outline).map((ticket, index) => (
              <div key={index} className="ticket-box">
                <h3>{ticket.summary}</h3>
                <p> Description: {ticket.description}</p>
                <p> Ticket Type: {ticket.issuetype}</p>
                <p> Assigned To: {ticket.assignee}</p>
              </div>
            ))}
          </div>
        )}
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
          cursor: pointer;
        }

        .prompt-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .sprint-outline {
          margin-top: 20px;
        }

        .ticket-box {
          background-color: #e3f2fd;
          border: 1px solid #90caf9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .ticket-box h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
          color: #1565c0;
        }

        .ticket-box p {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }
      `}</style>
    </div>
  );
}
