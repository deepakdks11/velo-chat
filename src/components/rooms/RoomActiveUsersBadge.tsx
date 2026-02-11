import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase.config';

interface RoomActiveUsersBadgeProps {
    roomId: string;
}

export default function RoomActiveUsersBadge({ roomId }: RoomActiveUsersBadgeProps) {
    const [activeCount, setActiveCount] = useState<number>(0);

    useEffect(() => {
        const usersRef = ref(db, `rooms/${roomId}/users`);

        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                setActiveCount(snapshot.size);
            } else {
                setActiveCount(0);
            }
        });

        return () => unsubscribe();
    }, [roomId]);

    return (
        <span className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${activeCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {activeCount}
        </span>
    );
}
