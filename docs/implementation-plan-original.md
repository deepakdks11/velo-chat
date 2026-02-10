# Anonymous Chat Platform - Implementation Plan

A production-ready anonymous chat platform built with Next.js, Firebase, and AI-powered features, targeting $1-2K/month revenue at 5-10K MAU.

---

## User Review Required

> [!IMPORTANT]
> **Project Timeline**: 21-day initial development (14 days MVP + 7 days monetization)
> 
> **Budget Consideration**: This plan uses Firebase free tier initially, which supports 5-10K MAU. At 10K+ users, expect ~$50-100/month Firebase costs.

> [!IMPORTANT]
> **Domain & SEO**: You'll need to acquire a domain name (suggested: ChatVibe.com, AnonTalk.io, QuickChat.net). Budget ~$10-15/year.

> [!WARNING]
> **AdSense Approval**: Google AdSense requires quality content and traffic. Initial approval may take 1-2 weeks after launch. Consider backup monetization (direct ads) during approval period.

> [!IMPORTANT]
> **Security Phasing**: Advanced security features (AI moderation, device fingerprinting, Cloudflare Turnstile) are planned for Phase 3. Basic security (input sanitization, Firebase rules, HTTPS) will be implemented in MVP. Confirm if this phasing is acceptable.

> [!IMPORTANT]
> **API Keys Required**: You'll need to obtain:
> - Firebase project credentials (free)
> - OpenAI API key for moderation (~$20/month estimated)
> - Google AdSense account (free, approval required)
> - Cloudflare account (free tier sufficient)

---

## Proposed Changes

### Project Initialization

#### [NEW] [package.json](file:///c:/Users/Axel/velo-chat/package.json)

Initialize Next.js 14 project with required dependencies:

```json
{
  "name": "velo-chat",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.8.0",
    "dompurify": "^3.0.8",
    "@dicebear/core": "^7.0.0",
    "@dicebear/collection": "^7.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "lucide-react": "^0.323.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/dompurify": "^3.0.5",
    "typescript": "^5",
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0"
  }
}
```

**Key dependencies**:
- **Next.js 14**: App Router for modern React development
- **Firebase SDK**: Realtime Database, Firestore, Anonymous Auth
- **DOMPurify**: XSS prevention via input sanitization
- **DiceBear**: Avatar generation API
- **shadcn/ui components**: Via manual installation (Tailwind dependencies included)

---

### Core Infrastructure Setup

#### [NEW] [firebase.config.ts](file:///c:/Users/Axel/velo-chat/src/lib/firebase.config.ts)

Firebase initialization with environment variable configuration:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
```

#### [NEW] [.env.local.example](file:///c:/Users/Axel/velo-chat/.env.local.example)

Environment variable template for Firebase and API keys.

#### [NEW] [tailwind.config.ts](file:///c:/Users/Axel/velo-chat/tailwind.config.ts)

Tailwind CSS configuration optimized for shadcn/ui components.

---

### Authentication System

#### [NEW] [useAuth.ts](file:///c:/Users/Axel/velo-chat/src/hooks/useAuth.ts)

Custom hook for Firebase Anonymous Authentication with session persistence:

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Anonymous sign-in
  // Session persistence with localStorage
  // Profile setup (nickname, gender, country)
  // Avatar generation via DiceBear
}
```

#### [NEW] [ProfileSetup.tsx](file:///c:/Users/Axel/velo-chat/src/components/auth/ProfileSetup.tsx)

User profile creation interface with nickname, gender, and country selection.

---

### Real-Time Chat Foundation

#### [NEW] [useChatRoom.ts](file:///c:/Users/Axel/velo-chat/src/hooks/useChatRoom.ts)

Real-time chat subscription and message handling:

```typescript
export function useChatRoom(roomId: string) {
  // Real-time message subscription
  // Send message functionality
  // Typing indicators
  // Online user presence
}
```

#### [NEW] [ChatRoom.tsx](file:///c:/Users/Axel/velo-chat/src/components/chat/ChatRoom.tsx)

Main chat interface component with message list, input, and online users.

**Firebase Realtime Database Structure**:
```json
{
  "rooms": {
    "{roomId}": {
      "messages": {
        "{messageId}": {
          "uid": "string",
          "name": "string",
          "text": "string",
          "ts": "number",
          "country": "string",
          "gender": "string"
        }
      },
      "typing": { "{uid}": "timestamp" },
      "online": {
        "{uid}": {
          "name": "string",
          "country": "string",
          "avatar": "string"
        }
      }
    }
  }
}
```

#### [NEW] [MessageInput.tsx](file:///c:/Users/Axel/velo-chat/src/components/chat/MessageInput.tsx)

