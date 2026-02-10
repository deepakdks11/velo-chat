import { useEffect, useRef, useState } from 'react';
import { useChatRoom } from '@/hooks/useChatRoom';
import { useAuth } from '@/hooks/useAuth';
import MessageInput from './MessageInput';
import OnlineUsersList from './OnlineUsersList';
import Loading from '@/components/ui/loading';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Users, Menu, Hash, Info, MessageCircle, MoreVertical, ShieldAlert, Ban, Flag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from 'next/navigation';
import { getPrivateChatId } from '@/lib/utils';
import { usePrivateMessage } from '@/hooks/usePrivateMessage';
import { useModeration } from '@/hooks/useModeration';
import { censorProfanity } from '@/lib/profanityFilter';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatRoomProps {
    roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
    const { user } = useAuth();
    const { messages, loading, activeUsers, onlineUsers, sendMessage, setTyping } = useChatRoom(roomId);
    const { initiateChat } = usePrivateMessage();
    const { isBlocked, blockUser, reportUser } = useModeration();

    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pmName = searchParams.get('name');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleStartPM = async (targetUid: string, targetNickname: string, targetAvatar: string) => {
        if (!user) return;

        // Use the hook to create/get chat ID and handle metadata
        const pmId = await initiateChat(targetUid, { nickname: targetNickname, avatar: targetAvatar });

        if (pmId) {
            router.push(`/chat/${pmId}?name=${encodeURIComponent(targetNickname)}`);
        }
    };

    const isPM = roomId.startsWith('pm_');

    if (loading) {
        return <Loading text="Joining room..." className="h-[80vh]" />;
    }

    return (
        <div className="flex bg-background h-[calc(100vh-4rem)] max-w-7xl mx-auto border-x shadow-sm overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPM ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                            {isPM ? <MessageCircle className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none flex items-center gap-2">
                                {isPM ? (pmName || 'Private Chat') : roomId}
                                <Badge variant="outline" className="text-xs font-normal">
                                    {isPM ? 'Private' : 'Topic'}
                                </Badge>
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {isPM ? 'End-to-end encrypted' : `${activeUsers} online`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        {!isPM && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Users className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 w-80">
                                    <OnlineUsersList users={onlineUsers} onStartPM={handleStartPM} className="h-full border-0" />
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Info className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Room Information</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </header>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-muted/5">
                    <div className="flex flex-col gap-4 pb-4 max-w-3xl mx-auto">
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted mb-4">
                                {isPM ? <MessageCircle className="h-8 w-8 text-muted-foreground" /> : <Hash className="h-8 w-8 text-muted-foreground" />}
                            </div>
                            <h3 className="font-semibold text-lg">
                                {isPM ? `Chat with ${pmName || 'User'}` : `Welcome to the #${roomId} room!`}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                                {isPM ? 'This is a private conversation.' : 'This is the start of the conversation. Messages are anonymous.'}
                            </p>
                        </div>

                        {messages.map((msg, index) => {
                            if (isBlocked(msg.uid)) return null;

                            const isMe = msg.uid === user?.uid;
                            const isSequential = index > 0 && messages[index - 1].uid === msg.uid;
                            const displayedText = msg.type === 'image' ? msg.text : censorProfanity(msg.text || '');

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} ${isSequential ? 'mt-[-8px]' : ''}`}
                                >
                                    {!isSequential ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="focus:outline-none">
                                                <Avatar className="h-8 w-8 border border-border mt-0.5 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                                                    <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(msg.user?.avatar || '')}`} />
                                                    <AvatarFallback>{msg.user?.nickname?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align={isMe ? "end" : "start"}>
                                                {!isMe && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleStartPM(msg.uid, msg.user?.nickname || 'User', msg.user?.avatar || '')}>
                                                            <MessageCircle className="mr-2 h-4 w-4" /> Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => blockUser(msg.uid)} className="text-destructive">
                                                            <Ban className="mr-2 h-4 w-4" /> Block User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => reportUser(msg.uid, 'Inappropriate Content')} className="text-destructive">
                                                            <Flag className="mr-2 h-4 w-4" /> Report
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {isMe && (
                                                    <DropdownMenuItem disabled>
                                                        <span className="text-muted-foreground text-xs">That's you!</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <div className="w-8" />
                                    )}

                                    <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isSequential && (
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <span className="text-xs font-semibold">{msg.user?.nickname}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm transition-all
                                                            ${isMe
                                                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                                : 'bg-card border rounded-tl-sm'
                                                            }
                                                            ${msg.type === 'image' ? 'p-1 bg-transparent border-0 shadow-none' : ''}
                                                        `}
                                                    >
                                                        {msg.type === 'image' ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={displayedText}
                                                                    alt="Sent image"
                                                                    className="max-w-[250px] md:max-w-sm rounded-[inherit] border shadow-sm"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ) : (
                                                            displayedText
                                                        )}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side={isMe ? "left" : "right"}>
                                                    <p className="text-xs">
                                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
            </div>

            {/* Sidebar (Desktop) */}
            {!isPM && (
                <div className="hidden md:flex w-80 flex-col border-l bg-background/50">
                    <OnlineUsersList users={onlineUsers} onStartPM={handleStartPM} className="h-full border-0 bg-transparent" />
                </div>
            )}
        </div>
    );
}
