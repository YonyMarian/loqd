import express from 'express';
import supabase from '../../../supabase';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create a new chat
router.post('/', async (req, res) => {
    const { name, userIds } = req.body; // userIds: array of user IDs to add (including creator)
    const creatorId = req.headers['x-user-id'] as string; // Assume user ID is passed in header
    if (!creatorId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // 1. Create chat
        const { data: chat, error: chatError } = await supabase
            .from('chats')
            .insert([{ id: uuidv4(), name, created_by: creatorId }])
            .select()
            .single();
        if (chatError) throw chatError;

        // 2. Add members (status: 'accepted' for creator, 'invited' for others)
        const members = userIds.map((uid: string) => ({
            id: uuidv4(),
            chat_id: chat.id,
            user_id: uid,
            joined_at: new Date().toISOString(),
            status: uid === creatorId ? 'accepted' : 'invited',
        }));
        const { error: membersError } = await supabase.from('chat_members').insert(members);
        if (membersError) throw membersError;

        res.status(201).json({ chat });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to create chat' });
    }
});

// Invite a user to a chat
router.post('/:chatId/invite', async (req, res) => {
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
            joined_at: new Date().toISOString(),
            status: 'invited',
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
        // Configure nodemailer transporter (using Gmail SMTP)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'getloqd@gmail.com',
                pass: process.env.GETLOQD_GMAIL_APP_PASSWORD, // Use an app password, not your real password
            },
        });
        const inviteLink = `https://loqd.app/invitations/accept?token=${token}`;
        const mailOptions = {
            from: 'getloqd@gmail.com',
            to: receiverEmail,
            subject: 'You have been invited to join a chat on Loqd',
            html: `<p>You have been invited to join a chat. <a href="${inviteLink}">Click here to accept or decline the invitation</a>.</p>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Invitation sent', token });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to invite user' });
    }
});

// Accept or decline an invitation (from email link)
router.post('/invitations/:token', async (req, res) => {
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
                .update({ status: 'accepted' })
                .eq('chat_id', invitation.chat_id)
                .eq('user_id', userId);
        } else if (action === 'decline') {
            await supabase
                .from('chat_members')
                .update({ status: 'declined' })
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
            .update({ status: 'accepted' })
            .eq('chat_id', invitation.chat_id)
            .eq('user_id', invitation.receiver_id);
        // 4. Redirect to frontend (optional)
        return res.redirect(`https://loqd.app/invitations/accepted?chatId=${invitation.chat_id}`);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Failed to accept invitation' });
    }
});

// List chats for the current user
router.get('/', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }
    try {
        // 1. Get chat memberships for user
        const { data: memberships, error: memberError } = await supabase
            .from('chat_members')
            .select('chat_id, status')
            .eq('user_id', userId)
            .in('status', ['accepted', 'invited']);
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
            status: memberships.find((m: any) => m.chat_id === chat.id)?.status || 'unknown',
        }));
        res.json(chatsWithStatus);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to fetch chats' });
    }
});

// List messages in a chat
router.get('/:chatId/messages', async (req, res) => {
    // TODO: Implement message listing
    res.status(501).json({ message: 'Not implemented' });
});

// Send a message in a chat
router.post('/:chatId/messages', async (req, res) => {
    // TODO: Implement sending a message
    res.status(501).json({ message: 'Not implemented' });
});

export default router;