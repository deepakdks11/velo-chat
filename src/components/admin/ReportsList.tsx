'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase.config';
import { ref, onValue, remove, update } from 'firebase/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Ban } from 'lucide-react';
import { useModeration } from '@/hooks/useModeration';
import { Badge } from '@/components/ui/badge';

interface Report {
    id: string;
    reporter: string;
    target: string;
    reason: string;
    timestamp: number;
    status: 'pending' | 'resolved' | 'dismissed';
}

export default function ReportsList() {
    const [reports, setReports] = useState<Report[]>([]);
    const { blockUser } = useModeration();

    useEffect(() => {
        const reportsRef = ref(db, 'reports');
        const unsubscribe = onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedReports = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val
                })).filter((r: Report) => r.status === 'pending');
                setReports(loadedReports);
            } else {
                setReports([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDismiss = async (reportId: string) => {
        const reportRef = ref(db, `reports/${reportId}`);
        await update(reportRef, { status: 'dismissed' });
    };

    const handleBan = async (reportId: string, targetUid: string) => {
        await blockUser(targetUid); // In a real admin scenario, this would be a global ban, not just local block.
        // For this MVP, we'll mark as resolved and maybe add a "banned" flag to the user in Firestore if we had that logic ready.
        const reportRef = ref(db, `reports/${reportId}`);
        await update(reportRef, { status: 'resolved' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Review and action user reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reports.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-4">No pending reports.</p>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive">{report.reason}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(report.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm">
                                        Target: <span className="font-mono bg-muted px-1 rounded">{report.target}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Reporter: {report.reporter}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleDismiss(report.id)}>
                                        <Check className="h-4 w-4 mr-1" /> Dismiss
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleBan(report.id, report.target)}>
                                        <Ban className="h-4 w-4 mr-1" /> Ban
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
