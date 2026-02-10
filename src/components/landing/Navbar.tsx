
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">VeloChat</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                        Features
                    </Link>
                    <Link href="#safety" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                        Safety
                    </Link>
                    <Link href="#blog" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                        Blog
                    </Link>
                    <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
