import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../components/header'; // Import Header

export default function AddNewDeveloper() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(0);
  const [skills, setSkills] = useState("");
  const router = useRouter();

  // Handle form submission to add developers
  const handleSubmit = async (e) => {
    e.preventDefault();

    const developer = {
      id: Math.floor(Math.random() * 1000),  // Generate a random ID or let the DB handle its
      name,
      hours_of_work_assigned_this_week: hours,
      skills,
      user_id: sessionStorage.getItem('userId') // Get the user ID from session storages
    };

    try {
      
      alert(`Developer added successfully! ${developer.user_id}`); // Mock alert, replace with API call laters
      // Post to the backend to add the developer to Supabases
      await axios.post('http://127.0.0.1:8000/developer', developer);

      // Redirect to homepage after successful submissions
      router.push('/setUpTeam');
    } catch (error) {
      console.error('Error adding developer:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-header">
          <h1 className="black-title-form">Add New Developer</h1>
          <h2 className="regular-black">Please fill in the developer details below</h2>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              style={{ color: 'white' }} // Set text color to white
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="hours">Hours Assigned This Week:</label>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input"
              style={{ color: 'white' }}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="skills">Developer's Skills:</label>
            <input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input"
              style={{ color: 'white' }}
              required
            />
          </div>

          <button type="submit" className="button-form">Add Developer</button>
        </form>
      </div>
    </>
  );
}
