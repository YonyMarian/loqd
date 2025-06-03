import React, { useState } from 'react';
import LandingNav from '../components/LandingNav';
import '../styles/SuggestionBox.css';

const SuggestionBox: React.FC = () => {
    const [formData, setFormData] = useState({
        type: 'bug',
        title: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitted:', formData);
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
                                id="type"
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
                            <label htmlFor="title" className="form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Brief description of the issue"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
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