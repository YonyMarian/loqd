import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/session';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

type FormState = {
  password: string;
  email: string;
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    password: '',
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn(form.email, form.password);
    if (result) {
      navigate("/dashboard");
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a5c8b] items-center justify-center">
        <div className="max-w-md text-center px-12">
          <img src={logo} alt="Loqd Logo" className="h-32 w-32 mx-auto mb-8 rounded-full bg-white p-4 shadow-lg" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-[#f8f9fa] text-lg">
            Connect with your classmates and find the perfect study partners.
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#202124]">Sign In</h2>
            <p className="mt-2 text-[#5f6368]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#2774AE] hover:text-[#1a5c8b] font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#202124] text-left">
              UCLA Email
            </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]"
                  placeholder="your.email@ucla.edu"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#202124] text-left">
              Password
            </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2774AE] hover:bg-[#1a5c8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE] transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
