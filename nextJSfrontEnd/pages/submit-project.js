import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Header from '../components/header';

export default function SubmitProjectPrompt() {
  const router = useRouter();
  const { id: projectId } = router.query;

  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
  const [projectOutline, setProjectOutline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revisePrompt, setRevisePrompt] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;

    axios.get(`http://127.0.0.1:8000/projects?id=eq.${projectId}`)
      .then(res => {
        if (res.data.length > 0) {
          const project = res.data[0];
          setProjectName(project.project_name || '');
          setProjectGoal(project.project_description || '');
        }
      })
      .catch(err => {
        console.error('Failed to load project details:', err);
      });
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRevisePrompt(false);

    try {
      const response = await axios.get('http://127.0.0.1:8000/project_outline', {
        params: {
          project_goal: projectGoal,
          project_scope: projectScope,
          project_timeline: projectTimeline,
        },
      });

      setProjectOutline(response.data.project_outline);
    } catch (err) {
      console.error('Error generating project outline:', err);
      setError('Failed to generate project outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsatisfied = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setRevisePrompt(true);
  };

  return (
    <div style={styles.container}>
      <Header/>
  <div ref={topRef}></div>
  <h1 style={styles.title}>Outline for {projectName || 'Project'}</h1>

  {revisePrompt && (
    <p style={styles.reviseText}>
      Not satisfied? Try refining your goal, scope, or timeline for a better outline.
    </p>
  )}

  <div style={styles.contentRow}>
    {/* Form section */}
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Project Goal:
        <textarea
          value={projectGoal}
          onChange={(e) => setProjectGoal(e.target.value)}
          style={styles.input}
          rows={2}
        />
      </label>
      <label style={styles.label}>
        Project Scope:
        <textarea
          value={projectScope}
          onChange={(e) => setProjectScope(e.target.value)}
          style={styles.input}
          rows={2}
        />
      </label>
      <label style={styles.label}>
        Project Timeline:
        <textarea
          value={projectTimeline}
          onChange={(e) => setProjectTimeline(e.target.value)}
          style={styles.input}
          rows={2}
        />
      </label>
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Outline'}
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </form>

    {/* Outline Preview */}
    <div style={styles.previewBox}>
      {projectOutline ? (
        <ReactMarkdown>{projectOutline}</ReactMarkdown>
      ) : (
        <p style={{ color: '#888', fontStyle: 'italic' }}>
          Your generated project outline will appear here.
        </p>
      )}
    </div>
  </div>

  {/* Buttons below */}
  <div style={styles.buttonRow}>
    {projectOutline && (
      <>
        <button style={styles.acceptButton} onClick={() => router.push(`/project/${projectId}`)}>
          Accept Outline
        </button>
        <button style={styles.unsatisfiedButton} onClick={handleUnsatisfied}>
          Unsatisfied with Outline
        </button>
      </>
    )}
    <button style={styles.backButton} onClick={() => router.push('/dashboard')}>
      Back to Dashboard
    </button>
    {projectId && (
      <button style={styles.backButton} onClick={() => router.push(`/project/${projectId}`)}>
        Back to Project
      </button>
    )}
  </div>
</div>
  );
}

// [Keep styles object as-is]

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#4079e1',
    padding: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'white',
  },
  reviseText: {
    color: 'white',
    fontStyle: 'italic',
    marginBottom: '20px',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '500px',
    background: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    position: 'sticky',      // 👈 makes it sticky
    top: '100px',            // 👈 how far from the top it sticks
    alignSelf: 'flex-start', // 👈 so it aligns to the top of its flex row
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    border: '2px solid #ccc',
    borderRadius: '5px',
    color: 'black',
    backgroundColor: 'white',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#305cb5',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  },
  outputContainer: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: 'black',
    maxWidth: '800px',
    width: '95%',
    textAlign: 'left',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  buttonRow: {
    marginTop: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  backButton: {
    padding: '14px 24px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#305cb5',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
  },
  acceptButton: {
    padding: '14px 24px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
  },
  unsatisfiedButton: {
    padding: '14px 24px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#d9534f',
    color: 'white',
    cursor: 'pointer',
  },
  contentRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    width: '100%',
    maxWidth: '1100px',
    marginTop: '20px',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  
  previewBox: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    minHeight: '300px',
    maxWidth: '600px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    lineHeight: '1.6',
    fontFamily: 'Arial, sans-serif',
    overflowY: 'auto',
  },
  
};
