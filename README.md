# LOQD
Study buddy matching app for UCLA students

Reachable at https://www.getloqd.in

## Overview
LOQD is a social platform that helps UCLA students connect with classmates based on their course schedules. The platform matches students with similar classes and provides an intuitive interface for managing schedules and finding study partners.

## Features
- Find classmates in your courses
- Interactive class schedule viewer
- Smart matching algorithm
- User profiles with major/year information
- Secure authentication
- Responsive design

## Tech Stack
- Frontend: React.js, TypeScript, CSS Modules
- Backend: Node.js, Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Calendar Parsing: Custom implementation
- Real-time Updates: Supabase Realtime

## Prerequisites

### All Platforms
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- UCLA email address
- Git

### Windows
- Windows 10 or higher
- Git Bash (recommended) or Windows Terminal
- Visual Studio Code (recommended) or any code editor
- [Node.js Windows Installer](https://nodejs.org/en/download/)

### macOS
- macOS 10.15 or higher
- Terminal or iTerm2
- Visual Studio Code (recommended) or any code editor
- [Node.js macOS Installer](https://nodejs.org/en/download/)
- Xcode Command Line Tools (install via `xcode-select --install`)

### Linux
- Ubuntu 20.04+ or similar distribution
- Terminal
- Visual Studio Code (recommended) or any code editor
- [Node.js Linux Installer](https://nodejs.org/en/download/)
- Build essentials (install via `sudo apt-get install build-essential`)

## Setup Instructions

### Windows Setup
1. Install Git Bash or use Windows Terminal
2. Install Node.js from the official website
3. Open Git Bash/Terminal and verify installations:
```bash
node --version
npm --version
git --version
```

### macOS Setup
1. Install Xcode Command Line Tools:
```bash
xcode-select --install
```
2. Install Node.js using Homebrew (recommended):
```bash
brew install node
```
3. Verify installations:
```bash
node --version
npm --version
git --version
```

### Linux Setup
1. Install build essentials:
```bash
sudo apt-get update
sudo apt-get install build-essential
```
2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```
3. Verify installations:
```bash
node --version
npm --version
git --version
```

### Project Setup (All Platforms)

1. Clone the repository:
```bash
git clone https://github.com/YonyMarian/loqd.git
cd loqd
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

**Note:** This project does not include `.env` files or Supabase credentials for security reasons.

If you are setting up LOQD for the first time, you will need to create your own Supabase project and obtain the required environment variables:

1. Go to [https://app.supabase.com/](https://app.supabase.com/) and sign in or create an account.
2. Click "New Project" and follow the prompts to create your project.
3. Once your project is created, navigate to **Project Settings > API**.
4. Copy the following values:
   - **Project URL** (use as `VITE_SUPABASE_URL`)
   - **anon public** key (use as `VITE_SUPABASE_ANON_KEY`)
   - **service_role** key (use as `VITE_SUPABASE_SVC_KEY`, if needed for backend)
5. Add these values to your `.env` files in both the `client` and `server` directories as shown in the setup instructions above.
6. Remember to add `.env` to your `.gitignore`!

This will allow your local instance of LOQD to connect to your own Supabase backend.

#### Windows (Git Bash)
```bash
# In the server directory
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
echo "VITE_SUPABASE_SVC_KEY=your_supabase_service_key" >> .env

# In the client directory
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
```

#### macOS/Linux
```bash
# In the server directory
cat > .env << EOL
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SVC_KEY=your_supabase_service_key
EOL

# In the client directory
cat > .env << EOL
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
```

4. Start the development servers:
```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend development server (from client directory)
npm start
```

5. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Troubleshooting

### Windows
- If you encounter permission issues, run Git Bash as administrator
- If npm install fails, try running `npm cache clean --force`
- For path issues, ensure Node.js is added to your system's PATH

### macOS
- If you get permission errors, use `sudo` for npm global installations
- If port 3000 is in use, you can change it in package.json
- For M1/M2 Macs, ensure you're using the correct Node.js version

### Linux
- If you get EACCES errors, fix npm permissions:
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```
- If port 3000 is in use:
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

## General Project Structure
```
loqd/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
|   |   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
|   |   ├── lib/           # Authentication and configuration
│   │   ├── styles/        # CSS modules
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static files
├── server/                # Backend Node.js application
│   ├── src/
│   │   └── api/           # API routes
│   ├── uploads/            # File uploads for calendar files
|   └── server.ts           # Main backend entry point
└── README.md
```

## Key Features Implementation

### Calendar Integration
- Supports .ics file uploads
- Parses course schedules
- Displays weekly view
- Multi-use for filtering matches

### Matching Algorithm
- Calculates match percentage based on shared classes
- Considers class times and locations
- Updates in real-time

### Direct Messaging
- Real-time chat between users
- Persistent message history
- Connect instantly with new matches

### User Profiles
- Major and graduation year
- Course schedule
- Profile pictures

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments
- Omar, Paul Richard Eggert, Jesus Christ
- CS 35L Teaching Staff
- Viyan Dabke, Lian Elsa Linton, Yony Marian, Shiven Patel, Katelyn Yu
