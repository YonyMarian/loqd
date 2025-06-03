import { google } from 'googleapis';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost:5001/oauth2callback'
);

const scopes = [
    'https://mail.google.com/'
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getAccessToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    
    rl.question('Enter the code from that page here: ', async (code) => {
        try {
            const { tokens } = await oauth2Client.getToken(code);
            console.log('Refresh token:', tokens.refresh_token);
            rl.close();
        } catch (err) {
            console.error('Error getting tokens:', err);
            rl.close();
        }
    });
}

getAccessToken(); 