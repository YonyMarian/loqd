import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signUp } from '../lib/session'
import '../styles/SignUp.css';
import UploadCal from '../components/UploadCal';
import {supabase} from '../lib/supabase';

// List of valid UCLA majors
const validMajors = [
  "African American Studies",
  "American Indian Studies",
  "Anthropology",
  "Architecture and Urban Design",
  "Art",
  "Art History",
  "Arts and Architecture-General",
  "Asian American Studies",
  "Asian Languages and Cultures",
  "Atmospheric and Oceanic Sciences",
  "Bioengineering",
  "Chemical and Biomolecular Engineering",
  "Chemistry and Biochemistry",
  "Chicana and Chicano Studies (Pre-21W)",
  "Chicana/o and Central American Studies",
  "Civil and Environmental Engineering",
  "Classics",
  "Communication",
  "Comparative Literature",
  "Computational and Systems Biology",
  "Computer Science",
  "Design|Media Arts",
  "Disability Studies",
  "Earth, Planetary, and Space Sciences",
  "Ecology and Evolutionary Biology",
  "Economics",
  "Education",
  "Electrical and Computer Engineering",
  "Electrical and Computer Engineering/Computer Science",
  "Engineering and Applied Science",
  "English",
  "Environment and Sustainability",
  "Ethnomusicology",
  "European Languages and Transcultural Studies",
  "Film, Television, and Digital Media",
  "French and Francophone Studies (pre-21S)",
  "Gender Studies",
  "Geography",
  "Germanic Languages (pre-21S)",
  "Global Jazz Studies",
  "Global Studies",
  "History",
  "Humanities-General",
  "Integrative Biology and Physiology",
  "International Development Studies",
  "International and Area Studies",
  "Italian (pre-21S)",
  "Labor Studies",
  "Letters and Science-General",
  "Life Sciences-General",
  "Linguistics",
  "Materials Science and Engineering",
  "Mathematics",
  "Mathematics/Economics",
  "Mathematics/Statistics and Data Science",
  "Mechanical and Aerospace Engineering",
  "Microbiology, Immunology, and Molecular Genetics",
  "Molecular, Cell, and Developmental Biology",
  "Music",
  "Music Industry",
  "Musicology",
  "Near Eastern Languages and Cultures",
  "Neuroscience",
  "Nursing",
  "Philosophy",
  "Physical Sciences-General",
  "Physics and Astronomy",
  "Political Science",
  "Psychology",
  "Public Affairs",
  "Public Health",
  "Religion, Study of",
  "Slavic, East European, and Eurasian Languages and Cultures",
  "Social Sciences-General",
  "Society and Genetics",
  "Sociology",
  "Spanish and Portuguese",
  "Statistics",
  "Statistics and Data Science",
  "Statistics and Data Science/Mathematics",
  "Theater",
  "Theater, Film, and Television-General",
  "World Arts and Cultures/Dance"
];

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [userId, setUserId] = useState<string | null>(null);
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

        alert('✅ Account created successfully, now update calendar data');
      } else {
        console.log(result);
        alert('Something went wrong with account creation');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('❌ Error during sign up, please try again');
    }
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
              <select 
                name="major" 
                value={form.major} 
                onChange={handleChange}
                required
                className="signup-select"
              >
                <option value="">Select a major</option>
                {validMajors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
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
