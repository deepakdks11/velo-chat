'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Implement search logic
        console.log('Searching for:', searchTerm);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Search and manage user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Search by UID or Nickname..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    Search for a user to manage their account status.
                </div>
            </CardContent>
        </Card>
    );
}
