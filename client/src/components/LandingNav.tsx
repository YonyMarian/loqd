import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const LandingNav: React.FC = () => {
    return (
        <nav className="bg-[#1a5c8b] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img src={logo} alt="Loqd Logo" className="h-8 w-auto" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/signin"
                            className="text-white hover:text-[#f8f9fa] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-white text-[#1a5c8b] hover:bg-[#f8f9fa] px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </div>
                    </div>
                </div>
            </nav>
    );
};

export default LandingNav;