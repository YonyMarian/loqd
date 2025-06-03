import express, { Request, Response } from 'express';
import supabase from '../../../supabase';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Must match redirect URI from refresh token generation
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });
  
  async function getAccessToken(): Promise<string> {
    try {
      const accessTokenResponse = await oauth2Client.getAccessToken();
      if (!accessTokenResponse.token) {
        throw new Error('No access token returned');
      }
      return accessTokenResponse.token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
  
// Create a new chat
router.post('/', async (req: Request, res: Response) => {
    const { name, userIds } = req.body; // userIds: array of user IDs to add (including creator)
    const creatorId = req.headers['x-user-id'] as string; // Assume user ID is passed in header
    
    console.log('Creating chat with:', { name, userIds, creatorId });
    
    if (!creatorId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        console.error('Missing required fields:', { creatorId, userIds });
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // 1. Create chat
        console.log('Creating chat in database...');
        const { data: chat, error: chatError } = await supabase
            .from('chats')
            .insert([{ id: uuidv4(), name, created_by: creatorId }])
            .select()
            .single();
            
        if (chatError) {
            console.error('Error creating chat:', chatError);
            throw chatError;
        }
        console.log('Chat created:', chat);

        // 2. Add members (status: 'accepted' for creator, 'invited' for others)
        console.log('Adding members to chat...');
        const members = userIds.map((uid: string) => ({
            id: uuidv4(),
            chat_id: chat.id,
            user_id: uid,
            invite_status: uid === creatorId ? 'accepted' : 'invited',
        }));
        
        const { error: membersError } = await supabase.from('chat_members').insert(members);
        if (membersError) {
            console.error('Error adding members:', membersError);
            throw membersError;
        }
        console.log('Members added successfully');

        res.status(201).json({ chat });
    } catch (err: any) {
        console.error('Failed to create chat:', err);
        res.status(500).json({ error: err.message || 'Failed to create chat' });
    }
});

// Invite a user to a chat
router.post('/:chatId/invite', async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { receiverId, receiverEmail } = req.body;
    const senderId = req.headers['x-user-id'] as string;
    if (!chatId || !receiverId || !senderId || !receiverEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // 1. Add to chat_members as 'invited'
        const { error: memberError } = await supabase.from('chat_members').insert({
            id: uuidv4(),
            chat_id: chatId,
            user_id: receiverId,
            invite_status: 'invited',
        });
        if (memberError) throw memberError;

        // 2. Create invitation row
        const token = uuidv4();
        const { error: inviteError } = await supabase.from('invitations').insert({
            id: uuidv4(),
            chat_id: chatId,
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'pending',
            created_at: new Date().toISOString(),
            token,
        });
        if (inviteError) throw inviteError;

        // 3. Send email to receiver with invite link (containing token)
        console.log('Setting up email transporter...');
        
        const accessToken = await getAccessToken();
        console.log('Access token obtained successfully');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'getloqd@gmail.com',
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // Verify the connection configuration
        console.log('Verifying SMTP connection...');
        try {
            await transporter.verify();
            console.log('✅ SMTP connection verified successfully');
        } catch (verifyError: any) {
            console.error('❌ SMTP connection verification failed:', {
                code: verifyError.code,
                command: verifyError.command,
                response: verifyError.response,
                responseCode: verifyError.responseCode,
                stack: verifyError.stack
            });
            throw verifyError;
        }

        console.log('Email transporter set up, creating mail options...');
        const inviteLink = `https://loqd.app/invitations/accept?token=${token}`;
        const mailOptions = {
            from: 'getloqd@gmail.com',
            to: receiverEmail,
            subject: 'You have been invited to join a chat on Loqd',
            html: `<p>You have been invited to join a chat. <a href="${inviteLink}">Click here to accept or decline the invitation</a>.</p>`,
        };
        console.log('📧 Attempting to send email to:', receiverEmail);
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully!');
            console.log('📨 Message ID:', info.messageId);
            console.log('📨 Preview URL:', nodemailer.getTestMessageUrl(info));
        } catch (emailError: any) {
            console.error('❌ Error sending email:', {
                error: emailError.message,
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode,
                stack: emailError.stack
            });
            throw emailError;
        }

        res.status(201).json({ message: 'Invitation sent', token });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to invite user' });
    }
});

