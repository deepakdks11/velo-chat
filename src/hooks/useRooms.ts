import { useState, useEffect } from 'react';
import { db, firestore } from '@/lib/firebase.config';
import { ref, onValue } from 'firebase/database';
import { useAuth } from './useAuth';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface Room {
    id: string;
    name: string;
    category: 'topic' | 'country' | 'language' | 'age';
    activeUsers: number;
    maxUsers: number;
}

export function useRooms() {
    const { user, profile, updateProfile } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app with dynamic rooms, we'd listen to a 'rooms' path.
        // For MVP, we might have static rooms or a simple list.
        // Let's assume we fetch room stats from Realtime DB if they exist, 
        // or just mock/define them here if we haven't built dynamic room creation yet.

        // Based on previous plan, we have predefined categories. 
        // Let's mock the room structure for now but enable "activeUsers" updates if we had them.

        const staticRooms: Room[] = [
            { id: 'general', name: 'General Chat', category: 'topic', activeUsers: 0, maxUsers: 200 },
            { id: 'tech', name: 'Tech Talk', category: 'topic', activeUsers: 0, maxUsers: 200 },
            { id: 'gaming', name: 'Gaming', category: 'topic', activeUsers: 0, maxUsers: 200 },
            { id: 'music', name: 'Music Lounge', category: 'topic', activeUsers: 0, maxUsers: 200 },
            { id: 'movies', name: 'Movie Buffs', category: 'topic', activeUsers: 0, maxUsers: 200 },
            { id: 'usa', name: 'USA', category: 'country', activeUsers: 0, maxUsers: 200 },
            { id: 'uk', name: 'United Kingdom', category: 'country', activeUsers: 0, maxUsers: 200 },
            { id: 'india', name: 'India', category: 'country', activeUsers: 0, maxUsers: 200 },
            { id: 'english', name: 'English', category: 'language', activeUsers: 0, maxUsers: 200 },
            { id: 'spanish', name: 'Español', category: 'language', activeUsers: 0, maxUsers: 200 },
            { id: '18-24', name: '18-24', category: 'age', activeUsers: 0, maxUsers: 200 },
            { id: '25-34', name: '25-34', category: 'age', activeUsers: 0, maxUsers: 200 },
            { id: '35plus', name: '35+', category: 'age', activeUsers: 0, maxUsers: 200 },
        ];

        setRooms(staticRooms);
        setLoading(false);
    }, []);

    const toggleFavorite = async (roomId: string) => {
        if (!user || !profile) return;

        const isFavorite = profile.favorites?.includes(roomId);
        const userRef = doc(firestore, 'users', user.uid);

        try {
            if (isFavorite) {
                await updateDoc(userRef, {
                    favorites: arrayRemove(roomId)
                });
                // Optimistic update handled by useAuth listener
            } else {
                await updateDoc(userRef, {
                    favorites: arrayUnion(roomId)
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const isFavorite = (roomId: string) => {
        return profile?.favorites?.includes(roomId) || false;
    };

    return {
        rooms,
        loading,
        toggleFavorite,
        isFavorite
    };
}
