import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db, firestore } from '@/lib/firebase.config';
import { ref, set, push, serverTimestamp } from 'firebase/database';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export function useModeration() {
    const { user, profile } = useAuth();
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

    // Sync blocked users from profile
    useEffect(() => {
        if (profile?.blockedUsers) {
            setBlockedUsers(profile.blockedUsers);
        } else {
            setBlockedUsers([]);
        }
    }, [profile]);

    const blockUser = async (targetUid: string) => {
        if (!user) return;
        const currentBlocked = profile?.blockedUsers || [];
        if (currentBlocked.includes(targetUid)) return;

        // Optimistic update handled by onSnapshot in useAuth, but we can set local state too
        setBlockedUsers([...currentBlocked, targetUid]);

        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
            blockedUsers: arrayUnion(targetUid)
        });
    };

    const unblockUser = async (targetUid: string) => {
        if (!user) return;

        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
            blockedUsers: arrayRemove(targetUid)
        });
    };

    const isBlocked = (targetUid: string) => {
        return blockedUsers.includes(targetUid);
    };

    const reportUser = async (targetUid: string, reason: string) => {
        if (!user) return;
        const reportsRef = ref(db, 'reports');
        const newReportRef = push(reportsRef);
        await set(newReportRef, {
            reporter: user.uid,
            target: targetUid,
            reason,
            timestamp: serverTimestamp(),
            status: 'pending'
        });
    };

    return {
        blockedUsers,
        blockUser,
        unblockUser,
        isBlocked,
        reportUser
    };
}
