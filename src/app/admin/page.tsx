'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LayoutDashboard,
    Flag,
    Users,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import AdminOverview from '@/components/admin/AdminOverview';
import ReportsList from '@/components/admin/ReportsList';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminPage() {
    const { profile, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Role protection
    if (!profile || profile.role !== 'admin') {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card px-4 h-16 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h1 className="font-bold text-xl tracking-tight">Admin Console</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium pr-1">System Live</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="overview" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="reports" className="gap-2">
                                <Flag className="h-4 w-4" />
                                <span className="hidden sm:inline">Reports</span>
                            </TabsTrigger>
                            <TabsTrigger value="users" className="gap-2">
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">Users</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-4">
                        <AdminOverview />
                    </TabsContent>

                    <TabsContent value="reports" className="space-y-4">
                        <ReportsList />
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <UserManagement />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
