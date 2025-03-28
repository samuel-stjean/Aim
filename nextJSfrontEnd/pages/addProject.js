import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/projects', {
        id: Date.now(), // or handle id generation in Supabase directly
        project_name: projectName,
        project_description: projectDescription
      });
      router.push('/dashboard');  // Redirect back home or projects overview after creation
    } catch (error) {
      console.error("Failed to add project:", error);
      alert("Error creating project.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Project</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <textarea
          style={{ ...styles.input, height: '100px' }}
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Create Project</button>
      </form>
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
    color: '#04e42d',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#04e42d',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