// Accept or decline an invitation (from email link)
router.post('/invitations/:token', async (req: Request, res: Response) => {
    const { token } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const userId = req.headers['x-user-id'] as string;
    if (!token || !action || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // 1. Find invitation
        const { data: invitation, error: inviteError } = await supabase
            .from('invitations')
            .select('*')
            .eq('token', token)
            .single();
        if (inviteError || !invitation) throw inviteError || new Error('Invitation not found');
        if (invitation.receiver_id !== userId) {
            return res.status(403).json({ error: 'Not authorized for this invitation' });
        }
        // 2. Update invitation status
        const newStatus = action === 'accept' ? 'accepted' : 'declined';
        await supabase
            .from('invitations')
            .update({ status: newStatus })
            .eq('id', invitation.id);
        // 3. Update chat_members status if accepted
        if (action === 'accept') {
            await supabase
                .from('chat_members')
                .update({ invite_status: 'accepted' })
                .eq('chat_id', invitation.chat_id)
                .eq('user_id', userId);
        } else if (action === 'decline') {
            await supabase
                .from('chat_members')
                .update({ invite_status: 'declined' })
                .eq('chat_id', invitation.chat_id)
                .eq('user_id', userId);
        }
        res.json({ message: `Invitation ${newStatus}` });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to process invitation' });
    }
});

// Accept invitation via GET (auto-accept on click)
router.get('/invitations/accept', async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid token' });
    }
    try {
        // 1. Find invitation
        const { data: invitation, error: inviteError } = await supabase
            .from('invitations')
            .select('*')
            .eq('token', token)
            .single();
        if (inviteError || !invitation) throw inviteError || new Error('Invitation not found');
        // 2. Update invitation status to accepted
        await supabase
            .from('invitations')
            .update({ status: 'accepted' })
            .eq('id', invitation.id);
        // 3. Update chat_members status to accepted
        await supabase
            .from('chat_members')
            .update({ invite_status: 'accepted' })
            .eq('chat_id', invitation.chat_id)
            .eq('user_id', invitation.receiver_id);
        // 4. Redirect to frontend (optional)
        return res.redirect(`https://loqd.app/invitations/accepted?chatId=${invitation.chat_id}`);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Failed to accept invitation' });
    }
});

// List chats for the current user
router.get('/', async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }
    try {
        // 1. Get chat memberships for user
        const { data: memberships, error: memberError } = await supabase
            .from('chat_members')
            .select('chat_id, invite_status')
            .eq('user_id', userId)
            .in('invite_status', ['accepted', 'invited']);
        if (memberError) throw memberError;
        const chatIds = memberships?.map((m: any) => m.chat_id) || [];
        if (chatIds.length === 0) return res.json([]);
        // 2. Get chat details
        const { data: chats, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .in('id', chatIds);
        if (chatError) throw chatError;
        // Optionally, include membership status in response
        const chatsWithStatus = chats.map((chat: any) => ({
            ...chat,
            invite_status: memberships.find((m: any) => m.chat_id === chat.id)?.invite_status || 'unknown',
        }));
        res.json(chatsWithStatus);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to fetch chats' });
    }
});

// List messages in a chat
router.get('/:chatId/messages', async (req: Request, res: Response) => {
    // TODO: Implement message listing
    res.status(501).json({ message: 'Not implemented' });
});

// Send a message in a chat
router.post('/:chatId/messages', async (req: Request, res: Response) => {
    // TODO: Implement sending a message
    res.status(501).json({ message: 'Not implemented' });
});

export default router;