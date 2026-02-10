export const BAD_WORDS = [
    'badword', 'offensive', 'spam', // Add real list as needed
    'abuse', 'hate', 'kill', 'attack'
];

export function containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerText.includes(word));
}

export function censorProfanity(text: string): string {
    let censoredTeam = text;
    BAD_WORDS.forEach(word => {
        const regex = new RegExp(word, 'gi');
        censoredTeam = censoredTeam.replace(regex, '*'.repeat(word.length));
    });
    return censoredTeam;
}
