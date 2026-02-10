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
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loading text="Authenticating..." />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
                <h1 className="font-semibold text-lg">VeloChat</h1>
            </header>
            <main className="flex-1 overflow-hidden p-4">
                <ChatRoom roomId={params.roomId} />
            </main>
        </div>
    );
}
