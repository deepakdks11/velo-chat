import { useState, useEffect } from 'react';
import {
    signInAnonymously,
    onAuthStateChanged,
    User as FirebaseUser,
    signOut
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { auth, firestore, db } from '@/lib/firebase.config';
import { UserProfile } from '@/types';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { ref, onDisconnect, set, remove } from 'firebase/database';

export function useAuth() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Subscribe to user profile
                const userRef = doc(firestore, 'users', currentUser.uid);
                const unsubProfile = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        setProfile(doc.data() as UserProfile);

                        // Set up presence system
                        const statusRef = ref(db, `status/${currentUser.uid}`);
                        onDisconnect(statusRef).remove();
                        set(statusRef, {
                            state: 'online',
                            last_changed: Date.now(),
                            nickname: doc.data().nickname
                        });
                    } else {
                        setProfile(null);
                    }
                    setLoading(false);
                });

                return () => unsubProfile();
            } else if (!isMock) {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [isMock]);

    const createProfile = async (nickname: string, gender: UserProfile['gender'], country: string) => {
        const targetUid = user?.uid || 'mock-user-123';

        const avatar = createAvatar(bottts, {
            seed: nickname + Date.now().toString(),
        }).toString();

        const newProfile: UserProfile = {
            uid: targetUid,
            nickname,
            gender,
            country,
            avatar,
            isOnline: true,
            lastActive: Date.now(),
            blockedUsers: [],
            favorites: [],
            role: 'user',
            createdAt: Date.now()
        };

        if (isMock) {
            setProfile(newProfile);
            return;
        }

        if (!user) throw new Error('No authenticated user');
        await setDoc(doc(firestore, 'users', user.uid), newProfile);
        setProfile(newProfile);
    };

    const login = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error: any) {
            console.warn("Firebase Auth failed, falling back to mock mode", error);
            if (error.code === 'auth/configuration-not-found' || error.message?.includes('not enabled')) {
                setIsMock(true);
                setUser({
                    uid: 'mock-user-123',
                    isAnonymous: true,
                    displayName: 'Guest User',
                } as FirebaseUser);
                setLoading(false);
            }
        }
    };

    const logout = async () => {
        try {
            if (isMock) {
                setIsMock(false);
                setUser(null);
                setProfile(null);
                return;
            }
            if (user) {
                const statusRef = ref(db, `status/${user.uid}`);
                await remove(statusRef);
            }
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (isMock && profile) {
            setProfile({ ...profile, ...data });
            return;
        }
        if (!user) throw new Error('No authenticated user');
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, data);
    };

    return {
        user,
        profile,
        loading,
        isMock,
        login,
        logout,
        createProfile,
        updateProfile,
        isAuthenticated: (!!user || isMock) && !!profile
    };
}
