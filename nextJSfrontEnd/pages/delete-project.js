import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DeleteProject() {
    const router = useRouter();
    const { projectId } = router.query; // Assuming projectId is passed as a query parameter
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete('http://127.0.0.1:8000/delete_project', {
            });

            if (response.ok) {
                alert('Project deleted successfully!');
                router.push('/'); // Redirect to home or another page
            } else {
                alert('Failed to delete the project.');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred while deleting the project.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Delete Project</h1>
            <p>Are you sure you want to delete this project?</p>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
                onClick={() => router.back()}
                style={{
                    marginLeft: '10px',
                    padding: '10px 20px',
                    border: '1px solid black',
                    cursor: 'pointer',
                }}
            >
                Cancel
            </button>
        </div>
    );
}