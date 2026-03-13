# Campus Connect
The Anonymous Social Hub for Engineering Students

## 01. Core Concept & Vision

Campus Connect is the all-in-one anonymous social hub built exclusively for engineering college students. It combines the best elements of peer connection, entertainment, and academic utility without revealing user identities. 

**The Core Problem:** Engineering students often face social anxiety, study isolation, immense academic pressure, and a lack of honest information regarding placements or professors. 
**Our Solution:** A single, completely anonymous platform where students can chat, confess, debate, find study partners, vent stress, and discover campus secrets without judgment or social consequences.

## 02. Key Features

- **Anonymous Random Chat:** Instant peer-to-peer pairing based on interest tags, college, and language. Includes Study, Vent, and Fun modes. Chat history is never saved.
- **Enhanced Confession Wall:** Post categorized confessions (Academics, Campus Secrets, Love/Crush). Features threading, upvoting, sticky trending sections, and screenshot protection.
- **Anonymous Blind Dating & Friendships:** Personality-first matching based on hobbies and humor. Zero photos or real names required. Optional identity reveal upon mutual agreement.
- **Study Buddy Matcher:** Academic matching based on branch, year, and study style. Form secure 5-person study rooms with synchronized Pomodoro timers and anonymous resource sharing.
- **Verified Placement & Internship Intel:** Share real interview questions and anonymous-yet-verified CTC numbers to help juniors prepare without the fear of company blacklisting.
- **Late Night Chat Rooms & Rant Room:** Topic-based ephemeral group chats (messages self-destruct after 24 hours) and a private stress-relief space for disappearing rants.
- **Polls, Live Debates & Q&A:** Vote on campus controversies, participate in live dual-sided debates, and share anonymous NGL-style Q&A links.
- **Meme Hub & Skill Exchange:** Upload engineering-specific memes with built-in templates, or trade skills (e.g., teaching Python in exchange for DSA help) completely anonymously.
- **Mental Health Check-In:** Private daily mood tracking stored strictly locally, peer support groups, and quick access to verified counseling resources.

## 03. Privacy & Safety Architecture

Anonymity is the foundation of Campus Connect. The platform ensures safety through multiple layers:
- **Identity Protection:** Phone OTP verification only (no email linkage), no profile pictures, and randomized usernames.
- **Data Security:** IP masking, end-to-end encrypted chats, and immediate chat history wiping post-session.
- **Anti-Abuse Systems:** AI-powered content moderation, rate limiting, community reporting, karma-based posting restrictions, and device-level bans.
- **Exclusivity:** College email domain verification ensures the platform remains strictly for students.

## 04. UI/UX Design Direction

The UI is designed to feel native to engineering students—a modern, dark, and energetic environment.
- **Theme:** Dark Cyberpunk (Deep dark backgrounds with neon green/blue accents).
- **Aesthetics:** Glassmorphism cards, grain textures, and neon glow effects on crucial call-to-actions.
- **Mobile-First Navigation:** Swipeable card stacks, floating action buttons, infinite scrolling, and bottom tab navigation optimized for one-touch smartphone usage. 

## 05. Gamification & Engagement

To sustain a highly engaging environment, the platform utilizes:
- **Achievement Badges:** Unlockable titles like "Night Owl", "Meme Lord", or "Trending" for active community participation.
- **Streaks:** Daily login bonuses, continuous study buddy sessions, and posting streaks.
- **Point System:** Earn points by helping peers or posting viral content, spendable on custom themes and priority matching.

## 06. Technical Architecture & Local Setup

While the conceptual vision supports broad microservices, the **current phase** is built on a highly performant, decoupled client-server architecture.

### Current Tech Stack
- **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Three.js
- **Backend:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL 15 
- **Caching & Real-time:** Redis 7, FastAPI WebSockets
- **DevOps:** Docker, Docker Compose, Celery (background tasks)

### Prerequisites
- Docker Engine & Docker Compose
- Node.js (v18+) for local frontend development
- Python 3.10+ for local backend development

### Quick Start (Docker Compose)
1. Ensure your `.env` files are configured in both the root and backend directories.
2. Build and start all orchestrated containers:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **API Docs:** http://localhost:8000/docs

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 07. Development Roadmap

- **Phase 1 (MVP):** Confessions feed, random 1-on-1 text chat, basic OTP authentication, core moderation.
- **Phase 2 (Growth):** Study Buddy matching, polls/debates, meme hub, gamification (points/badges).
- **Phase 3 (Scale):** Blind dating profiles, late-night group rooms, placement intel, advanced AI moderation.
- **Phase 4 (Expand):** Anonymous voice/video chat, AR filters, alumni integration, pan-India scaling.

## License
MIT License
