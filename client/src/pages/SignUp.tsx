import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signUp } from '../lib/session'
import '../styles/SignUp.css';
import UploadCal from '../components/UploadCal';
import {supabase} from '../lib/supabase';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCalendarUploaded, setIsCalendarUploaded] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await signUp(form.email, form.password, form.username,
                                  form.major, form.grad_year);

      if (result && result.user) {
        setUserId(result.user.id);
        
        let avatar_url = null;
        
        // Upload profile picture if one was selected
        if (form.profilePic) {
          const fileExt = form.profilePic.name.split('.').pop();
          const fileName = `${result.user.id}-${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('avatars')
            .upload(filePath, form.profilePic, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error('Error uploading avatar:', uploadError);
          } else {
            // Get the public URL using the newer method
            const { data: urlData } = await supabase.storage
              .from('avatars')
              .createSignedUrl(filePath, 31536000); // URL valid for 1 year

            avatar_url = urlData?.signedUrl;
          }
        }

        // Update profile with all information including avatar_url
        await supabase
          .from('profiles')
          .upsert({ 
            id: result.user.id,
            email: form.email, 
            full_name: form.username, 
            major: form.major, 
            grad_year: form.grad_year,
            avatar_url: avatar_url
          })
          .select();

        setShowUploadModal(true);
      } else {
        console.log(result);
        alert('Something went wrong with account creation');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('❌ Error during sign up, please try again');
    }
  };

  const handleCalendarUploaded = () => {
    setIsCalendarUploaded(true);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a5c8b] items-center justify-center">
        <div className="max-w-md text-center px-12">
          <img src={logo} alt="Loqd Logo" className="h-32 w-32 mx-auto mb-8 rounded-full bg-white p-4 shadow-lg" />
          <h1 className="text-4xl font-bold text-white mb-4">Join Loqd!</h1>
          <p className="text-[#f8f9fa] text-lg">
            Connect. Collaborate. Study smarter at UCLA.
          </p>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#202124]">Create Your Account</h2>
            <p className="mt-2 text-[#5f6368]">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#2774AE] hover:text-[#1a5c8b] font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">Profile Picture</label>
                <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e3eaf6] file:text-[#2774AE] hover:file:bg-[#d0dff7]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">Username</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">UCLA Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]" placeholder="your.email@ucla.edu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">Major</label>
                <input type="text" name="major" value={form.major} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202124] text-left">Graduation Year</label>
                <input type="number" name="grad_year" min="2000" max="3000" value={form.grad_year} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2774AE] focus:border-[#2774AE]" />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2774AE] hover:bg-[#1a5c8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE] transition-colors duration-200">
              Sign Up
            </button>
          </form>

          {/* Upload Calendar Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen w-full">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-[#202124] mb-2">Upload Your Schedule</h3>
                  <p className="text-[#5f6368]">Download your schedule as an .ics file from the "Download calendar data" option in your Study List</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    {/* <label className="block text-sm font-medium text-[#202124] text-left mb-2">
                      Upload .ics Schedule
                    </label> */}
                    <UploadCal userId={userId!} onUploadComplete={handleCalendarUploaded} />
                  </div>
                  
                  {/* <button
                    onClick={() => setShowUploadModal(false)}
                    disabled={!isCalendarUploaded}
                    className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                      isCalendarUploaded 
                        ? 'bg-[#2774AE] hover:bg-[#1a5c8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2774AE]' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isCalendarUploaded ? 'Continue to Dashboard' : 'Please Upload Your Schedule'}
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
