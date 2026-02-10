import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip } from 'lucide-react';
import DOMPurify from 'dompurify';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageInputProps {
    onSendMessage: (text: string, type?: 'text' | 'image') => void;
    onTyping: (isTyping: boolean) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSendMessage, onTyping, disabled }: MessageInputProps) {
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        handleTyping();
    };

    const handleTyping = () => {
        onTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false);
        }, 1000);
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
        handleTyping();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // For MVP: Convert to base64/data URL or use a placeholder
            // In a real app, upload to storage and get URL
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Check if the string is too long for Realtime Database (which serves as our backend here)
                // Firebase RTDB has a limit, but for small images or testing it might work.
                // Better approach for MVP without storage: user a placeholder or just send it if small.
                // Let's try sending the data URL. If it fails, we'll know.
                onSendMessage(base64String, 'image');
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || disabled) return;

        // Sanitize
        const cleanText = DOMPurify.sanitize(text.trim());

        if (cleanText) {
            onSendMessage(cleanText, 'text');
        }

        setText('');
        onTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    return (
        <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
            {showEmojiPicker && (
                <div className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl" ref={pickerRef}>
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={Theme.AUTO}
                        width={300}
                        height={400}
                    />
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <form onSubmit={handleSubmit} className="flex gap-2 items-center max-w-4xl mx-auto relative">
                <div className="flex gap-1 absolute left-2 z-10">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 text-muted-foreground hover:text-primary ${showEmojiPicker ? 'text-primary bg-muted' : ''}`}
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile className="h-5 w-5" />
                                    <span className="sr-only">Add Emoji</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add Emoji</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="h-5 w-5" />
                                    <span className="sr-only">Attach File</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Attach Image</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Input
                    ref={inputRef}
                    value={text}
                    onChange={handleChange}
                    placeholder="Type a message..."
                    disabled={disabled}
                    maxLength={500}
                    className="flex-1 pl-20 pr-12 h-12 rounded-full border-muted-foreground/20 focus-visible:ring-primary/20 transition-all shadow-sm"
                />

                <div className="absolute right-2 z-10">
                    <Button
                        type="submit"
                        disabled={!text.trim() || disabled}
                        size="icon"
                        className="h-8 w-8 rounded-full transition-all"
                        variant={text.trim() ? "default" : "ghost"}
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </form>
            <div className="text-center mt-2">
                <p className="text-[10px] text-muted-foreground">
                    Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Enter</kbd> to send
                </p>
            </div>
        </div>
    );
}
