import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'  // Import useRouter hook for routing

export default function Home() {
  const [developers, setDevelopers] = useState([])
  const [issues, setIssues] = useState([])

  const router = useRouter()  // Use the router hook to enable routing

  // Fetch developers on page load
  useEffect(() => {
    async function fetchDevelopers() {
      const res = await axios.get('http://127.0.0.1:8000/developer')  // Adjust the backend URL if necessary
      setDevelopers(res.data)
    }
    fetchDevelopers()
  }, [])

  useEffect(() => {
    async function fetchIssues() {
      const res = await axios.get('http://127.0.0.1:8000/issues')  // Adjust the backend URL if necessary
      setIssues(res.data)
    }
    fetchIssues()
  }, [])

  // Handle redirect to the Add New Developer page
  const handleAdd = () => {
    router.push('/add')  // Redirect to the addNewDeveloper page
  }

  const handleAddIssue = () => {
    router.push('/addIssue')  // Redirect to the addNewDeveloper page
  }

  const handleGetRecommendation = () => {
    router.push('/issues')  // Redirect to the addNewDeveloper page
  }

  const handleAddProject = () => {
    router.push('/addProject');
  }

  const handleViewProjects = () => {
    router.push('/projects');
  }
  


  return (
    <div style={styles.container}>
      {/* Title and subtitle */}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome Back To A.I.M Bot</h1>
        <h2 style={styles.subtitle}>How can we assist you?</h2>
      </div>

      {/* Button Section */}
      <div style={styles.buttonContainer}>
        <button onClick={handleAdd} style={styles.button}>Add New Developer</button>
        <button onClick={handleAddIssue} style={styles.button}>Add New Issue</button>
        <button onClick={handleGetRecommendation} style={styles.button}>Get Recommendations</button>
        <button onClick={handleAddProject} style={styles.button}>Add New Project</button>
        <button onClick={handleViewProjects} style={styles.button}>View Projects</button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#04e42d',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#04e42d',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: '1px solid #04e42d',
    borderRadius: '5px',
    backgroundColor: '#000ff',
    color: '#04e42d',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  developerList: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
  }
}