Message input component with:
- DOMPurify sanitization
- Character limit (500 chars)
- Client-side rate limiting (1 msg/second)
- Typing indicator emission

---

### Room Management

#### [NEW] [RoomList.tsx](file:///c:/Users/Axel/velo-chat/src/components/rooms/RoomList.tsx)

Room directory with categorization:
- Topic-based rooms (General, Tech, Gaming, Music, etc.)
- Country-based rooms (USA, UK, India, etc.)
- Language-specific rooms (English, Spanish, etc.)
- Age-group rooms (18-24, 25-34, 35+)

#### [NEW] [RoomCard.tsx](file:///c:/Users/Axel/velo-chat/src/components/rooms/RoomCard.tsx)

Individual room display with active user count and capacity limit (200 max).

**Firestore Rooms Collection**:
```typescript
interface Room {
  id: string;
  name: string;
  category: 'topic' | 'country' | 'language' | 'age';
  activeUsers: number;
  maxUsers: 200;
  createdAt: Timestamp;
}
```

---

### Private Messaging System

#### [NEW] [usePrivateMessage.ts](file:///c:/Users/Axel/velo-chat/src/hooks/usePrivateMessage.ts)

Private conversation management:

```typescript
export function usePrivateMessage() {
  // Send PM request (pending acceptance)
  // Accept/decline PM requests
  // Real-time PM subscription
  // Multiple concurrent conversations
  // Notification badge counts
}
```

**Realtime Database PM Structure**:
```json
{
  "private": {
    "{uid1}_{uid2}": {
      "participants": ["uid1", "uid2"],
      "status": "accepted",
      "messages": {
        "{messageId}": {
          "uid": "string",
          "text": "string",
          "ts": "number"
        }
      }
    }
  }
}
```

#### [NEW] [PrivateMessageList.tsx](file:///c:/Users/Axel/velo-chat/src/components/pm/PrivateMessageList.tsx)

List of active private conversations with unread badges.

#### [NEW] [PrivateChat.tsx](file:///c:/Users/Axel/velo-chat/src/components/pm/PrivateChat.tsx)

Private chat interface similar to public chat but with 1-on-1 messaging.

---

### User Presence & Typing Indicators

#### [NEW] [OnlineUsersList.tsx](file:///c:/Users/Axel/velo-chat/src/components/chat/OnlineUsersList.tsx)

Real-time online users display with:
- User avatar (DiceBear)
- Nickname and country flag
- Sorting options (newest, country, gender)
- Click to initiate PM

#### [NEW] [usePresence.ts](file:///c:/Users/Axel/velo-chat/src/hooks/usePresence.ts)

Presence detection using Firebase onDisconnect:

```typescript
export function usePresence(roomId: string) {
  // Set user online on mount
  // Remove user on disconnect
  // Update last active timestamp
}
```

#### [NEW] [TypingIndicator.tsx](file:///c:/Users/Axel/velo-chat/src/components/chat/TypingIndicator.tsx)

Display "User is typing..." with debounced updates (500ms).

---

### Moderation & Safety (Phase 1 - Basic)

#### [NEW] [useModeration.ts](file:///c:/Users/Axel/velo-chat/src/hooks/useModeration.ts)

Basic moderation functionality:

```typescript
export function useModeration() {
  // Block user (add to local blocklist)
  // Report user (increment report count in Firestore)
  // Check if user is blocked
}
```

**Firestore Users Collection**:
```typescript
interface User {
  uid: string;
  nickname: string;
  country: string;
  gender: string;
  blockedUsers: string[];
  reportedBy: string[];
  isBanned: boolean;
  messageCount: number;
  lastActive: Timestamp;
}
```

#### [NEW] [profanityFilter.ts](file:///c:/Users/Axel/velo-chat/src/lib/profanityFilter.ts)

Client-side profanity detection (basic word list) with warning before send.

---

### UI Components (shadcn/ui)

Manual installation of shadcn/ui components:

#### [NEW] [components/ui/button.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/button.tsx)
#### [NEW] [components/ui/input.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/input.tsx)
#### [NEW] [components/ui/avatar.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/avatar.tsx)
#### [NEW] [components/ui/badge.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/badge.tsx)
#### [NEW] [components/ui/dialog.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/dialog.tsx)
#### [NEW] [components/ui/tabs.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/tabs.tsx)
#### [NEW] [components/ui/toast.tsx](file:///c:/Users/Axel/velo-chat/src/components/ui/toast.tsx)

Pre-built accessible components for rapid UI development.

---

### Page Structure

