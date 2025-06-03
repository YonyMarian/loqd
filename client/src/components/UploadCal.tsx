import React from 'react';
import {supabase} from '../lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


type UploadCalProps = {
    userId: string | null;
}
// PASS USER ID AS PROP INTO COMPONENT!!!

const UploadCal: React.FC<UploadCalProps> = ({userId}) => {
    const [file, setFile] = useState<File|null>(null);
    const [calendarData, setCalendarData] = useState<object | null>(null);
    const navigate = useNavigate();
    
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // default behavior: 
        event.preventDefault();
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }
        if (!userId) {
            alert("No userId")
            return;
            // this should not be happening? see SignUp component
            // uploadCal is conditionally shown only if userId exists
        }
        // FormData = built in js class
        const formData = new FormData();
        formData.append("calendarFile", file);
        formData.append("user_id", userId);
        // need userId to update profiles table in backend
        // ^ see after this fetch


        try {
            let upload_res = await fetch("http://localhost:5000/calendar/upload_cal", {
                // post = creating new entry at upload_cal
                method: 'POST',
                body: formData
                // bc FormData obj, auto setes Content-Type = multipart/form-data
            });
            if (!upload_res.ok) {
                throw new Error("failed to upload file");
            }
            let schedule = await upload_res.json();
            console.log("parsed cal data:", schedule);
            setCalendarData(schedule);

            let update_res = await fetch('http://localhost:5000/calendar/update_calendar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: userId,
                    calendar_data: schedule
                })
            });
            if (!update_res.ok) {
                throw new Error("failed to update profile with schedule");
            }

            navigate('/dashboard');
            // const { data } = supabase.auth.onAuthStateChange((event, session) => 
            // {  console.log(event, session);
            //     //console.log(data);
            //     if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
            //         navigate('/dashboard');
            //         }
            //     else {
            //         console.log("event is NOT initial_session, so don't go dashboard");
            //         navigate('/');

            //     }
            //  })

            
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