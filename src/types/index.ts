import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    nickname: string;
    gender: 'male' | 'female' | 'non-binary' | 'other';
    country: string;
    avatar: string;
    isOnline: boolean;
    lastActive: number;
    blockedUsers?: string[];
    role?: 'user' | 'admin';
    favorites?: string[];
    createdAt: number;
}

export interface Message {
    id: string;
    uid: string;
    text: string;
    timestamp: number;
    type: 'text' | 'system' | 'image';
    user?: {
        nickname: string;
        avatar: string;
        gender: string;
        country: string;
    };
}

export interface Room {
    id: string;
    name: string;
    category: 'topic' | 'country' | 'language' | 'age';
    activeUsers?: number;
    maxUsers?: number;
    description?: string;
    createdBy?: string;
    createdAt?: number;
}

export interface PrivateChat {
    id: string;
    participants: string[];
    participantsData: Record<string, {
        nickname: string;
        avatar: string;
    }>;
    lastMessage?: string;
    lastMessageTimestamp?: number;
    unreadCount?: Record<string, number>;
    status: 'pending' | 'accepted' | 'rejected';
    initiator: string;
}
