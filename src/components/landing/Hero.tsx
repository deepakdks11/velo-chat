
import AuthCard from './AuthCard';

interface HeroProps {
    onGuestLogin: (data: any) => void;
    loading?: boolean;
}

export default function Hero({ onGuestLogin, loading }: HeroProps) {
    return (
        <div className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-32">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-6">
                        <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors cursor-default">
                            🚀  Wait-less, frictionless chatting
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                            Chat Anonymously. <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                Connect Instantly.
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                            Join thousands of real people in free chat rooms. No registration, no logs, no hassle. Just pure connection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                5,423 Users Online
                            </div>
                            <div className="hidden sm:block text-muted-foreground">•</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                                120+ Chat Rooms
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto lg:max-w-none lg:ml-auto">
                        <AuthCard onGuestLogin={onGuestLogin} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
