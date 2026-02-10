
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, LogIn, UserPlus, Ghost } from 'lucide-react';

interface AuthCardProps {
    onGuestLogin: (data: { nickname: string, gender: 'male' | 'female' | 'other', country: string }) => void;
    loading?: boolean;
}

export default function AuthCard({ onGuestLogin, loading }: AuthCardProps) {
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
    const [country, setCountry] = useState('United States');

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting guest login:", { nickname, gender, country });
        if (nickname.trim()) {
            onGuestLogin({ nickname, gender, country });
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Start Chatting</CardTitle>
                <CardDescription>Join the conversation instantly</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="guest" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="guest">Guest</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Join</TabsTrigger>
                    </TabsList>

                    <TabsContent value="guest">
                        <form onSubmit={handleGuestSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Username
                                </label>
                                <div className="relative">
                                    <Ghost className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Choose a cool nickname"
                                        className="pl-9"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        required
                                        minLength={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Gender</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${gender === 'male' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-accent'}`}>
                                        <input type="radio" name="gender" value="male" className="sr-only" checked={gender === 'male'} onChange={() => setGender('male')} />
                                        <span>Male</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${gender === 'female' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-accent'}`}>
                                        <input type="radio" name="gender" value="female" className="sr-only" checked={gender === 'female'} onChange={() => setGender('female')} />
                                        <span>Female</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all ${gender === 'other' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-accent'}`}>
                                        <input type="radio" name="gender" value="other" className="sr-only" checked={gender === 'other'} onChange={() => setGender('other')} />
                                        <span>Other</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Country</label>
                                <div className="relative">
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                        <option value="India">India</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Global">Global / Other</option>
                                    </select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 text-lg mt-2" disabled={loading}>
                                {loading ? "Connecting..." : "Start Chatting Now"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="login">
                        <div className="space-y-4 py-4 text-center">
                            <p className="text-muted-foreground">
                                Already have an account? Log in to access your friends list and saved rooms.
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <a href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login with Email
                                </a>
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="register">
                        <div className="space-y-4 py-4 text-center">
                            <p className="text-muted-foreground">
                                Create an account to reserve your nickname and customize your profile.
                            </p>
                            <Button variant="secondary" className="w-full" asChild>
                                <a href="/signup">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Free Account
                                </a>
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
                <p className="text-xs text-muted-foreground">
                    By clicking Start, you agree to our Terms & Privacy Policy.
                </p>
            </CardFooter>
        </Card>
    );
}
