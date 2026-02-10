
import { Shield, Zap, Globe, MessageSquareOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: Shield,
        title: "Total Anonymity",
        description: "No personal data collected. No phone numbers, emails, or logs. Just pure conversation."
    },
    {
        icon: Zap,
        title: "Instant Connection",
        description: "Start chatting in seconds. Just pick a username and jump into a room. No setup required."
    },
    {
        icon: Globe,
        title: "Global Community",
        description: "Meet people from over 100 countries. Connect, share cultures, and make international friends."
    },
    {
        icon: MessageSquareOff,
        title: "Ephemeral Messages",
        description: "Chats disappear automatically after 24 hours. No traces left behind on our servers."
    }
];

export default function FeatureGrid() {
    return (
        <section id="features" className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose VeloChat?</h2>
                    <p className="text-muted-foreground text-lg">
                        Designed for privacy, speed, and simplicity. Experience the freedom of anonymous chat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow bg-background/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
