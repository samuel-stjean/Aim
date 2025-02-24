import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      const res = await axios.get('http://127.0.0.1:8000/projects');
      setProjects(res.data);
    }
    fetchProjects();
  }, []);

  const goBackHome = () => {
    router.push('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Existing Projects</h1>
      <ul style={styles.list}>
        {projects.map(project => (
          <li key={project.id} style={styles.item}>
            <strong>{project.project_name}</strong>: {project.project_description}
          </li>
        ))}
      </ul>
      <button onClick={goBackHome} style={styles.button}>Go Back Home</button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#04e42d'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '600px'
  },
  item: {
    padding: '10px',
    borderBottom: '1px solid #ccc'
  },
  button: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#04e42d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
