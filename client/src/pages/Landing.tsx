import React from 'react';
import logo from '../assets/logo.svg';
import LandingNav from '../components/LandingNav';

const Landing: React.FC = () => {
    return (
        <>
            <LandingNav />
            <div className="min-h-screen bg-gray-50">
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <img src={logo} alt="Loqd Logo" className="h-48 w-auto mx-auto mb-8" />
                        <p className="text-xl text-gray-600 mb-8">
                            Study together, study today!
                        </p>
                        <div className="space-x-4">
                            <a
                                href="/signup"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Get Started
                            </a>
                            <a
                                href="/signin"
                                className="bg-white text-red-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <h3 className="text-xl font-semibold mb-4">Find study buddies</h3>
                                <p className="text-gray-600">
                                    Create and modify unlimited study groups with your classmates
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <h3 className="text-xl font-semibold mb-4">Fine-tune your searches</h3>
                                <p className="text-gray-600">
                                    Visually specify how closely you want your schedules to align with others'
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <h3 className="text-xl font-semibold mb-4">Get real-time updates</h3>
                                <p className="text-gray-600">
                                    Real-time interaction via course-specific megathreads
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-4 bg-blue-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join your fellow Bruins and never waste time looking for study buddies again!
                        </p>
                        <a
                            href="/signup"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 inline-block"
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