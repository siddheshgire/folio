# FOLIO — One Campus. One Library. Every Resource.

A modern, high-security academic collaboration platform designed for college students and their friends. Chat with total WhatsApp-style freedom, send voice notes, share notes and AI links, and organize all semester materials with zero file compression and Multi-Factor Authentication (MFA).

![FOLIO Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop)

---

## 🚀 Key Features

- **WhatsApp-Style Real-Time Chat**: Chat freely with your friend group with zero lag, double read receipts, and interactive emoji reactions.
- **Audio Voice Notes**: Record and send voice explanations with real-time waveform bars and adjustable playback speeds (`1x`, `1.5x`, `2x`).
- **Universal File Uploads**: Preserves bit-for-bit quality with zero compression for **PDF, PPT, PPTX, DOCX, ZIP, Code (Python, Java, C++, JS, SQL), and Images**.
- **Smart AI Link Previews**: Automatically parses and renders interactive cards for **ChatGPT, Google Gemini, Claude AI, and YouTube** shared links.
- **Dynamic Study Circles**: Create private study groups for semesters, subjects, or project teams.
- **Invite by Registered Email**: Add classmates directly by entering their registered email, assigning them `Member` or `Admin` privileges.
- **1-on-1 Direct Messaging**: Private end-to-end messaging with classmates and friends by email.
- **In-Browser Document Previewer**: Built-in PDF/document viewer with zoom controls (`50%` to `180%`), page navigation, rotation, and original file downloads.
- **Two-Factor Authentication (MFA)**: One-time 6-digit TOTP setup compatible with **Google Authenticator**, **Authy**, and **Apple Keychain**.
- **Next.js Edge Middleware**: Server-side session protection enforcing 7-day encrypted session cookies.
- **Mobile & Slow 4G Optimized**: Built with `100dvh` viewport height, mobile slide-over drawers, and network speed throttle detection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, Lucide React, Glassmorphism design tokens |
| **Realtime Sync** | `BroadcastChannel` API + Storage synchronization engine |
| **Security & Auth** | Supabase Auth, TOTP 2FA, Next.js Edge Middleware, Zod |
| **Storage & Database** | PostgreSQL, Row Level Security (RLS), SHA-256 Checksums |
| **Hosting (100% Free)** | Vercel Hobby + Supabase Free Tier |

---

## 📂 Project Structure

```
folio/
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Landing page
│   │   ├── (auth)/                # Register, Login, MFA verification
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/         # Student workspace & campus activity
│   │   │   ├── group/[id]/        # Real-time study circle workspace
│   │   │   └── dm/[id]/           # 1-on-1 private messaging thread
│   │   ├── api/uploads/           # Validated upload route handlers
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── groups/                # Chat feed, input, voice notes, sidebars
│   │   ├── viewer/                # In-browser PDF & document previewer
│   │   ├── upload/                # Full-screen dropzone & upload modal
│   │   └── layout/                # Navigation & network indicator
│   ├── lib/
│   │   ├── auth/                  # Sessions, cookies, and MFA verification
│   │   ├── groups/                # Study circle management
│   │   ├── chat/                  # Direct 1-on-1 chat store
│   │   ├── realtime/              # Cross-tab broadcast engine
│   │   └── utils/                 # Link previewer & file meta helpers
│   └── middleware.ts              # Edge route protection
├── supabase/
│   └── migrations/                # PostgreSQL schema with Row-Level Security
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/siddheshgire/folio.git
cd folio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 1-Click Free Tier Deployment (Vercel)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `folio` GitHub repository.
4. Add your environment variables from `.env.example`.
5. Click **"Deploy"** — your web application will be live on a `*.vercel.app` URL in under 2 minutes!

---

## 🔒 Security & Privacy Architecture

- **Row Level Security (RLS)**: PostgreSQL policies prevent unauthorized access to private friend group files.
- **Signed Download URLs**: File storage tokens expire in 15 minutes to prevent URL enumeration.
- **Deduplication**: Files are checked via client-side SHA-256 hashing to eliminate redundant uploads.
- **No Active Script Execution**: Uploaded HTML or script files are never executed in the application context.

---

## 📄 License

MIT License • Built for student communities & collaborative academic circles.
