import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/SettingsPopup.css'; // Optional: create this if you want to style it

const validMajors = [
  "Aerospace Engineering",
  "African American Studies",
  "African and Middle Eastern Studies",
  "American Indian Studies",
  "American Literature and Culture",
  "Ancient Near East and Egyptology",
  "Anthropology",
  "Applied Lingustics",
  "Applied Mathematics",
  "Arabic",
  "Architectural Studies",
  "Art",
  "Art History",
  "Asian American Studies",
  "Asian Humanities",
  "Asian Languages and Linguistics",
  "Asian Religions",
  "Asian Studies",
  "Astrophysics",
  "Atmospheric and Oceanic Sciences",
  "Atmospheric and Oceanic Sciences/Mathematics",
  "Biochemistry",
  "Bioengineering",
  "Biology",
  "Biophysics",
  "Business Economics",
  "Central and East European Languages and Cultures",
  "Chemical Engineering",
  "Chemistry",
  "Chemistry/Materials Science",
  "Chicana and Chicano Studies",
  "Chinese",
  "Civil Engineering",
  "Classical Civilization",
  "Climate Science",
  "Cognitive Science",
  "Communication",
  "Comparative Literature",
  "Computational and Systems Biology",
  "Computer Engineering",
  "Computer Science",
  "Computer Science and Engineering",
  "Dance",
  "Data Theory",
  "Design Media Arts",
  "Earth and Environmental Science",
  "Ecology, Behavior and Evolution",
  "Economics",
  "Education and Social Transformation",
  "Electrical Engineering",
  "Engineering Geology",
  "English",
  "Environmental Science",
  "Ethnomusicology",
  "European Languages and Transcultural Studies",
  "European Languages and Transcultural Studies with French and Francophone",
  "European Languages and Transcultural Studies with German",
  "European Languages and Transcultural Studies with Italian",
  "European Languages and Transcultural Studies with Scandinavian",
  "European Studies",
  "Film and Television",
  "Financial Actuarial Mathematics",
  "Gender Studies",
  "General Chemistry",
  "Geography",
  "Geography/Environmental Studies",
  "Geology",
  "Geophysics",
  "Global Jazz Studies",
  "Global Studies",
  "Greek",
  "Greek and Latin",
  "History",
  "Human Biology and Society",
  "Individual Field of Concentration (Arts & Architecture)",
  "Individual Field of Concentration (College)",
  "Individual Field of Concentration (Theater, Film and Television)",
  "International Development Studies",
  "Iranian Studies",
  "Japanese",
  "Jewish Studies",
  "Korean",
  "Labor Studies",
  "Latin",
  "Latin American Studies",
  "Linguistics",
  "Linguistics and Anthropology",
  "Linguistics and Asian Languages and Cultures",
  "Linguistics and Computer Science",
  "Linguistics and English",
  "Linguistics and Philosophy",
  "Linguistics and Psychology",
  "Linguistics and Spanish",
  "Marine Biology",
  "Materials Science and Engineering",
  "Mathematics",
  "Mathematics for Teaching",
  "Mathematics of Computation",
  "Mathematics/Applied Science",
  "Mathematics/Economics",
  "Mechanical Engineering",
  "Microbiology, Immunology and Molecular Genetics",
  "Middle Eastern Studies",
  "Molecular, Cell and Developmental Biology",
  "Music",
  "Music Composition",
  "Music Education",
  "Music History and Industry",
  "Music Industry",
  "Music Performance",
  "Musicology",
  "Neuroscience",
  "Nordic Studies",
  "Nursing",
  "Philosophy",
  "Physics",
  "Physiological Science",
  "Political Science",
  "Portuguese and Brazilian Studies",
  "Psychobiology",
  "Psychology",
  "Public Affairs",
  "Public Health",
  "Russian Language and Literature",
  "Russian Studies",
  "Sociology",
  "Southeast Asian Studies",
  "Spanish",
  "Spanish and Community and Culture",
  "Spanish and Linguistics",
  "Spanish and Portuguese",
  "Statistics and Data Science",
  "Study of Religion",
  "Theater",
  "World Arts and Cultures"
];

interface SettingsPopupProps {
  onClose: () => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, major, grad_year')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setEmail(data.email);
        setFullName(data.full_name || '');
        setMajor(data.major || '');
        setGradYear(data.grad_year || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        major,
        grad_year: gradYear
      })
      .eq('id', user.id);

    if (error) {
      alert('Error updating profile. Please try again.');
    } else {
      alert('Profile updated successfully.');
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">User Settings</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} readOnly />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Major</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              >
              {major && !validMajors.includes(major) && ( <option value={major}>{major}</option> )}
                <option value="">Select a major</option>
                {validMajors.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                min={2000}
                max={3000}
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPopup;
