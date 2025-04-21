import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/header';

export default function SprintDetails() {
  const router = useRouter();
  const { sprintId } = router.query;
  const [sprint, setSprint] = useState(null);
  const [outline, setOutline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [memberMap, setMemberMap] = useState({});


  useEffect(() => {
    if (!router.isReady) return;

    async function fetchData() {
      try {
        // Fetch all sprints and find the one we're viewing
        const sprintRes = await axios.get(`http://127.0.0.1:8000/sprints`);
        const sprintMatch = sprintRes.data.find(s => s.id === Number(sprintId));
        if (!sprintMatch) return setLoading(false);
        setSprint(sprintMatch);
    
        // Fetch the associated project to get the project manager ID
        const projectRes = await axios.get(`http://127.0.0.1:8000/projects`, {
          params: { id: `eq.${sprintMatch.project_id}` }
        });
        const project = projectRes.data[0];
        if (!project) return setLoading(false);
    
        // Get the team tied to this project manager
        const teamRes = await axios.get(`http://127.0.0.1:8000/teams`, {
          params: { user_id: project.project_manager_id }
        });
        const team = teamRes.data[0];
        if (!team) return setLoading(false);
    
        // Fetch all members from the team
        const membersRes = await axios.get(`http://127.0.0.1:8000/teams/${team.id}/members`);
        const memberMap = {};
        for (const m of membersRes.data) {
          memberMap[m.id] = m.name;
        }

        const map = {};
        for (const m of membersRes.data) {
          map[m.id] = m.name;
        }
        setMemberMap(map);

    
        // Fetch tickets
        const ticketsRes = await axios.get(`http://127.0.0.1:8000/tickets`, {
          params: { sprint_id: sprintId },
        });
    
        const enrichedTickets = ticketsRes.data.map(ticket => ({
          ...ticket,
          assignee_name: memberMap[ticket.assignee ?? -1] || "Unknown"
        }));
    
        setTickets(enrichedTickets);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    

    fetchData();
  }, [router.isReady, sprintId]);

  if (loading) return <p>Loading...</p>;
  if (!sprint) return <p>Sprint not found.</p>;

  const handleClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/generate_sprint_outline`, {
        params: { id: sprintId },
      });
  
      const outlineTickets = response.data;
  
      // Enrich with assignee names
      const enrichedOutline = outlineTickets.map(ticket => ({
        ...ticket,
        assignee_name: ticket.assignee !== undefined && memberMap[ticket.assignee]
          ? memberMap[ticket.assignee]
          : "Unknown"
      }));
  
      const outlineString = JSON.stringify(enrichedOutline, null, 2);
      //alert(`Generated Sprint Outline:\n\n${outlineString}`);
      setOutline(outlineString);
  
    } catch (error) {
      console.error('Error generating sprint outline:', error);
      //alert('Failed to generate sprint outline. Please try again.');
    }
  };
  

  const handleAccept = async () => {
    //alert('Outline Accepted');

    try {      
      
      //alert(outline);
      
      // Send the outline to the backend for acceptance
      const response = axios.post(`http://127.0.0.1:8000/accept_tickets`, {sprint_id: sprintId, outline: outline },);
      //alert('Sprint outline accepted successfully!', response.data);
      router.push('/project/' + sprint.project_id); // Redirect to the project page after acceptance
    } 
    
    catch (error) {
      console.error('Error accepting sprint outline:', error);
      //alert('Failed to accept sprint outline. Please try again.');
    }
  }

  return (
    <div className="sprint-page-container">
      <Header />
      <div className="sprint-content">
        <h1 className="sprint-name">{sprint.name}</h1>
        <p className="sprint-description">{sprint.description}</p>
        <button className="prompt-button" onClick={handleClick}>
          Prompt for Sprint
        </button>
        {Array.isArray(tickets) && tickets.length > 0 && (
          <div className="existing-tickets">
            <h2>Existing Tickets</h2>
            {tickets.map((ticket, index) => (
              <div key={index} className="ticket-box">
                <h3>{ticket.summary}</h3>
                <p>Description: {ticket.description}</p>
                <p>Type: {ticket.issuetype}</p>
                <p>Assigned To: {ticket.assignee_name}</p>
              </div>
            ))}
          </div>
        )}
        {outline && (
          <div className="sprint-outline">
            {JSON.parse(outline).map((ticket, index) => (
              <div key={index} className="ticket-box">
                <h3>{ticket.summary}</h3>
                <p> Description: {ticket.description}</p>
                <p> Ticket Type: {ticket.issuetype}</p>
                <p> Assigned To: {ticket.assignee_name}</p>
              </div>
            ))}
            <div className="outline-actions">
              <button className="accept-button" onClick={handleAccept}>
                Accept Sprints
              </button>
              <button className="decline-button" onClick={handleClick}>
                Reprompt
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sprint-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #4079e1;
          min-height: 100vh;
          padding: 40px;
        }

        .sprint-content {
          background: white;
          padding: 40px;
          border-radius: 10px;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          text-align: left;
        }

        .sprint-name {
          font-size: 2rem;
          font-weight: bold;
          color: #305cb5;
          margin-bottom: 20px;
        }

        .sprint-description {
          white-space: pre-wrap;
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 30px;
        }

        .prompt-button {
          background-color: #305cb5;
          color: white;
          font-size: 1.1rem;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .prompt-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .existing-tickets {
          margin-top: 20px;
        }

        .existing-tickets h2 {
          font-size: 1.5rem;
          color: #305cb5;
          margin-bottom: 10px;
        }

        .ticket-box {
          background-color: #e3f2fd;
          border: 1px solid #90caf9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .ticket-box h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
          color: #1565c0;
        }

        .ticket-box p {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .sprint-outline {
          margin-top: 20px;
        }

        .outline-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .accept-button,
        .decline-button {
          background-color: rgb(2, 154, 40);
          color: white;
          font-size: 1rem;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .decline-button {
          background-color: #d32f2f;
        }

        .accept-button:hover {
          background-color: rgb(30, 138, 61);
        }

        .decline-button:hover {
          background-color: #b71c1c;
        }
      `}</style>
    </div>
  );
}
