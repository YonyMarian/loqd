import React from 'react';
import { useState } from 'react';

const UploadCal: React.FC = () => {

    const [file, setFile] = useState<File|null>(null);
    
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // default behavior: 
        event.preventDefault();
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        // FormData = built in js class
        const formData = new FormData();
        formData.append("calendarFile", file);

        try {
            let res = await fetch("http://localhost:5000/calendar/upload_cal", {
                // post = creating new entry at upload_cal
                method: 'POST',
                body: formData
                // bc FormData obj, auto setes Content-Type = multipart/form-data
            });
            if (!res.ok) {
                throw new Error("failed to upload file");
            }

            let calendarData = await res.json();
            console.log("parsed cal data:", calendarData);
        }
        catch (error: unknown) {
            console.error("Error uploading file:" , error);
            if (error instanceof Error)
                alert(`Error uploading file: ${error.message}`);
            else 
                alert("Error uploading file.");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // .target = element that triggered event; in our case, <input>
        // .files = specified by input type = "file"
        // if above exists, will be a FileList object
        if (event.target.files && event.target.files.length>0)
            setFile(event.target.files[0]);
    };

    return (
        <form id="uploadForm" encType="multipart/form-data">
            <input type="file" name="calendarFile" onChange={handleChange}/>
            <button onClick={handleClick} type="button">Upload</button>
        </form>
        // <script src="./upload.js"></script>
    );
};

export default UploadCal;