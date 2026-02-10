'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useModeration } from '@/hooks/useModeration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, Shield, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

export default function SettingsPage() {
    const { user, profile, updateProfile } = useAuth();
    const { blockedUsers, unblockUser } = useModeration();
    const router = useRouter();

    const [nickname, setNickname] = useState(profile?.nickname || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user || !nickname.trim()) return;
        setIsSaving(true);
        try {
            await updateProfile({ nickname });
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerateAvatar = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const newAvatar = createAvatar(bottts, {
                seed: nickname + Date.now().toString(),
            }).toString();
            await updateProfile({ avatar: newAvatar });
        } catch (error) {
            console.error('Failed to update avatar', error);
        } finally {
            setIsSaving(false);
        }
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Chat
                </Button>

                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Update your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
                                    <AvatarImage src={`data:image/svg+xml;utf8,${encodeURIComponent(profile.avatar)}`} />
                                    <AvatarFallback>{profile.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm" onClick={handleRegenerateAvatar} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                    Regenerate Avatar
                                </Button>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        disabled={isSaving}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>User ID</Label>
                                    <div className="text-xs font-mono bg-muted p-2 rounded text-muted-foreground break-all">
                                        {profile.uid}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 border-t p-4 flex justify-end">
                        <Button onClick={handleSave} disabled={isSaving || nickname === profile.nickname}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            Moderation
                        </CardTitle>
                        <CardDescription>Manage blocked users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blockedUsers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                <Ban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>You haven't blocked anyone yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {blockedUsers.map(uid => (
                                    <div key={uid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <span className="text-sm font-mono text-muted-foreground truncate max-w-[200px]">{uid}</span>
                                        <Button variant="ghost" size="sm" onClick={() => unblockUser(uid)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            Unblock
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
