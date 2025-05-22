import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/session'
import '../styles/SignUp.css';

type FormState = {
  password: string;
  email: string;
  preferences: string[];
};

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    password: '',
    email: '',
    preferences: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    const navigate = useNavigate();
    e.preventDefault();
    const result = await signIn(form.email, form.password);
    if (result) {
      navigate("/dashboard");
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
          <h2>Sign Back Into Your Account</h2>
          <p className="signup-subtitle">Don't have an account? Click <a href="/signup">here</a>.</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>
              UCLA Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
          </form>
            <button type="submit" className="signup-button">Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
