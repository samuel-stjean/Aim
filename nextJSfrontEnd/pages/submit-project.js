import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function SubmitProjectPrompt() {
  const router = useRouter();
  const [projectGoal, setProjectGoal] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
  const [projectOutline, setProjectOutline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://127.0.0.1:8000/project_outline', {
        params: { project_goal: projectGoal, project_scope: projectScope, project_timeline: projectTimeline },
      });

      setProjectOutline(response.data.project_outline);
    } catch (err) {
      console.error('Error generating project outline:', err);
      setError('Failed to generate project outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Submit Project Prompt</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Project Goal:
          <input
            type="text"
            value={projectGoal}
            onChange={(e) => setProjectGoal(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Project Scope:
          <input
            type="text"
            value={projectScope}
            onChange={(e) => setProjectScope(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Project Timeline:
          <input
            type="text"
            value={projectTimeline}
            onChange={(e) => setProjectTimeline(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Outline'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {projectOutline && (
        <div style={styles.outputContainer}>
          <h2>Project Outline</h2>
          <p>{projectOutline}</p>
        </div>
      )}

      <button style={styles.backButton} onClick={() => router.push('/')}>
        Back to Home
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #04e42d',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4a4440',
    color: '#04e42d',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  outputContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #04e42d',
    borderRadius: '5px',
    backgroundColor: '#fff',
    color: '#000',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
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
