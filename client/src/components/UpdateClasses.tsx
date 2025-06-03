import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UpdateClasses: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        if (!user) {
            alert("Please sign in to update your classes.");
            return;
        }

        const formData = new FormData();
        formData.append("calendarFile", file);
        formData.append("user_id", user.id);

        try {
            // First, upload and parse the calendar file
            let upload_res = await fetch("http://localhost:5001/calendar/upload_cal", {
                method: 'POST',
                body: formData
            });
            
            if (!upload_res.ok) {
                throw new Error("Failed to upload file");
            }

            let schedule = await upload_res.json();
            console.log("Parsed calendar data:", schedule);

            // Update Supabase through the backend endpoint
            let update_res = await fetch('http://localhost:5001/calendar/update_calendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    calendar_data: schedule
                })
            });

            if (!update_res.ok) {
                throw new Error("Failed to update calendar data");
            }

            alert('✅ Classes updated successfully!');
            window.location.reload(); // Refresh to show updated classes
        } catch (error) {
            console.error("Error uploading file:", error);
            if (error instanceof Error) {
                alert(`Error uploading file: ${error.message}`);
            } else {
                alert('Error uploading file. Please try again.');
            }
        }
    };

    return (
        <div className="update-classes">
            <input 
                type="file" 
                onChange={handleFileChange}
                accept=".ics"
                className="file-input"
            />
            <button 
                onClick={handleUpload}
                className="update-button"
                disabled={!user}
            >
                Update Classes
            </button>
            {!user && (
                <p className="error-text">Please sign in to update your classes.</p>
            )}
        </div>
    );
};

export default UpdateClasses; 