#### [NEW] [app/layout.tsx](file:///c:/Users/Axel/velo-chat/src/app/layout.tsx)

Root layout with:
- Font configuration (Inter from Google Fonts)
- Global styles
- Metadata for SEO
- Analytics script (Phase 2)

#### [NEW] [app/page.tsx](file:///c:/Users/Axel/velo-chat/src/app/page.tsx)

Landing page with:
- Hero section promoting anonymous chat
- Feature highlights
- Room directory preview
- CTA to "Start Chatting Now"

#### [NEW] [app/chat/[roomId]/page.tsx](file:///c:/Users/Axel/velo-chat/src/app/chat/[roomId]/page.tsx)

Dynamic room page with chat interface.

#### [NEW] [app/settings/page.tsx](file:///c:/Users/Axel/velo-chat/src/app/settings/page.tsx)

User settings:
- Change nickname/avatar
- Blocked users management
- Favorite rooms
- Notification preferences

---

### Firebase Security Rules (Phase 1 - Basic)

#### [NEW] [database.rules.json](file:///c:/Users/Axel/velo-chat/database.rules.json)

Realtime Database security rules:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null",
          "$messageId": {
            ".validate": "newData.hasChildren(['uid', 'name', 'text', 'ts']) && newData.child('text').val().length <= 500"
          }
        },
        "online": {
          ".read": "auth != null",
          ".write": "$uid == auth.uid"
        }
      }
    },
    "private": {
      "$conversationId": {
        ".read": "auth != null && $conversationId.contains(auth.uid)",
        ".write": "auth != null && $conversationId.contains(auth.uid)"
      }
    }
  }
}
```

#### [NEW] [firestore.rules](file:///c:/Users/Axel/velo-chat/firestore.rules)

Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

### Revenue Integration (Phase 2)

#### [NEW] [AdSenseScript.tsx](file:///c:/Users/Axel/velo-chat/src/components/ads/AdSenseScript.tsx)

Google AdSense initialization script component.

#### [NEW] [AdUnit.tsx](file:///c:/Users/Axel/velo-chat/src/components/ads/AdUnit.tsx)

Reusable ad placement component with responsive sizing:

```typescript
interface AdUnitProps {
  slot: string;
  format: 'horizontal' | 'vertical' | 'rectangle' | 'native';
  className?: string;
}
```

**Ad Placements**:
- Desktop: Header banner (728x90), sidebar (300x250), native ads every 20 messages
- Mobile: Top banner (320x50), native ads every 15 messages, sticky footer (320x50)

#### [NEW] [useAdTracking.ts](file:///c:/Users/Axel/velo-chat/src/hooks/useAdTracking.ts)

Custom ad impression and click tracking for analytics.

#### [NEW] [api/ads/track/route.ts](file:///c:/Users/Axel/velo-chat/src/app/api/ads/track/route.ts)

Edge Function for ad analytics:

```typescript
export async function POST(request: Request) {
  const { adId, event, userId } = await request.json();
  
  // Track impression or click in Firestore
  // Update ad budget
  // Return success
}
```

**Firestore Ads Collection**:
```typescript
interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  targetUrl: string;
  impressions: number;
  clicks: number;
  budget: number;
  active: boolean;
}
```

---

### Analytics Dashboard (Phase 2)

#### [NEW] [app/admin/analytics/page.tsx](file:///c:/Users/Axel/velo-chat/src/app/admin/analytics/page.tsx)

Admin analytics dashboard with:
- Real-time user metrics (DAU, MAU)
- Revenue breakdown (AdSense + custom ads)
- Geographic distribution charts
- Peak usage times
- Moderation statistics

#### [NEW] [api/analytics/route.ts](file:///c:/Users/Axel/velo-chat/src/app/api/analytics/route.ts)

Analytics API endpoint aggregating Firestore data.

---

### AI Enhancement (Phase 3)

#### [NEW] [api/moderate/route.ts](file:///c:/Users/Axel/velo-chat/src/app/api/moderate/route.ts)

OpenAI Moderation API integration:

```typescript
export async function POST(request: Request) {
  const { text, userId } = await request.json();
  
  // Call OpenAI Moderation API
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text })
  });
  
  const moderation = await response.json();
  const flagged = moderation.results[0].flagged;
  
  if (flagged) {
    // Increment user violations
    // Auto-ban after 3 strikes
    // Return rejection
  }
  
  return { approved: true };
}
```

**Escalating Warning System**:
1. Violation 1: Warning message
2. Violation 2: 1-hour mute
3. Violation 3+: Shadow ban (messages hidden from others)

#### [NEW] [CloudFunctions/cleanupMessages.ts](file:///c:/Users/Axel/velo-chat/functions/src/cleanupMessages.ts)

Cloud Function for ephemeral messaging:

```typescript
export const cleanupOldMessages = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    // Delete messages older than 24 hours
  });
