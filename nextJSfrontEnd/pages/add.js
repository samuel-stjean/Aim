import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function AddNewDeveloper() {
  const [name, setName] = useState("")
  const [hours, setHours] = useState(0)
  const [skills, setSkills] = useState("")
  const router = useRouter()

  // Handle form submission to add developer
  const handleSubmit = async (e) => {
    e.preventDefault()

    const developer = {
      id: Math.floor(Math.random() * 1000),  // Generate a random ID or let the DB handle it
      name,
      hours_of_work_assigned_this_week: hours,
    }

    try {
      // Post to the backend to add the developer to Supabase
      await axios.post('http://127.0.0.1:8000/developer', developer)

      // After successfully adding the developer, navigate back to the homepage
      router.push('/')  // Redirect to homepage
    } catch (error) {
      console.error('Error adding developer:', error)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Developer</h1>
        <h2 style={styles.subtitle}>Please fill in the developer details below</h2>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="hours">Hours Assigned This Week:</label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="skills">Developer's Skills:</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>Add Developer</button>
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
    color: '#333',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '30px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
}
