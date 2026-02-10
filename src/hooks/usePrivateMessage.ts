import { useState, useEffect } from 'react';
import {
    ref,
    onValue,
    set,
    update,
    push,
    get,
    serverTimestamp,
    query,
    orderByChild,
    equalTo
} from 'firebase/database';
import { db } from '@/lib/firebase.config';
import { useAuth } from './useAuth';
import { PrivateChat } from '@/types';
import { getPrivateChatId } from '@/lib/utils'; // Ensure this matches your utils export

export function usePrivateMessage() {
    const { user } = useAuth();
    const [chats, setChats] = useState<PrivateChat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setChats([]);
            setLoading(false);
            return;
        }

        // In a real app with many users, you'd index by participant.
        // For MVP/small scale, we can listen to a user-specific node or query.
        // Let's use a user_chats/{uid} node for efficient listing, 
        // OR just query the main `private_chats` if volume is low.
        // For scalability, let's assume we copy chat metadata to `user_private_chats/{uid}/{chatId}`
        // OR we just iterate `private_chats` id logic if we stick to strict ID generation.

        // BETTER APPROACH for Realtime DB:
        // Identify chats by ID. We already know `getPrivateChatId`.
        // But to list *all* my chats (some might be with people I haven't chatted with yet?), we need a list.
        // Let's create a `user_chats/{uid}` node that lists chatIDs they are part of.

        const userChatsRef = ref(db, `user_chats/${user.uid}`);

        const unsubscribe = onValue(userChatsRef, async (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setChats([]);
                setLoading(false);
                return;
            }

            const chatIds = Object.keys(data);
            const loadedChats: PrivateChat[] = [];

            // Fetch details for each chat
            // In a production app, you might want to denormalize this data 
            // so you don't have to fetch each chat individually here.
            for (const chatId of chatIds) {
                const chatRef = ref(db, `private_chats/${chatId}/metadata`);
                const chatSnap = await get(chatRef);
                if (chatSnap.exists()) {
                    loadedChats.push({ id: chatId, ...chatSnap.val() });
                }
            }

            // Sort by last message
            loadedChats.sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0));

            setChats(loadedChats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const initiateChat = async (targetUid: string, targetData: { nickname: string, avatar: string }) => {
        if (!user) return null;
        const chatId = getPrivateChatId(user.uid, targetUid);
        const chatRef = ref(db, `private_chats/${chatId}/metadata`);

        const snapshot = await get(chatRef);

        if (snapshot.exists()) {
            // Chat already exists, just return ID
            // Optionally check if status is rejected
            return chatId;
        }

        // New Chat
        const newChat: Omit<PrivateChat, 'id'> = {
            participants: [user.uid, targetUid],
            participantsData: {
                [user.uid]: { nickname: user.displayName || 'Anonymous', avatar: user.photoURL || '' },
                [targetUid]: targetData
            },
            status: 'pending',
            initiator: user.uid,
            lastMessageTimestamp: Date.now(),
            unreadCount: { [targetUid]: 1, [user.uid]: 0 } // Maybe 1 for request?
        };

        await set(chatRef, newChat);

        // Add to user_chats index for both
        const updates: Record<string, any> = {};
        updates[`user_chats/${user.uid}/${chatId}`] = true;
        updates[`user_chats/${targetUid}/${chatId}`] = true;

        await update(ref(db), updates);

        return chatId;
    };

    const acceptChat = async (chatId: string) => {
        if (!user) return;
        const chatRef = ref(db, `private_chats/${chatId}/metadata`);
        await update(chatRef, { status: 'accepted' });
    };

    const rejectChat = async (chatId: string) => {
        if (!user) return;
        const chatRef = ref(db, `private_chats/${chatId}/metadata`);
        await update(chatRef, { status: 'rejected' });
        // Optionally remove from user_chats index
    };

    // Helper to get pending requests count
    const pendingRequestsCount = chats.filter(c => c.status === 'pending' && c.initiator !== user?.uid).length;

    const unreadMessagesCount = chats.reduce((acc, chat) => {
        if (chat.status === 'accepted') {
            return acc + (chat.unreadCount?.[user?.uid || ''] || 0);
        }
        return acc;
    }, 0);

    return {
        chats,
        loading,
        initiateChat,
        acceptChat,
        rejectChat,
        pendingRequestsCount,
        unreadMessagesCount
    };
}
