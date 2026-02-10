import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';

export default function ProfileSetup() {
    const { createProfile } = useAuth();
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<UserProfile['gender']>('non-binary');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname || !country) return;

        setLoading(true);
        try {
            await createProfile(nickname, gender, country);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 border-muted/50 shadow-xl backdrop-blur-sm bg-background/80">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Complete Profile
                    </CardTitle>
                    <CardDescription>
                        Choose a nickname to start chatting anonymously.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                required
                                placeholder="Enter a cool nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                required
                                placeholder="e.g. USA, Japan, Mars"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={gender}
                                onValueChange={(val: UserProfile['gender']) => setGender(val)}
                            >
                                <SelectTrigger id="gender" className="bg-background/50">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="non-binary">Non-binary</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full font-semibold"
                            size="lg"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Creating Profile...' : 'Start Chatting'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
