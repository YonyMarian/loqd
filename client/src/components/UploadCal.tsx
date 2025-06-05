import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadCalProps {
    userId: string;
    onUploadComplete?: () => void;
}

const UploadCal: React.FC<UploadCalProps> = ({ userId, onUploadComplete }) => {
    const [file, setFile] = useState<File|null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // console.log(`API path should be: ${import.meta.env.VITE_API_URL}`)
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
            // console.log("Parsed calendar data:", schedule);
            
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

            // After successful upload
            if (onUploadComplete) {
                onUploadComplete();
            }
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
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e3eaf6] file:text-[#2774AE] hover:file:bg-[#d0dff7]"
                        disabled={isUploading}
                    />
                </div>
                <button 
                    onClick={handleClick} 
                    type="button"
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                        !file || isUploading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-[#2774AE] hover:bg-[#1a5c8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE]'
                    }`}
                    disabled={!file || isUploading}
                    style={{
                        marginTop: '20px',
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Upload Calendar'}
                </button>
            </form>
        </div>
    );
};

export default UploadCal;