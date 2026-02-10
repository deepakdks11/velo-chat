import { usePrivateMessage } from '@/hooks/usePrivateMessage';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { MessageCircle, Check, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PrivateChatListProps {
    className?: string;
    onSelectChat?: () => void; // Optional callback to close sheet/dialog
}

export default function PrivateChatList({ className, onSelectChat }: PrivateChatListProps) {
    const { user } = useAuth();
    const { chats, loading, acceptChat, rejectChat, pendingRequestsCount } = usePrivateMessage();
    const router = useRouter();

    if (!user) return null;

    const activeChats = chats.filter(c => c.status === 'accepted');
    const incomingRequests = chats.filter(c => c.status === 'pending' && c.initiator !== user.uid);
    // const sentRequests = chats.filter(c => c.status === 'pending' && c.initiator === user.uid);

    const handleChatClick = (chatId: string) => {
        router.push(`/chat/${chatId}`);
        if (onSelectChat) onSelectChat();
    };

    const getPartner = (chat: any) => {
        const partnerId = chat.participants.find((p: string) => p !== user.uid) || user.uid;
        return chat.participantsData?.[partnerId] || { nickname: 'Unknown', avatar: '' };
    };

    if (loading) {
        return <div className="p-4 text-center text-muted-foreground">Loading chats...</div>;
    }

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <Tabs defaultValue="active" className="w-full flex-1 flex flex-col">
                <div className="px-4 pt-2">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="requests" className="relative">
                            Requests
                            {pendingRequestsCount > 0 && (
                                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 h-4 text-[10px]">
                                    {pendingRequestsCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="active" className="flex-1 overflow-hidden mt-2">
                    <ScrollArea className="h-full">
                        {activeChats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center p-4 text-muted-foreground">
                                <MessageCircle className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">No active chats yet.</p>
                                <p className="text-xs mt-1">Start a conversation from the Online Users list!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 p-2">
                                {activeChats.map(chat => {
                                    const partner = getPartner(chat);
                                    return (
                                        <div
                                            key={chat.id}
                                            onClick={() => handleChatClick(chat.id)}
                                            className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(partner.avatar)}`} />
                                                <AvatarFallback>{partner.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-medium truncate">{partner.nickname}</span>
                                                    {chat.lastMessageTimestamp && (
                                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                                            {new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {chat.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                            {/* Unread count could go here */}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="requests" className="flex-1 overflow-hidden mt-2">
                    <ScrollArea className="h-full">
                        {incomingRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center p-4 text-muted-foreground">
                                <Bell className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">No pending requests.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 p-2">
                                {incomingRequests.map(chat => {
                                    const partner = getPartner(chat);
                                    return (
                                        <Card key={chat.id} className="overflow-hidden">
                                            <CardHeader className="p-3 pb-2 flex flex-row items-center gap-3 space-y-0">
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(partner.avatar)}`} />
                                                    <AvatarFallback>{partner.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm font-medium">{partner.nickname}</CardTitle>
                                                    <CardDescription className="text-xs">wants to verify chat</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-2 pt-0 flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 h-8 text-xs"
                                                    onClick={() => acceptChat(chat.id)}
                                                >
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1 h-8 text-xs"
                                                    onClick={() => rejectChat(chat.id)}
                                                >
                                                    <X className="h-3 w-3 mr-1" />
                                                    Decline
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}
