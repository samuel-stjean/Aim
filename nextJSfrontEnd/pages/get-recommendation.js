import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function GetRecommendation() {
  const router = useRouter();
  const { issueId } = router.query;
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!issueId) return;

    const fetchRecommendation = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/recommendation/${issueId}`);
        setRecommendations(response.data || []);
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [issueId]);

  if (loading) {
    return <div style={styles.container}>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recommendations</h1>
      {recommendations.length > 0 ? (
        <div style={styles.recommendationList}>
          {recommendations.map((ticket, index) => (
            <div key={index} style={styles.ticketBox}>
              <h2>{ticket.summary}</h2>
              <p><strong>Project:</strong> {ticket.project?.key || 'N/A'}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Issue Type:</strong> {ticket.issuetype?.name || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommendations available for this issue.</p>
      )}
      <button style={styles.button} onClick={() => router.push('/issues')}>
        Back to Issues
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#04e42d',
  },
  recommendationList: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '90vw',
  },
  ticketBox: {
    padding: '20px',
    border: '1px solid #04e42d',
    borderRadius: '10px',
    backgroundColor: '#fff',
    color: '#000',
    minWidth: '250px',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4a4440',
    color: '#04e42d',
    transition: 'background-color 0.3s',
  },
};