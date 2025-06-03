import React from 'react';
import logo from '../assets/logo.svg';

const LandingNav: React.FC = () => {
    return (
        <header>
            <nav className="bg-yellow-500 shadow-md py-4 px-6">
                <div className="max-w-8xl mx-auto flex justify-between items-center">
                    <div className="flex items-right">
                        <a href="/"><img src={logo} alt="Loqd Logo" className="h-16 w-auto mr-2" /></a>
                    </div>
                    <div className="space-x-4">
                        <a href="/about" className="text-gray-700 hover:text-blue-600">About Loqd</a>
                        <a href="/suggestion-box" className="text-gray-700 hover:text-blue-600">Give Feedback</a>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default LandingNav;