import React, { useState } from 'react';
import LandingNav from '../components/LandingNav';
import '../styles/SuggestionBox.css';
import { supabase } from '../lib/supabase';



const SuggestionBox: React.FC = () => {
    const [formData, setFormData] = useState({
        type: 'bug',
        subject: '',
        details: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log('Submitted:', formData);
        const sendSuggestion = async() => {
            const {error} = await supabase
                .from('suggestions')
                .insert({type: formData.type, 
                        subject: formData.subject,
                        details: formData.details});
            if (error) {
                // console.log("Error sending suggestion.", error);
            }
        }
        sendSuggestion();
        
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <LandingNav />
            <div className="suggestion-container">
                <div className="suggestion-form-container">
                    <h1 className="suggestion-title">Have a Suggestion?</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="type" className="form-label">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="feedback">General Feedback</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject" className="form-label">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Brief description of the issue"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="details" className="form-label">
                                Details
                            </label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="form-textarea"
                                placeholder="Please provide details about the bug or your suggestion"
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="submit-button">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SuggestionBox;