import React from 'react';

const Upload: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Upload Your File</h1>
                <input type="file" className="mb-4" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Upload a calendar file</button>
            </div>
        </>
    )
}

export default Upload;