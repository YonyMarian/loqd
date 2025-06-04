import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/SettingsPopup.css'; // Optional: create this if you want to style it
import {validMajors} from '../pages/SignUp.tsx'

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
