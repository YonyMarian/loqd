import React from 'react';
import LandingNav from '../components/LandingNav';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'

const Landing: React.FC = () => {
    return (
        <>
            <LandingNav />
            <div className="min-h-screen bg-white">
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <img src={logo} alt="Loqd Logo" className="h-48 w-auto mx-auto mb-8" />
                        <p className="text-xl text-gray-600 mb-8">
                            Study together, study today!
                        </p>
                        <div className="space-x-4">
                            <a
                                href="/signup"
                                className="bg-[#2774AE] text-white px-6 py-3 rounded-lg hover:bg-[#1a5c8b] transition-all duration-200"
                            >
                                Get Started
                            </a>
                            <a
                                href="/signin"
                                className="bg-white text-[#2774AE] px-6 py-3 rounded-lg border border-[#2774AE] hover:bg-[#f8f9fa] transition-all duration-200"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-[#f8f9fa]">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-[#202124]">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 text-[#202124]">Find study buddies</h3>
                                <p className="text-[#5f6368]">
                                    Create and modify unlimited study groups with your classmates
                                </p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 text-[#202124]">Fine-tune your searches</h3>
                                <p className="text-[#5f6368]">
                                    Visually specify how closely you want your schedules to align with others'
                                </p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4 text-[#202124]">Get real-time updates</h3>
                                <p className="text-[#5f6368]">
                                    Real-time interaction via course-specific megathreads
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6 text-[#202124]">Ready to Get Started?</h2>
                        <p className="text-xl text-[#5f6368] mb-8">
                            Join your fellow Bruins and never waste time looking for study buddies again!
                        </p>
                        <a
                            href="/signup"
                            className="bg-[#2774AE] text-white px-8 py-4 rounded-lg hover:bg-[#1a5c8b] transition-all duration-200 inline-block"
                        >
                            Create Your Account
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Landing;
