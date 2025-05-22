import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signUp } from '../lib/session'
import '../styles/SignUp.css';
import UploadCal from '../components/UploadCal';

type FormState = {
  username: string;
  password: string;
  email: string;
  preferences: string[];
  profilePic: File | null;
  scheduleFile: File | null;
};

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    email: '',
    preferences: [],
    profilePic: null,
    scheduleFile: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? (files ? files[0] : null) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signUp(form.email, form.password, form.username);
    if (result) {
      alert('✅ Account created (mock)');
    }
    else {
      alert('Something went wrong with account creation (mock)');
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
          </form>
          <label>
            Upload .ics Schedule
            <UploadCal />
          </label>

            <button type="submit" className="signup-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
