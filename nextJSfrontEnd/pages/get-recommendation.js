import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function GetRecommendation() {
  const router = useRouter();
  const { issueId } = router.query;
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!issueId) return;

    const fetchRecommendation = async () => {
      try {
        // Fetch recommendation based on the issue ID
        const response = await axios.get(`http://127.0.0.1:8000/recommendation/${issueId}`);
        setRecommendation(response.data); // Update recommendation state
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('Failed to fetch recommendation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [issueId]);

  if (loading) {
    return <div style={styles.container}>Loading recommendation...</div>;
  }

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recommendation</h1>
      {recommendation ? (
        <div style={styles.recommendationBox}>
          <p>{recommendation}</p> {/* Display the plain text recommendation */}
        </div>
      ) : (
        <p>No recommendation available for this issue.</p>
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
  },
  recommendationBox: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
};
