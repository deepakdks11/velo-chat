import { useState, useEffect } from 'react';
import { db, firestore } from '@/lib/firebase.config';
import { ref, onValue } from 'firebase/database';
import { useAuth } from './useAuth';
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    onSnapshot,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { Room } from '@/types';

const INITIAL_ROOMS: Room[] = [
    { id: 'general', name: 'General Chat', category: 'topic', description: 'Talk about anything and everything.' },
    { id: 'tech', name: 'Tech Talk', category: 'topic', description: 'Gadgets, coding, and future tech.' },
    { id: 'gaming', name: 'Gaming', category: 'topic', description: 'LFG, strats, and game discussions.' },
    { id: 'music', name: 'Music Lounge', category: 'topic', description: 'Share your favorite tunes and artists.' },
    { id: 'movies', name: 'Movies & TV', category: 'topic', description: 'Discuss the latest blockbusters and series.' },
    { id: 'crypto', name: 'Crypto & Finance', category: 'topic', description: 'To the moon! 🚀' },
    { id: 'usa', name: 'USA', category: 'country', description: 'Chat with people from the United States.' },
    { id: 'uk', name: 'United Kingdom', category: 'country', description: 'Cheers mate!' },
    { id: 'india', name: 'India', category: 'country', description: 'Namaste! Connect with India.' },
    { id: 'can', name: 'Canada', category: 'country', description: 'Eh? Friendly chat from the north.' },
    { id: 'aus', name: 'Australia', category: 'country', description: 'G\'day! Down under chat.' },
];

export function useRooms() {
    const { user, profile } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roomsCollection = collection(firestore, 'rooms');

        // Check if we need to seed
        const checkAndSeed = async () => {
            try {
                const snapshot = await getDocs(roomsCollection);
                if (snapshot.empty) {
                    console.log("Seeding initial rooms...");
                    const batch = writeBatch(firestore);
                    INITIAL_ROOMS.forEach(room => {
                        const roomRef = doc(roomsCollection, room.id);
                        batch.set(roomRef, room);
                    });
                    await batch.commit();
                    console.log("Seeding complete.");
                }
            } catch (error) {
                console.error("Error seeding rooms:", error);
            }
        };

        checkAndSeed();

        const unsubscribe = onSnapshot(roomsCollection, (snapshot) => {
            const roomList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Room[];
            setRooms(roomList);
            setLoading(false);
        });

        return () => unsubscribe();
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
