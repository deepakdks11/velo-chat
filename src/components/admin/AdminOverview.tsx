'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Hash, AlertTriangle } from 'lucide-react';

export default function AdminOverview() {
    // In a real app, these would come from an API/Firestore count
    const stats = [
        { title: 'Total Users', value: '1,234', icon: Users, description: '+20% from last month' },
        { title: 'Active Rooms', value: '42', icon: Hash, description: '12 high activity' },
        { title: 'Pending Reports', value: '5', icon: AlertTriangle, description: 'Requires attention' },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
