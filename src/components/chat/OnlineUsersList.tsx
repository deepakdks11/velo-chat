import { useState } from 'react';
import { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from "@/components/ui/input";
import { MessageSquare, MoreVertical, X, Search, Circle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OnlineUsersListProps {
    users: Record<string, { nickname: string; avatar: string; country: string }>;
    onStartPM: (uid: string, nickname: string, avatar: string) => void;
    className?: string;
}

export default function OnlineUsersList({ users, onStartPM, className }: OnlineUsersListProps) {
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const sortedUsers = Object.entries(users)
        .filter(([, profile]) => profile.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort(([, a], [, b]) => a.nickname.localeCompare(b.nickname));

    return (
        <div className={`flex flex-col border-l bg-background/50 backdrop-blur-sm ${className}`}>
            <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        Online Members
                        <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {Object.keys(users).length}
                        </span>
                    </h3>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Filter users..."
                        className="h-8 pl-8 text-xs bg-muted/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {sortedUsers.map(([uid, profile]) => {
                        const isMe = uid === currentUser?.uid;
                        return (
                            <div
                                key={uid}
                                className={`flex items-center justify-between group p-2 rounded-md hover:bg-accent/50 transition-colors ${isMe ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border border-border">
                                            <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(profile.avatar)}`} />
                                            <AvatarFallback>{profile.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500"></span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate flex items-center gap-1">
                                            {profile.nickname}
                                            {isMe && <span className="text-[10px] text-muted-foreground">(You)</span>}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground truncate">{profile.country}</span>
                                    </div>
                                </div>

                                {!isMe && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => onStartPM(uid, profile.nickname, profile.avatar)}
                                                >
                                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Message {profile.nickname}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        );
                    })}
                    {sortedUsers.length === 0 && (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
