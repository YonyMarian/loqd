import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UploadCalProps = {
    userId: string | null;
}

const UploadCal: React.FC<UploadCalProps> = ({userId}) => {
    console.log(`API path should be: ${import.meta.env.VITE_API_URL}`)
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
            alert("Please sign in to upload your schedule.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("calendarFile", file);
        formData.append("user_id", userId);
        
        try {
            // Upload and parse calendar file
            let upload_res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/upload_cal`, {
                method: 'POST',
                body: formData
            });
            
            if (!upload_res.ok) {
                // Try to parse error message if available
                let errorMsg = 'Upload failed';
                try {
                    const errJson = await upload_res.json();
                    errorMsg = errJson.error || errorMsg;
                } catch {}
                throw new Error(errorMsg);
            }
            
            let schedule = await upload_res.json();
            console.log("Parsed calendar data:", schedule);
            
            // Update user's profile with calendar data
            let update_res = await fetch(`${import.meta.env.VITE_API_URL}/api/calendar/update_calendar`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: userId,
                    calendar_data: schedule
                })
            });

            if (!update_res.ok) {
                throw new Error(`Failed to update profile: ${update_res.statusText}`);
            }

            navigate('/dashboard');
        } catch (error) {
            console.error("Error uploading file:", error);
            if (error instanceof Error) {
                alert(`Error uploading file: ${error.message}`);
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            if (selectedFile.name.endsWith('.ics')) {
                setFile(selectedFile);
            } else {
                alert('Please select a valid .ics file');
                event.target.value = '';
            }
        }
    };

    return (
        <div className="upload-calendar">
            <form id="uploadForm" encType="multipart/form-data">
                <div className="file-input-container">
                    <input 
                        type="file" 
                        name="calendarFile" 
                        onChange={handleChange} 
                        accept=".ics"
                        className="file-input"
                        disabled={isUploading}
                    />
                </div>
                <button 
                    onClick={handleClick} 
                    type="button"
                    className="upload-button"
                    disabled={!file || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload Schedule'}
                </button>
            </form>
        </div>
    );
};

export default UploadCal;