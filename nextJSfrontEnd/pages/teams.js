import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../styles/globals.css';
import Header from '../components/header';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await axios.get('http://127.0.0.1:8000/teams');
        setTeams(res.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    }
    fetchTeams();
  }, []);

  const handleAddTeam = () => {
    router.push('/add-team');
  };

  return (
    <div className="teams-container">
      <Header />
      <h1 className="teams-title">Teams</h1>
      <div className="teams-list">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h2>{team.team_name}</h2>
            <div className="team-members">
              <TeamMembers teamId={team.id} />
            </div>
          </div>
        ))}
      </div>
      <button className="add-team-button" onClick={handleAddTeam}>Add Team</button>
      <style jsx>{`
        .teams-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #4079e1;
          padding: 20px;
        }
        .teams-title {
          font-size: 2.5rem;
          color: white;
          margin-bottom: 20px;
        }
        .teams-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 80%;
        }
        .team-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .team-members {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .member-card {
          background: #305cb5;
          color: white;
          padding: 10px;
          border-radius: 5px;
        }
        .add-team-button {
          margin-top: 20px;
          padding: 12px 24px;
          font-size: 1.2rem;
          border: none;
          border-radius: 5px;
          background: white;
          color: #305cb5;
          cursor: pointer;
          transition: background 0.3s;
        }
        .add-team-button:hover {
          background: #dddddd;
        }
      `}</style>
    </div>
  );
}

function TeamMembers({ teamId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/teams/${teamId}/developers`);
        setMembers(res.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    }
    fetchMembers();
  }, [teamId]);

  return (
    <div>
      {members.length > 0 ? (
        members.map((member) => (
          <div key={member.id} className="member-card">{member.name}</div>
        ))
      ) : (
        <p>No team members found.</p>
      )}
    </div>
  );
}
