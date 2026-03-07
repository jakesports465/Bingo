# Mafia Wars Underground

Browser-based RPG. Rise from street punk to Don of all Dons.

## Project Structure

```
mafia-wars/
├── index.html      # Main page (auth screen, game shell, script loading)
├── style.css       # All styles (desktop + mobile responsive + auth)
├── data.js         # Game data (562 jobs, 38 enemies, 52 weapons, etc.)
├── engine.js       # Core mechanics (save/load, XP, leveling, utilities)
├── panels.js       # UI panels (28 game screens, all build/do functions)
├── auth.js         # Supabase auth + cloud save sync
├── favicon.svg     # Tab icon
└── README.md       # This file
```

---

## Quick Start (Local Only — No Account System)

Just open `index.html` in a browser. It works offline with localStorage saves. No server needed.

To host on GitHub Pages:
1. Push all files to a GitHub repo
2. Go to Settings → Pages → Source: main branch
3. Your game is live at `https://yourusername.github.io/repo-name/`

---

## Cloud Save Setup (Supabase)

This adds sign-in/sign-up so you can play on any device and your save syncs to the cloud.

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier works fine)
2. Click **New Project**
3. Name it `mafia-wars` (or whatever you want)
4. Set a database password (save this somewhere)
5. Choose the region closest to you
6. Click **Create new project** and wait ~2 minutes

### Step 2: Create the Database Table

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this SQL and click **Run**:

```sql
-- Game saves table
CREATE TABLE game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  save_data TEXT NOT NULL,
  name TEXT DEFAULT 'Unknown',
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Users can only read their own saves
CREATE POLICY "Users read own saves"
  ON game_saves FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own saves
CREATE POLICY "Users insert own saves"
  ON game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own saves
CREATE POLICY "Users update own saves"
  ON game_saves FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own saves
CREATE POLICY "Users delete own saves"
  ON game_saves FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
```

You should see "Success. No rows returned" — that means it worked.

### Step 3: Configure Auth Settings

1. In Supabase dashboard, click **Authentication** in the left sidebar
2. Click **Providers** tab
3. Make sure **Email** is enabled (it should be by default)
4. Under **Email Auth**, you can optionally:
   - Turn OFF "Confirm email" if you want instant sign-up (recommended for a game)
   - Set minimum password length to 6

To disable email confirmation:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle OFF **Confirm email**
3. Click **Save**

### Step 4: Get Your API Keys

1. In Supabase dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** under Configuration
3. You need two values:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon public key** — a long string starting with `eyJ...`

### Step 5: Update auth.js

Open `auth.js` and replace the two placeholder values at the top:

```javascript
// BEFORE:
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// AFTER (example — use YOUR values):
const SUPABASE_URL = 'https://abcdefghijkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 6: Push to GitHub

```bash
git add .
git commit -m "Add cloud saves with Supabase auth"
git push
```

### Step 7: Test It

1. Open your GitHub Pages URL
2. Click **ENTER THE FAMILY**
3. You should see the sign-in screen
4. Create an account with any email/password
5. Play the game — saves sync to the cloud every 60 seconds
6. Open the same URL on another device, sign in with the same account
7. Your save loads from the cloud

---

## How Cloud Saves Work

- **Auto-sync**: Every 60 seconds, your local save pushes to Supabase
- **On load**: When you sign in, it pulls your cloud save
- **Conflict resolution**: If both a local and cloud save exist, it asks which to keep
- **Guest mode**: Click "Play as Guest" to skip sign-in (local save only, no sync)
- **Offline play**: The game still works offline — it syncs when you're back online
- **Save data**: Your entire game state (level, cash, inventory, everything) is stored as one JSON blob

---

## Mobile Support

The game is responsive and works on phones/tablets:
- Navigation becomes a horizontal scrollable bar at the top
- Panels stack vertically
- Touch-friendly button sizing
- Add to home screen for app-like experience on iOS/Android

---

## Troubleshooting

**"Sign up not working"**
→ Check if email confirmation is enabled in Supabase. Disable it for instant registration.

**"Save not syncing"**
→ Check browser console (F12) for errors. Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct.

**"Game loads but auth screen doesn't show"**
→ The Supabase CDN script might be blocked. Check if `https://cdn.jsdelivr.net` is accessible.

**"I want to reset my cloud save"**
→ Use the in-game Save Manager → Wipe Save. This clears local storage. Then sign out and sign back in.

**"CORS errors in console"**
→ Supabase handles CORS automatically for the anon key. Make sure you're using the anon key, not the service key.

---

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no framework, no build step)
- **Backend**: Supabase (PostgreSQL + Auth + REST API)
- **Hosting**: GitHub Pages (free static hosting)
- **Save format**: JSON in localStorage + Supabase `game_saves` table
