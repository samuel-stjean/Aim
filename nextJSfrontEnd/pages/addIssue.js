import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Header from '../components/header';

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
      id: Math.floor(Math.random() * 1000), // Generate a random ID or let the DB handle it
      description,
      urgency_level,
      status: false,
      issue_name,
    }

    try {
      // Post to the backend to add the issue
      await axios.post('http://127.0.0.1:8000/issues', issue)

      // Redirect to issues page after successfully adding the issue
      router.push('/issues')
    } catch (error) {
      console.error('Error adding issue:', error)
    }
  }

  return (
    <>
      <Header /> {/* Add Header for navigation */}
      <div className="container">
        <div className="form-header">
          <h1 className="bold-title">Add New Issue</h1>
          <h2 className="title">Please fill in your issue details below</h2>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="issue_name">Issue Name:</label>
            <input
              type="text"
              id="issue_name"
              value={issue_name}
              onChange={(e) => setIssueName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="urgency_level">Urgency Level:</label>
            <input
              type="number"
              id="urgency_level"
              value={urgency_level}
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="input"
              required
            />
          </div>

          <button type="submit" className="button">Add Issue</button>
        </form>
      </div>
    </>
  )
}
