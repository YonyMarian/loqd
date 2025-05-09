import React from 'react';
import Upload from '../components/Upload';


interface UserCardProps {
    name: string;
    email: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
    return (
        <>
            <div className="rounded-lg shadow-lg bg-white p-6 max-w-sm mx-auto">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <p className="text-gray-700 mb-2">Name: {name} </p>
                <p className="text-gray-700 mb-2">Email: {email} </p>
            </div>
        </>
    )
}

const Account: React.FC = () => {
    return (
        <div className="flex flex-row items-center justify-left min-h-screen bg-gray-300 w-screen h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 w-400px">
                <h1 className="text-4xl font-bold mb-4">Account</h1>
                <em className="text-lg text-gray-600 mb-4">Manage your account settings and preferences.</em>
                <UserCard name="Billy Bob" email="bilbo@gmail.jom"/>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit Account</button>
                <Upload />
            </div>
            <div>
                <div>
                    <p>Other stuff should go here</p>
                </div>
            </div>
        </div>
    );
}

export default Account;