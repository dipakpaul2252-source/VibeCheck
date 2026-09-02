# ⚡ VibeCheck — Real-Time Cultural RAG & Brainrot Translation Engine

> **The next-generation cultural linguist & humor synthesizer.** Convert corporate jargon into high-velocity Gen Z internet vernacular (and de-cringe internet slang back into formal English) using real-time generative AI, subculture lenses, crowdsourced community dictionaries, OCR screenshot scanning, and procedural audio.

---

## 🚀 Architecture Overview

VibeCheck is designed as a **hybrid, zero-bloat architecture** that eliminates fragile Docker, Redis, and multi-service bottlenecks while delivering real generative AI translations:

```mermaid
graph TD
    A[User Input / Screenshot OCR] --> B[Dual-Pane Workspace]
    B --> C[Instant Semantic Engine (0ms UI)]
    B --> D[Real AI Pipeline (OpenAI gpt-4o-mini / Serverless)]
    D --> E[Subculture & Intensity Prompt Injection]
    F[Community Slang DB & Verdicts] --> E
    E --> G[Structured JSON: Translation + Cringe Score + Anatomy Breakdown]
    G --> H[UI: Typewriter + Why-Its-Funny Drawer + Vibe Card]
```

1. **Client-First Responsiveness**: 
   - Instant 0ms preview from the built-in dictionary so typing feels lightning fast.
   - Background **Real AI Translation** dynamically synthesizes arbitrary sentences with nuanced cultural irony.
2. **Serverless AI Translation (`/api/translate`)**:
   - Runs seamlessly on **Vercel Serverless Functions** or local development.
   - Reads `OPENAI_API_KEY` directly from environment variables without exposing secrets to the browser.
3. **Decoupled Community Layer**:
   - Slang submissions, voting consensus, and dictionary promotions run through a reactive Zustand state layer with local persistence, ready to connect to any persistent cloud database (Supabase, Firebase, or PostgreSQL).

---

## 🧠 Real AI Translation Pipeline

VibeCheck uses an adaptive cultural linguist system prompt that dynamically tunes:
- **Brainrot Intensity Level (1 to 5)**:
  - **Level 1 (Casual)**: Subtle natural slang (`lowkey`, `bet`, `valid`, `hits different`).
  - **Level 2 (Social)**: Mainstream social discourse (`delulu`, `side-eye`, `rent-free`, `cap`).
  - **Level 3 (Hyper-Online)**: High-velocity viral slang (`lock in`, `cooked`, `crashout`, `aura points`, `let him cook`).
  - **Level 4 (High Irony)**: Meta-irony & looksmaxxing (`mewing streak`, `mogging`, `copium`, `caught in 4k`).
  - **Level 5 (Terminal Brainrot)**: Surreal absurdist brainrot (`skibidi`, `fanum tax`, `ohio rizz`, `level 10 gyatt`, `sigma`).
- **Subculture Lenses**: Tunes the tone for `Universal`, `Twitch / Gaming`, `Stan Culture`, `Gym / Fitness`, or `Tech Twitter`.
- **Active Community Slang Injection**: User-approved community slangs are dynamically passed into the AI's contextual knowledge window on every request.

---

## 👥 How Community Slang Posting & Future Expansion Works

### 1. Current In-App Community Workflow
- **Propose Slang**: Users with the rank of *Certified Trendsetter* (1,000+ Aura) can click **"PROPOSE SLANG"** to submit a term, context, and meaning via `SubmitSlangModal.tsx`.
- **Community Consensus Voting**: Submissions appear in the **Vibe Verdict Feed** (`VibeVerdictFeed.tsx`).
- **Automatic Promotion**: When a term receives at least 5 votes with $\ge 70\%$ approval, it is automatically promoted to the **Active Slang Dictionary** (`approvedSlangTerms`) and immediately fed into the real AI translation prompt!

### 2. How to Add Static Slang Manually
To add permanent predefined terms to the static dictionary, simply edit:
- **`src/data/slangDictionary.ts`**: Add new `SlangTerm` objects with definitions, origin, cringe scores, and velocity metrics.
- **`src/data/subcultures.ts`**: Add or modify subculture affixes, vocabulary, and tone rules.

### 3. How to Expand with a Persistent Global Database (e.g., Supabase / Firebase)
If you want all global users to share community posts, votes, and live leaderboards in real time:

1. **Option A: Supabase (PostgreSQL + Realtime)**
   - Create a table `slang_verdicts` with columns: `id`, `phrase`, `context`, `meaning`, `author`, `upvotes`, `downvotes`.
   - In `src/store/useVibeStore.ts`, replace the local `verdicts` array with Supabase queries:
     ```typescript
     import { createClient } from '@supabase/supabase-js';
     const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     
     // Fetch community posts
     const { data } = await supabase.from('slang_verdicts').select('*');
     ```
2. **Option B: Firebase Firestore**
   - Use Cloud Firestore collection `community_slang` with snapshot listeners for live real-time voting streams.

---

## 🚀 1-Click Deployment (Recommended)

### Option 1: Deploy to Vercel (Fastest & Free)
1. Push this repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository (Vercel automatically detects [`vercel.json`](file:///g:/Pritam/Software%20Engineering/Vibe%20Codes/VibeCheck/vercel.json) and the `/api/translate` serverless function).
4. **Add Environment Variable**:
   - `OPENAI_API_KEY`: Your OpenAI API key (e.g. `sk-...`).
5. Click **Deploy**. Your live web app and AI translation API will be running in under 30 seconds!

### Option 2: Deploy to Netlify
1. Go to [Netlify](https://app.netlify.com) and click **"Add new site"** -> **"Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Add `VITE_OPENAI_API_KEY` in Netlify Environment Variables.
5. Click **Deploy Site**.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure your .env file
# Ensure OPENAI_API_KEY or VITE_OPENAI_API_KEY is set

# 3. Start the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Project Structure

```
VibeCheck/
├── api/
│   └── translate.js           # Vercel serverless function for AI translation
├── src/
│   ├── components/
│   │   ├── gamification/      # Aura widgets, Leaderboards, SubmitSlangModal, VibeVerdictFeed
│   │   ├── layout/            # Navbar, Marquee banner
│   │   ├── ocr/               # Multimodal Screenshot Decoder
│   │   ├── telemetry/         # CringeRadar, VibeOMeter, SlangDetailModal
│   │   ├── translator/        # DualPaneWorkspace, BrainrotSlider, ShareCardModal, WhyItsFunnyDrawer
│   │   └── ui/                # Brutalist Buttons, Cards, Badges
│   ├── data/                  # Static Slang Dictionary & Subculture definitions
│   ├── lib/
│   │   ├── aiTranslator.ts    # Hybrid Real AI client & serverless bridge
│   │   ├── audioEffects.ts    # Procedural Web Audio synthesis engine
│   │   └── translatorEngine.ts# High-speed semantic dictionary fallback
│   ├── store/                 # Zustand state stores (useVibeStore)
│   └── types/                 # TypeScript interfaces
├── extension/                 # Chrome browser extension
├── vercel.json                # Vercel SPA + API routing
└── netlify.toml               # Netlify configuration
```

---

## 🛡️ License & Contributing

Built for internet culture linguists, developers, and memesters worldwide. Pull requests and new slang proposals are welcome!


