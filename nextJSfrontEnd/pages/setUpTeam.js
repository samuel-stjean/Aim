import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SetUpTeam() {
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState([
        
        { id: 1, name: 'John Doe', role: 'Developer' },
        { id: 2, name: 'Jane Smith', role: 'Designer' },
    ]);

    const handleAddTeamMember = () => {
        router.push('/add');
    };

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
                        <p className="text-gray-500">No team members added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
