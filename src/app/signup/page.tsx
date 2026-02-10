
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate signup
        setTimeout(() => {
            setLoading(false);
            console.log("Signup attempt", { name, email, password });
            alert("Registration coming soon! Use Guest mode for now.");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                        <MessageCircle className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold tracking-tight">VeloChat</span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-muted-foreground mt-2">Join the community to save your profile and friends</p>
                </div>

                <Card className="border-muted bg-card/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="name">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your nickname"
                                        className="pl-9"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters long
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Create account"}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" disabled>Github</Button>
                            <Button variant="outline" type="button" disabled>Google</Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4 text-sm text-muted-foreground border-t bg-muted/20 py-4">
                        <div>
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
