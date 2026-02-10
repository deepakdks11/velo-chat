
import Link from 'next/link';
import { MessageCircle, Twitter, Github, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t py-12 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">VeloChat</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Connect instantly with people worldwide. No registration required. Safe, fast, and anonymous.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Globe className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Mobile App</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Safety Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} VeloChat. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
