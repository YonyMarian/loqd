import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signUp } from '../lib/session'
import '../styles/SignUp.css';
import UploadCal from '../components/UploadCal';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type FormState = {
  username: string;
  password: string;
  email: string;
  //preferences: string[];
  profilePic: File | null;
  //scheduleFile: File | null;

  major: string;
  grad_year: number;
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    email: '',
    //preferences: [],
    profilePic: null,
    //scheduleFile: null,
    major:'',
    grad_year: 2025
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? (files ? files[0] : null) : value,
    }));
  };

  const [userId, setUserId] = useState<string | null>(null);
  
  const uploadProfilePicture = async (file: File, userId: string) => {
    try {
      console.log('Starting profile picture upload for user:', userId);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      console.log('Uploading to path:', filePath);

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      console.log('File uploaded successfully');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      console.log('Generated public URL:', publicUrl);

      // Update the user's profile with the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          email: form.email, 
          full_name: form.username 
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      console.log('Profile updated successfully with avatar URL');

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      throw error;
    }
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  console.log("Starting form submission…");

  try {
    // ---- sign up (now passes the extra fields) ----
    const result = await signUp(
      form.email,
      form.password,
      form.username,
      form.major,
      form.grad_year
    );
    console.log("Signup result:", result);

    if (result?.user) {
      const userId = result.user.id;
      setUserId(userId);

      /* ---------- store extra profile metadata ---------- */
      try {
        await supabase
          .from("profiles")
          .update({
            email: form.email,
            full_name: form.username,
            major: form.major,
            grad_year: form.grad_year,
          })
          .eq("id", userId);
      } catch (dbErr) {
        console.error("Profile metadata update failed:", dbErr);
        // Non-fatal: user account still exists
      }

      /* ---------- optional profile-picture upload ---------- */
      if (form.profilePic) {
        try {
          console.log("Uploading profile picture…");
          await uploadProfilePicture(form.profilePic, userId);
          console.log("Profile picture uploaded");
        } catch (uploadErr) {
          console.error("Profile-picture upload failed:", uploadErr);
          // Let the user proceed even if this fails
        }
      }

      /* ---------- done: show success message ---------- */
      alert("✅ Account created successfully! Please upload your class schedule before continuing.");
      // Remove the immediate redirect - let user upload calendar first
      // The UploadCal component will handle navigation to dashboard after upload
    } else {
      console.log("No user in signup result:", result);
      alert("Something went wrong with account creation");
    }
  } catch (err) {
    console.error("Error during sign-up:", err);
    alert("❌ Error during sign-up, please try again");
  }

  // If you still want to watch auth events, re-enable this later:
  // const { data } = supabase.auth.onAuthStateChange((event, session) => {
  //   console.log(event, session);
  // });
};



  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-branding">
          <h1>Loqd</h1>
          <p>Connect. Collaborate. Study smarter at UCLA.</p>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-form-container">
          <h2>Create Your Account</h2>
          <p className="signup-subtitle">Sign up with your UCLA email and get started</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label>
              Profile Picture
              <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
            </label>

            <label>
              Username
              <input type="text" name="username" value={form.username} onChange={handleChange} required />
            </label>

            <label>
              UCLA Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>

            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>

            <label>
              Major
              <input type="text" name="major" value={form.major} onChange={handleChange} required />
            </label>

            <label>
              Graduation Year
              <input type="number" name="grad_year" min="2000" max="3000" value={form.grad_year} onChange={handleChange} required />
            </label>

            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          {/* PROBLEM WE HAD: we only want to upload calendar data 
              AFTER a successful signup.
            So, only allow users to upload calendar AFTER their signup 
              is successful (ie now exists a userId)
          */} 
          {userId && (
          <div className="calendar-upload-section">
            <label>
              Upload .ics Schedule
              <UploadCal userId={userId} />
            </label> 
          </div>
          )}
            
        </div>
      </div>
    </div>
  );
};

export default SignUp;
