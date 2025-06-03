import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt } from 'react-icons/fa';
import '../styles/UpdateCalendar.css';

type UpdateCalendarProps = {
    userId: string | null;
    onUpdateComplete?: () => void;
}

const UpdateCalendar: React.FC<UpdateCalendarProps> = ({userId, onUpdateComplete}) => {
    const [file, setFile] = useState<File|null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        if (!userId) {
            alert("Please sign in to update your calendar.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("calendarFile", file);
        formData.append("user_id", userId);

        try {
            let upload_res = await fetch("http://localhost:5001/calendar/upload_cal", {
                method: 'POST',
                body: formData
            });
            if (!upload_res.ok) {
                throw new Error("Failed to upload file");
            }
            let schedule = await upload_res.json();

            let update_res = await fetch('http://localhost:5001/calendar/update_calendar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: userId,
                    calendar_data: schedule
                })
            });
            if (!update_res.ok) {
                throw new Error("Failed to update calendar");
            }

            alert('✅ Calendar updated successfully!');
            if (onUpdateComplete) {
                onUpdateComplete();
            }
        }
        catch (error: unknown) {
            console.error("Error uploading file:" , error);
            if (error instanceof Error)
                alert(`Error updating calendar: ${error.message}`);
            else 
                alert("Error updating calendar.");
        }
        finally {
            setIsUploading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0)
            setFile(event.target.files[0]);
    };

    return (
        <div className="update-calendar-container">
            <div className="update-calendar-header">
                <FaCloudUploadAlt size={20} />
                <span>Update Schedule</span>
            </div>
            <form className="update-calendar-form">
                <div className="file-input-wrapper">
                    <input 
                        type="file" 
                        name="calendarFile" 
                        onChange={handleChange}
                        accept=".ics"
                        className="file-input"
                    />
                    <div className="file-input-placeholder">
                        {file ? file.name : 'Choose .ics file'}
                    </div>
                </div>
                <button 
                    onClick={handleClick} 
                    type="button" 
                    className="update-button"
                    disabled={isUploading}
                >
                    {isUploading ? 'Updating...' : 'Update Calendar'}
                </button>
            </form>
        </div>
    );
};

export default UpdateCalendar; 