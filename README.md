# LOQD
Study buddy matching app for UCLA students

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
git clone https://github.com/your-username/loqd.git
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

#### Windows (Git Bash)
```bash
# In the server directory
echo "SUPABASE_URL=your_supabase_url" > .env
echo "SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env

# In the client directory
echo "REACT_APP_SUPABASE_URL=your_supabase_url" > .env
echo "REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
```

#### macOS/Linux
```bash
# In the server directory
cat > .env << EOL
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
EOL

# In the client directory
cat > .env << EOL
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
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
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

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

## Project Structure
```
loqd/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS modules
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── api/         # API routes
│   │   ├── utils/       # Utility functions
│   │   └── middleware/  # Express middleware
│   └── uploads/         # File uploads
└── README.md
```

## Key Features Implementation

### Calendar Integration
- Supports .ics file uploads
- Parses course schedules
- Displays weekly view
- Color-coded classes

### Matching Algorithm
- Calculates match percentage based on shared classes
- Considers class times and locations
- Updates in real-time

### User Profiles
- Major and graduation year
- Course schedule
- Match history
- Connection system

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments
- UCLA Computer Science Department
- CS 35L Teaching Staff
- Project Team Members
