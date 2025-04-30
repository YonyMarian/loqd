import React from 'react';

const Landing: React.FC = () => {
    return (
        <>
            <header>
                <nav className="bg-yellow-500 shadow-md py-4 px-6">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="text-2xl font-bold text-blue-600">LOQD</div>
                        <div className="space-x-4">
                            <a href="/features" className="text-gray-700 hover:text-blue-600">Features</a>
                            <a href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
                            <a href="/about" className="text-gray-700 hover:text-blue-600">About Us</a>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Welcome to LOQD</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Your secure and efficient solution for managing digital assets
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
                                <h3 className="text-xl font-semibold mb-4">Secure Storage</h3>
                                <p className="text-gray-600">
                                    State-of-the-art encryption for your digital assets
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <h3 className="text-xl font-semibold mb-4">Easy Management</h3>
                                <p className="text-gray-600">
                                    Intuitive interface for managing your portfolio
                                </p>
                            </div>
                            <div className="text-center p-6">
                                <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
                                <p className="text-gray-600">
                                    Stay informed with instant notifications
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
                            Join thousands of users who trust LOQD for their digital asset management
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