```

---

### SEO & Metadata

#### [MODIFY] [app/layout.tsx](file:///c:/Users/Axel/velo-chat/src/app/layout.tsx)

Add comprehensive metadata:

```typescript
export const metadata: Metadata = {
  title: 'VeloChat - Free Anonymous Chat Rooms',
  description: 'Join free anonymous chat rooms instantly. No signup required. Safe, private messaging with users worldwide.',
  keywords: 'anonymous chat, free chat rooms, private messaging, online chat',
  openGraph: {
    title: 'VeloChat - Free Anonymous Chat',
    description: 'Join thousands in anonymous chat rooms',
    type: 'website',
    url: 'https://velochat.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VeloChat - Anonymous Chat',
    description: 'Free anonymous chat rooms',
  }
};
```

#### [NEW] [app/robots.txt](file:///c:/Users/Axel/velo-chat/public/robots.txt)
#### [NEW] [app/sitemap.xml](file:///c:/Users/Axel/velo-chat/public/sitemap.xml)

SEO optimization files.

---

### Deployment Configuration

#### [NEW] [vercel.json](file:///c:/Users/Axel/velo-chat/vercel.json)

Vercel deployment configuration:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000"
        }
      ]
    }
  ]
}
```

#### [NEW] [next.config.js](file:///c:/Users/Axel/velo-chat/next.config.js)

Next.js configuration with security headers and image optimization.

---

### Documentation

#### [NEW] [README.md](file:///c:/Users/Axel/velo-chat/README.md)

Comprehensive project documentation covering:
- Setup instructions
- Environment variables
- Firebase configuration
- Development workflow
- Deployment process

#### [NEW] [SECURITY.md](file:///c:/Users/Axel/velo-chat/SECURITY.md)

Security documentation covering implemented measures and planned enhancements.

---

## Verification Plan

### Automated Tests

**Phase 1 Testing**:
```bash
# Build verification
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

**Phase 3 Testing** (Post-Launch):
- Jest unit tests for hooks and utilities
- Playwright E2E tests for critical flows:
  - Anonymous authentication
  - Joining a room
  - Sending messages
  - Initiating private messages
  - Blocking a user

### Manual Verification

**Phase 1 (MVP)**:
1. ✅ Anonymous authentication works across browser sessions
2. ✅ Real-time messages appear instantly for all users
3. ✅ Typing indicators update correctly
4. ✅ Private message requests work (accept/decline)
5. ✅ User blocking prevents message visibility
6. ✅ Room capacity limits enforced (200 max)
7. ✅ Responsive design on mobile devices
8. ✅ Performance acceptable with 50+ concurrent users in room

**Phase 2 (Revenue)**:
1. ✅ AdSense ads display correctly on all devices
2. ✅ Ad placements don't disrupt chat UX
3. ✅ Impression and click tracking accurate
4. ✅ Custom ad rotation works
5. ✅ Analytics dashboard shows real-time metrics

**Phase 3 (AI Enhancement)**:
1. ✅ OpenAI moderation flags toxic messages
2. ✅ 3-strike system bans repeat offenders
3. ✅ Shadow ban hides messages from others
4. ✅ Messages auto-delete after 24 hours
5. ✅ Appeal system allows user submissions

### Load Testing

**Simulate 10K concurrent users**:
```bash
# Using k6 or Artillery
k6 run load-test.js --vus 10000 --duration 5m
```

**Metrics to monitor**:
- Message delivery latency (<500ms)
- Firebase connection limits
- Database read/write quotas
- Edge Function execution times

### Security Testing

**OWASP ZAP scan**:
```bash
zap-cli quick-scan https://velochat.com
```

**Test cases**:
- XSS injection attempts in messages
- CSRF on PM requests
- SQL injection in room IDs (should fail - NoSQL)
- Rate limit bypass attempts
- Session hijacking attempts

---

## Post-Implementation Steps

1. **Domain Setup**: Acquire domain and configure DNS with Vercel
2. **Firebase Project**: Create production Firebase project with billing enabled (Blaze plan)
3. **API Keys**: Obtain and configure all required API keys
4. **AdSense Application**: Apply for Google AdSense account
5. **Cloudflare**: Configure CDN and DDoS protection
6. **Monitoring**: Set up error tracking (Sentry) and uptime monitoring
7. **Backup Original Plan**: Save this implementation plan to `docs/implementation-plan-original.md` and add to `.gitignore`
