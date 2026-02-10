'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-background rounded-lg border shadow-sm m-4">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
                        <AlertTriangle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        We're sorry, but the application encountered an unexpected error.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="default"
                        >
                            Reload Page
                        </Button>
                        <Button
                            onClick={() => this.setState({ hasError: false })}
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
