import '../styles/UserBio.css';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
 

interface UserBioProps {
    userid: string
    currBio: string
}
type FormState = {
    bio: string;
};

const UserBio:React.FC<UserBioProps> = ({userid, currBio}) => {

     
    const [form, setForm] = useState<FormState>({
        bio: currBio
    }); // ADD TYPE HERE

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'file' ? (files ? files[0] : null) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userid.length != 0) {
            const setUserBio = async() => {
                const {error} = await supabase
                    .from('profiles')
                    .update({bio: form.bio})
                    .eq('id', userid);
                if (error) {
                    console.log("Error updating bio");
                }
            }
            setUserBio();
        }
        else {
            alert("Error updating bio, userid is empty");
            console.log("Error updating bio, userid is empty");
        }
    };

    return <form onSubmit={handleSubmit} className="bio-form">
        <label>
            Bio
            <input type="textarea" name="bio" value={form.bio} onChange={handleChange}
                placeholder="Write something about yourself..." />
        </label>
        <button type="submit" className="signup-button">Update</button>
    </form>;
}

export default UserBio;
