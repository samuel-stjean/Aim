import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'  // Import useRouter hook for routing
import '../styles/globals.css'

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


  return (
    <div style={{ padding: '20px' }}>
      {/* Bold Title (White) */}
      <h1 className="bold-title">Welcome Back To A.I.M Bot</h1>

      {/* Regular Title (Black) */}
      <h2 className="title">How can we assist you?</h2>

      {/* Regular White Text */}
      <p className="regular-white">This is some regular white text, great for contrast against a dark background.</p>

      {/* Regular Black Text */}
      <p className="regular-black">This is regular black text, typically used for standard content.</p>
    </div>)
}
