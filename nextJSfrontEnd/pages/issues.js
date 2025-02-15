import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function UserIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Fetch issues from the backend where status is false
        const response = await axios.get('http://127.0.0.1:8000/issues?status=false');
        setIssues(response.data);
      } 
      
      catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to fetch issues. Please try again later.');
      } 
      
      finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleGetRecommendation = (issueId) => {
    // Redirect to the /get-recommendation page with the issueId as a query parameter
    router.push(`/get-recommendation?issueId=${issueId}`);
  };

  if (loading) {
    return <div style={styles.container}>Loading issues...</div>;
  }

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Projects In Progress </h1>
      {issues.length === 0 ? (
        <p style={styles.message}>No unresolved issues found.</p>
      ) : (
        <ul style={styles.list}>
          {issues.map((issue) => (
            <li key={issue.id} style={styles.listItem}>
              <h2 style={styles.issueName}>{issue.issue_name}</h2>
              <p><strong>Description:</strong> {issue.description}</p>
              <p><strong>Urgency Level:</strong> {issue.urgency_level}</p>
              <p><strong>Assigned Developer ID:</strong> {issue.developer_id}</p>
              <button
                style={styles.button}
                onClick={() => handleGetRecommendation(issue.id)}
              >
                Get Recommendation
              </button>
            </li>
          ))}
        </ul>
      )}
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
  message: {
    fontSize: '1.2rem',
    color: '#000',
  },
  list: {
    width: '100%',
    maxWidth: '600px',
    listStyleType: 'none',
    padding: 0,
    color: '#000'
  },
  listItem: {
    border: '1px solid #04e42d',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#000',
    color: '#fff'
  },
  issueName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#04e42d'
  },
  button: {
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
