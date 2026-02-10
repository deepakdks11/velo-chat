import { useState, useEffect, useRef } from 'react';
import {
    ref,
    onValue,
    push,
    set,
    serverTimestamp,
    query,
    orderByChild,
    limitToLast,
    onDisconnect,
    remove
} from 'firebase/database';
import { db } from '@/lib/firebase.config';
import { useAuth } from '@/hooks/useAuth';
import { Message, UserProfile } from '@/types';

export function useChatRoom(roomId: string) {
    const { user, profile } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, { nickname: string; avatar: string; country: string }>>({});

    const messagesRef = ref(db, `rooms/${roomId}/messages`);
    const activeUsersRef = ref(db, `rooms/${roomId}/activeUsers`);
    const typingRef = ref(db, `rooms/${roomId}/typing`);

    // Subscribe to messages
    useEffect(() => {
        const q = query(messagesRef, orderByChild('timestamp'), limitToLast(50));

        const unsubscribe = onValue(q, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messageList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessages(messageList);
            } else {
                setMessages([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);

    // Handle presence
    useEffect(() => {
        if (!user || !profile) return;

        // Add user to active list
        const userPresenceRef = ref(db, `rooms/${roomId}/users/${user.uid}`);
        set(userPresenceRef, {
            nickname: profile.nickname,
            avatar: profile.avatar || '', // Ensure avatar is not undefined
            country: profile.country
        });

        // Remove on disconnect
        onDisconnect(userPresenceRef).remove();

        // Count active users
        const usersRef = ref(db, `rooms/${roomId}/users`);
        const unsubUsers = onValue(usersRef, (snap) => {
            if (snap.exists()) {
                const usersData = snap.val();
                setActiveUsers(Object.keys(usersData).length);
                setOnlineUsers(usersData);
            } else {
                setActiveUsers(0);
                setOnlineUsers({});
            }
        });

        return () => {
            remove(userPresenceRef);
            unsubUsers();
        };
    }, [roomId, user, profile]);

    // Handle typing status
    useEffect(() => {
        const unsubTyping = onValue(typingRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                const now = Date.now();
                const users = Object.keys(data).filter(uid => {
                    return data[uid] > now - 2000 && uid !== user?.uid;
                });
                // We would need to fetch nicknames for these UIDs or store nicknames in typing Ref
                // For MVP simplified: just returning count or UIDs
                setTypingUsers(users);
            } else {
                setTypingUsers([]);
            }
        });

        return () => unsubTyping();
    }, [roomId, user]);

    const sendMessage = async (text: string, type: 'text' | 'image' = 'text') => {
        if (!user || !profile) return;

        if (text.trim().length === 0) return;

        const newMessageRef = push(messagesRef);
        await set(newMessageRef, {
            uid: user.uid,
            text: text, // For images, this will contain the data URL
            timestamp: serverTimestamp(),
            type: type,
            user: {
                nickname: profile.nickname,
                avatar: profile.avatar || '',
                gender: profile.gender,
                country: profile.country
            }
        });
    };

    const setTyping = (isTyping: boolean) => {
        if (!user) return;
        const userTypingRef = ref(db, `rooms/${roomId}/typing/${user.uid}`);
        if (isTyping) {
            set(userTypingRef, serverTimestamp());
        } else {
            remove(userTypingRef);
        }
    };

    return {
        messages,
        loading,
        activeUsers,
        onlineUsers,
        typingUsers,
        sendMessage,
        setTyping
    };
}
