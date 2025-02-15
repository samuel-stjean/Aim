import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function AddNewIssue() {
  
  const [description, setDescription] = useState("")
  const [urgency_level, setUrgency] = useState(0)
  const [status, setStatus] = useState(false)
  const [issue_name, setIssueName] = useState("")
  const router = useRouter()

  // Handle form submission to add issue
  const handleSubmit = async (e) => {
    e.preventDefault()

    const issue = {
      id: Math.floor(Math.random() * 1000),  // Generate a random ID or let the DB handle it
      description,
      urgency_level,
      status: false,
      issue_name,
    }

    try {
      // Post to the backend to add the developer to Supabase
      await axios.post('http://127.0.0.1:8000/issues', issue)

      // After successfully adding the developer, navigate back to the homepage
      router.push('/issues')  // Redirect to homepage
    } catch (error) {
      console.error('Error adding developer:', error)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Issue</h1>
        <h2 style={styles.subtitle}>Please fill in your issue details below</h2>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="issue_name">Issue Name:</label>
          <input
            type="text"
            id="issue_name"
            value={issue_name}
            onChange={(e) => setIssueName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="urgency_level">Urgency Level:</label>
          <input
            type="number"
            id="urgency_level"
            value={urgency_level}
            onChange={(e) => setUrgency(Number(e.target.value))}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>Add Issue</button>
      </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '30px',
    color: '#000',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    color: '#fff'
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #04e42d',
    backgroundColor: '#000',
    color: '#04e42d'
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4a4440',
    color: '#04e42d',
    transition: 'background-color 0.3s',
  },
}
