import React from 'react';
import LandingNav from '../components/LandingNav';

const About: React.FC = () => {
    return (
        <>
            <LandingNav />
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">About Loqd</h1>
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {/* Content will be added later */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
