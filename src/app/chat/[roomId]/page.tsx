"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ChatRoom from '@/components/chat/ChatRoom';
import Loading from '@/components/ui/loading';

interface ChatPageProps {
    params: {
        roomId: string;
    };
}

export default function ChatPage({ params }: ChatPageProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <Loading text="Authenticating..." className="h-screen" />;
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-background">
            <ChatRoom roomId={params.roomId} />
        </div>
    );
}
