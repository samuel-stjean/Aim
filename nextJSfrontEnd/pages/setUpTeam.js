import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SetUpTeam() {
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleAddTeamMember = () => {
        router.push('/add');
    };

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                // Fetch team members from the backend
                const response = await axios.get('http://127.0.0.1:8000/team', {
                    params: { user_id: sessionStorage.getItem('userId') }
                });
                                
                setTeamMembers(response.data);
                
            } catch (err) {
                console.error('Error fetching Members:', err);
                setError('Failed to fetch members. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    if (loading) {
        return <div style={styles.container}>Loading team members...</div>;
    }

    if (error) {
        return <div style={styles.container}>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen blue-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Build Your Team</h1>
                <p className="text-gray-600 mb-6">Add members to collaborate effectively.</p>
                <button
                    onClick={handleAddTeamMember}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Add Team Member
                </button>
            </div>

            {/* Team Members List */}
            <div className="mt-8 w-full max-w-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Team Members</h2>
                <div className="bg-white shadow-lg rounded-xl p-4">
                    {teamMembers.length > 0 ? (
                        <ul className="space-y-3">
                            {teamMembers.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                                >
                                    <div>
                                        <p className="text-gray-800 font-medium">{member.name}</p>
                                        <p className="text-gray-500 text-sm">{member.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No current team members.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        fontSize: '18px',
        color: '#333',
    },
};
