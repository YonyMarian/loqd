import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signUp } from '../lib/session'
import { Link } from 'react-router-dom';
import '../styles/SignUp.css';
import UploadCal from '../components/UploadCal';
import {supabase} from '../lib/supabase';

type FormState = {
  username: string;
  password: string;
  email: string;
  //preferences: string[];
  profilePic: File | null;
  //scheduleFile: File | null;
};

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    email: '',
    //preferences: [],
    profilePic: null,
    //scheduleFile: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? (files ? files[0] : null) : value,
    }));
  };

  const [userId, setUserId] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await signUp(form.email, form.password, form.username);

      if (result) {
        if (result.user) {
          setUserId(result.user.id);
          await supabase
            .from('profiles')
            .update({ email: form.email, full_name: form.username })
            .eq('id', result.user.id);
        }
        alert('✅ Account created (mock), now update calendar data');
      }
      else {
        console.log(result);
        alert('Something went wrong with account creation (mock)');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('❌ Error during sign up, please try again');
    }
    console.log(form);
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
            <button type="submit" className="signup-button">Sign Up</button>
          </form>

          {/* PROBLEM WE HAD: we only want to upload calendar data 
              AFTER a successful signup.
            So, only allow users to upload calendar AFTER their signup 
              is successful (ie now exists a userId)
          */} 
          {userId && (
          <label>
            Upload .ics Schedule
            <UploadCal userId={userId} />
          </label> )}

          <button>
            <Link to="/dashboard">GO ONTO NEXT PAGE -- DIFFERENT FROM FORM SUBMIT</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
