import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Room } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MessageSquare, Users, Search, Hash, Globe, ChevronRight, Zap, Star } from 'lucide-react';
import PrivateChatList from '@/components/chat/PrivateChatList';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { usePrivateMessage } from '@/hooks/usePrivateMessage';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import RoomActiveUsersBadge from './RoomActiveUsersBadge';
import Loading from '@/components/ui/loading';

export default function RoomList() {
    const router = useRouter();
    const { user } = useAuth();
    const { pendingRequestsCount, unreadMessagesCount } = usePrivateMessage();
    const { rooms, loading, toggleFavorite, isFavorite } = useRooms();
    const totalNotifications = pendingRequestsCount + unreadMessagesCount;

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'topic' | 'country' | 'favorites'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleJoinRoom = (roomId: string) => {
        router.push(`/chat/${roomId}`);
    };

    const handleToggleFavorite = (e: React.MouseEvent, roomId: string) => {
        e.stopPropagation();
        toggleFavorite(roomId);
    };

    const filteredRooms = rooms.filter(room => {
        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory === 'favorites' ? isFavorite(room.id) : room.category === selectedCategory);
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return <Loading text="Loading rooms..." className="h-[calc(100vh-4rem)]" />;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto pt-4 gap-4 px-4">
            {/* Sidebar Navigation */}
            <div className="w-64 hidden md:flex flex-col gap-2 shrink-0">
                <div className="mb-4 px-2">
                    <h2 className="text-xl font-bold tracking-tight px-2 mb-4">Discover</h2>
                    {/* ... Search ... */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms..."
                            className="pl-9 bg-muted/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <nav className="space-y-1">
                    <Button
                        variant={selectedCategory === 'all' ? "secondary" : "ghost"}
                        className="w-full justify-start text-base"
                        onClick={() => setSelectedCategory('all')}
                    >
                        <Zap className="mr-2 h-4 w-4" />
                        All Rooms
                    </Button>
                    <Button
                        variant={selectedCategory === 'topic' ? "secondary" : "ghost"}
                        className="w-full justify-start text-base"
                        onClick={() => setSelectedCategory('topic')}
                    >
                        <Hash className="mr-2 h-4 w-4" />
                        Topics
                    </Button>
                    <Button
                        variant={selectedCategory === 'country' ? "secondary" : "ghost"}
                        className="w-full justify-start text-base"
                        onClick={() => setSelectedCategory('country')}
                    >
                        <Globe className="mr-2 h-4 w-4" />
                        Countries
                    </Button>
                    <Button
                        variant={selectedCategory === 'favorites' ? "secondary" : "ghost"}
                        className="w-full justify-start text-base"
                        onClick={() => setSelectedCategory('favorites')}
                    >
                        <Star className="mr-2 h-4 w-4" />
                        Favorites
                    </Button>

                    <div className="pt-4 mt-4 border-t">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-base relative">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    My Messages
                                    {totalNotifications > 0 && (
                                        <Badge className="ml-auto bg-red-500 hover:bg-red-600 h-5 w-auto min-w-[1.25rem] px-1">
                                            {totalNotifications}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 sm:w-96 p-0">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Private Messages</SheetTitle>
                                    <SheetDescription>Manage your conversations and requests.</SheetDescription>
                                </SheetHeader>
                                <PrivateChatList className="p-0" onSelectChat={() => { }} />
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>

                <div className="mt-auto p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm">VeloChat Pro</h3>
                    <p className="text-xs text-muted-foreground mb-3">Unlock custom rooms and verified badges.</p>
                    <Button size="sm" className="w-full" variant="outline">Learn More</Button>
                </div>
            </div>

            {/* Main Content Area */}
            <ScrollArea className="flex-1 h-full rounded-lg border bg-background shadow-sm">
                <div className="p-6">
                    <div className="mb-6 md:hidden">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search rooms..."
                                className="pl-9 bg-muted/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            <Badge
                                variant={selectedCategory === 'all' ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </Badge>
                            <Badge
                                variant={selectedCategory === 'topic' ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory('topic')}
                            >
                                Topics
                            </Badge>
                            <Badge
                                variant={selectedCategory === 'country' ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory('country')}
                            >
                                Countries
                            </Badge>
                            <Badge
                                variant={selectedCategory === 'favorites' ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory('favorites')}
                            >
                                Favorites
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRooms.map((room) => {
                            const favorited = isFavorite(room.id);
                            return (
                                <Card
                                    key={room.id}
                                    className="group cursor-pointer hover:shadow-md transition-all border-muted hover:border-primary/50 relative overflow-hidden"
                                    onClick={() => handleJoinRoom(room.id)}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {room.category === 'topic' ? <Hash className="w-24 h-24" /> : <Globe className="w-24 h-24" />}
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="mb-2">{room.category === 'topic' ? 'General' : 'Region'}</Badge>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-6 w-6 ${favorited ? 'text-yellow-400 hover:text-yellow-500' : 'text-muted-foreground hover:text-yellow-400'}`}
                                                    onClick={(e) => handleToggleFavorite(e, room.id)}
                                                >
                                                    <Star className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
                                                </Button>
                                                <RoomActiveUsersBadge roomId={room.id} />
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{room.name}</CardTitle>
                                        <CardDescription className="line-clamp-2 min-h-[2.5em]">{room.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="pt-2">
                                        <Button size="sm" variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            Join Room <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredRooms.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-muted rounded-full p-4 mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No rooms found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                            <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>Clear Filters</Button>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
