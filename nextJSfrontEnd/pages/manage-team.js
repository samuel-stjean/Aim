import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header';
import '../styles/globals.css';

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [team, setTeam] = useState(null);
  const [user, setUser] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', skills: '' , work_hours: ''});
  const [error, setError] = useState(null);


  // useEffect(() => {
  //   const userData = JSON.parse(sessionStorage.getItem('user'));
  //   if (!userData) return;

  //   setUser(userData);

  //   async function fetchTeam() {
  //     const res = await axios.get('http://127.0.0.1:8000/teams', {
  //       params: { user_id: userData.id }
  //     });
  //     const team = res.data[0];
  //     setTeam(team);

  //     const membersRes = await axios.get(`http://127.0.0.1:8000/teams/${team.id}/members`);
  //     setMembers(membersRes.data);
  //   }

  //   fetchTeam();
  // }, []);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) return;
  
    setUser(userData);
  
    async function fetchTeamAndMembers() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/teams', {
          params: { user_id: userData.id }
        });
    
        const team = res.data[0];
        if (!team) {
          setError("You don't have a team yet.");
          return;
        }
    
        setTeam(team);
    
        const membersRes = await axios.get(`http://127.0.0.1:8000/teams/${team.id}/members`);
        setMembers(membersRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("No members found — setting empty list.");
          setMembers([]); // no members yet, that's fine
        } else {
          console.error("Error fetching team or members:", err);
          setMembers([]);
          setError("Failed to load team or members.");
        }
      }
    }
    
  
    fetchTeamAndMembers();
  }, []);
  
  

  // const handleAddMember = async () => {
  //   if (!team || !newMember.name || !newMember.skills) return;
  //   const payload = {
  //     name: newMember.name,
  //     team_id: team.id,
  //     skills: newMember.skills.split(',').map(skill => skill.trim())
  //   };
  //   const res = await axios.post('http://127.0.0.1:8000/members', payload);
  //   setMembers([...members, ...res.data]);
  //   setNewMember({ name: '', skills: '' });
  // };
  const handleAddMember = async () => {
    if (!team || !newMember.name || !newMember.skills || !newMember.work_hours) return;
  
    const payload = {
      name: newMember.name,
      team_id: team.id,
      skills: newMember.skills.split(',').map(skill => skill.trim()),
      work_hours: parseInt(newMember.work_hours)
    };
  
    const res = await axios.post('http://127.0.0.1:8000/members', payload);
    setMembers([...members, ...res.data]);
  
    // reset the form
    setNewMember({ name: '', skills: '', work_hours: '' });
  };
  

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/members/${id}`);
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="manage-container">
      <Header />
      <h1 className="teams-title">
        Manage {user?.firstName}'s Team
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="team-card">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <h3>{member.name}</h3>
            <p><strong>Skills:</strong> {member.skills.join(', ')}</p>
            <h3>Work Hours: {member.work_hours}</h3>
            <button onClick={() => handleDelete(member.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="add-form">
        <input
          type="text"
          placeholder="Member name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={newMember.skills}
          onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })}
        />
        <input
          type="number"
          placeholder="Work hours (e.g., 40)"
          value={newMember.work_hours}
          onChange={(e) =>
            setNewMember({ ...newMember, work_hours: e.target.value })
          }
        />

        <button onClick={handleAddMember}>Add Member</button>
      </div>

      <style jsx>{`
        .manage-container {
          background: #4079e1;
          min-height: 100vh;
          padding: 20px;
          color: white;
        }
        .teams-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .team-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          color: black;
        }
        .member-card {
          background: #305cb5;
          color: white;
          padding: 10px;
          margin: 10px 0;
          border-radius: 8px;
        }
        .add-form {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .add-form input {
          padding: 10px;
          margin: 10px 0;
          color: black;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .add-form button {
          background: white;
          color: #305cb5;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .add-form button:hover {
          background: #eee;
        }
      `}</style>
    </div>
  );
}
