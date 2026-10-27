# Pathora MVP build file
**Your Future, Your Path** | Presented by Find My Career

How to use this file
1. **Part A** → paste the four prompts into **Lovable**, one at a time, in order. You get a full working UI with a demo mode.
2. **Part B** → sync the Lovable project to GitHub, open it in **Antigravity**, and give it the handoff prompt. It connects the UI to the real Node.js + MySQL backend (the `pathora-mvp.zip` you already have).
3. **Part C** → your start-to-end demo script (report and portal).

The whole UI talks to one file, `src/lib/api.ts`, with a `USE_MOCK` switch. That is what makes the Lovable → Antigravity handoff clean.

---

# PART A: Lovable prompts

## Prompt 1: Foundation, design and mock engine
```
Build "Pathora", a mobile-first web app (it must also look great on desktop). Tagline: "Your Future, Your Path". It helps people in Gulf countries discover a career direction through a short, options-only, adaptive questionnaire, then sells a personalised report and gives portal access with staff chat.

STACK: React + TypeScript + Tailwind + shadcn/ui + react-router. NO backend, NO Supabase, NO auth provider yet. All data is mocked in the browser (localStorage).

CRITICAL ARCHITECTURE: every data call goes through ONE file, src/lib/api.ts, exporting async functions with exactly these names and shapes, controlled by `const USE_MOCK = true` and `VITE_API_URL`:
- createSession(ageBand) -> { sessionId }
- getNextQuestion(sessionId) -> { done:true } | { question:{id,prompt,options:[{id,label}]}, progress:number }
- submitAnswer(sessionId, questionId, optionId) -> { ok:true }
- getTeaser(sessionId) -> { teaser:string, price:number, currency:string }
- checkout(sessionId, {name,email,phone,country,consent}) -> { username, password, portalUrl, report }
- login(username,password) -> { token }
- getReport() -> Report
- getChat() -> Message[]   sendChat(body) -> { ok:true }
- staff: getStaffChats(), staffReply(accountId, body)
Mock mode implements these with the engine and data below. Real mode will call `${VITE_API_URL}/api/...` later.

DESIGN SYSTEM
- Colors: deep #0B3C49, teal #0E7C86, gold #D9A441, light #EAF2F3, ink #10252E, white. Teal is primary, gold is for key call-to-action (unlock/pay).
- Fonts: headings "Lora" (serif), body "Inter". Arabic: "Cairo".
- Rounded-2xl cards, soft shadows, 16px+ body text, big tap targets (min 48px), friendly and premium feel.
- Header: "Pathora" wordmark in teal and an EN | العربية toggle (the toggle is visual for now; plan for RTL).
- Footer note on every page: "Presented by Find My Career". Leave a clearly marked logo slot component <FmcLogo /> that shows text "Find My Career" for now and can be swapped for an image later.

MOCK ENGINE (put in src/lib/engine.ts and src/data/questions.ts, exactly this logic)
Domains: tech, business, health, creative, service. Careers: tech [Software Engineer, Data & AI Specialist, Cybersecurity Analyst]; business [Entrepreneur / Founder, Business & Product Manager, Finance & Investment]; health [Healthcare Professional, Health-Tech Specialist, Sports & Wellness Coach]; creative [UX / Visual Designer, Media & Content Creator, Marketing & Brand Strategist]; service [Teacher & Trainer, HR & Career Counsellor, Public Sector & Social Impact].
State: { ageBand, stage, goal, fit, maturity, scores{domain:number} }.
Rules: age band only sets the start; the next question = lowest `ord` unanswered question whose `requires` matches the state (every key's value must be in the listed array). Stop after 7 answers or when none match. Applying an option: merge `sets` into state; add each `weights` value to scores (key `_mat` adds to maturity).
Teaser = first letter of the top two careers + "••••••" joined with " & " (e.g. "S•••••• & D••••••").
Report = { profile ("Mature planner" if maturity>=2, "Explorer" if goal==="none", else "Focused learner"), top: top 3 domains → {domain, career (first career), match% = score/maxScore*100}, pathway (text by stage: school "Choose a stream or foundation programme that leads to X, then a degree." / degree "Add a certification or postgraduate study to move into X." / work "Grow in your field and add a certification toward X." (if fit==="switch": "Switch step by step: short course, portfolio, then a first role as X.") / business "Grow your venture with mentoring, finance and marketing skills." / unsure "Start with a counsellor session, then test X with a small project."; if maturity>=2 and stage==="school" append " Fast track: start a small project or business while you study."), plan { "30 days": "Research the top career and talk to 2 people in it.", "90 days": "Take one short course or build one small project.", "1 year": "Complete a certification or first real experience." } }.

QUESTION BANK (ageBand values: "16-20","21-25","26-30","31-35","36+"; weights 2 unless shown)
1 ord1 (no requires) "Where are you right now?": Still studying {stage:school,goal:some} | Finished a degree {stage:degree,goal:some} | Working {stage:work,goal:some} | Running my own business {stage:business,goal:some,_mat+1} | Not sure yet {stage:unsure,goal:none}
2 ord2 requires stage=[school] "Which subject makes time fly?": Computers & science→tech | Business & money→business | Biology & health→health | Art, design & media→creative | People & society→service
3 ord2 requires stage=[degree] "What did you study?": Technology / engineering→tech | Business / finance→business | Health / science→health | Arts / media→creative | Education / social→service
4 ord2 requires stage=[work] "What takes most of your work day?": Solving technical problems→tech | Managing money or people→business | Caring for people→health | Creating content or design→creative | Teaching or supporting→service
5 ord3 requires stage=[work], ageBand=[26-30,31-35,36+] "Is your current job right for you?": Yes, I like it {fit:good,_mat+1} | It is okay {fit:ok} | I want a change {fit:switch}
6 ord2 requires stage=[business] "What kind of business is it?": Tech or online→tech | Trading or services→business | Health or wellness→health | Creative or media→creative | Education or community→service
7 ord2 requires goal=[none] "One free year, no money worries. On day one you…": Build or fix something→tech | Start my own thing→business | Meet and help people→health | Create something new→creative | Learn and teach→service
8 ord3 requires goal=[none] "What bothers you most in the world?": Broken or inefficient things→tech | Wasted money and weak businesses→business | People who are unwell→health | Ugly or boring design→creative | People left behind→service
9 ord8 "At 35, what matters most?": Being a respected expert {tech1,health1} | Freedom and wealth {business2,_mat1} | Helping others {service1,health1} | Creating things people love {creative2}
10 ord9 "Which sounds most like you?": I plan years ahead {_mat1} | I take it one step at a time {} | I try things and see {creative1}

Create the project structure, design system, api.ts with the mock engine, and a home page only. Confirm it runs.
```

## Prompt 2: The customer journey screens
```
Using the existing design system and src/lib/api.ts, build the customer flow. Routes and screens:

/  Landing: hero "Discover the career that fits you", pill "7 minutes | options only", a primary "Start my journey" button, 3 short benefit cards (Adaptive questions, Personal report, Portal + expert chat), "Already have a login?" link to /portal/login.
/start  Age category: five large selectable cards (16–20, 21–25, 26–30, 31–35, 36+) with the line "This only sets our starting point." Creates the session.
/quiz  One question per screen, big option cards, animated progress bar, smooth slide transition. Keep a small "suspense" line between questions that rotates: "Interesting…", "Your answers point somewhere unexpected.", "One more thing…", "We're getting close." Option choice auto-advances after 400ms. Back button re-shows the previous question.
/teaser  "We found 3 careers that fit you". Show the locked card: "YOUR TOP MATCH" + teaser text (e.g. S•••••• & D••••••) on a deep-teal card, blurred skeleton rows below, gold button "Unlock my full report (AED 99)". Price comes from getTeaser.
/details  Form: full name, email, mobile, country (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain), consent checkbox "I agree to the privacy policy (guardian consent if under 18)". Validate with zod.
/payment  Order summary (Pathora Career Report, full report + portal access, AED 99), method chips: Card, Mada, KNET, Apple Pay. Card form with test values, button "Pay AED 99 (demo)". Show a 1.5s processing state, then success animation. NO real payment: label it "Demo payment" in small text.
/report-ready  A simulated EMAIL preview card: subject "Your Pathora report is ready", greeting, top 3 careers, portal URL, username, password, button "Open my portal". Also show the on-screen report below (see Prompt 3 component).

Everything must be fully responsive. On mobile the layout is a single column; on desktop use a centered two-column layout (left: deep-teal brand panel with step title + short caption, right: the active screen).
```

## Prompt 3: Report, portal and staff demo
```
Build the report, portal and staff screens.

Component <ReportView report>: header "You are a “{profile}”"; "Top careers" card with 3 rows (career name, match %, animated progress bar); "Your pathway" card; "Your plan" as 3 tabs or cards (30 days / 90 days / 1 year); a "Download PDF" button that uses window.print() with a clean print stylesheet (logo, report only); a "Share" button that copies a link.

/portal/login  Username + password, error state, plus a small demo hint box "Use the login shown after payment". On success store the token and go to /portal.
/portal  Dashboard after login: greeting, tabs: "My report" (ReportView), "My plan" (tick-able checklist of the 30/90/365 plan items saved in localStorage with progress ring), "Chat with our team" (WhatsApp-style bubbles, input, Send, auto-scroll, shows "Staff replies usually within a few hours"). Log out button.
/staff  DEMO staff screen (no auth, labelled "Demo staff view"): list of customer chats on the left, selected conversation on the right with a reply box. A message sent from /portal appears here, and a staff reply appears in the portal within 3 seconds (poll localStorage every 2s so both tabs update live). This lets me present customer and staff side by side.

Seed the portal chat with one staff welcome message after the first login: "Hi {firstName}! I'm Sara from the Pathora team. Ask me anything about your report."
```

## Prompt 4: Demo mode and polish
```
Add a presenter-friendly DEMO MODE and polish.

1. A small floating "Demo" button (bottom-left) opening a drawer with: Mobile / Desktop frame toggle (wraps the app in a 390×844 phone frame or full width), "Pre-fill details" (fills the form with Ahmed Al Mansoori, ahmed@email.com, +971 50 123 4567, UAE), "Skip to teaser", "Skip to report", "Reset demo" (clears localStorage and returns to /), and a "Persona" selector that auto-answers the quiz: "18, still studying", "22, finished a degree", "28, working, wants a change", "17, mature mindset (business)", "Not sure yet". The drawer must be hideable so the audience never sees it.
2. Smooth page transitions, subtle confetti on payment success, skeleton loaders, empty/error states.
3. Accessibility: focus rings, aria labels, 4.5:1 contrast, keyboard navigation through options.
4. RTL readiness: use logical Tailwind classes (ms/me/ps/pe), put all UI strings in src/i18n/en.ts and src/i18n/ar.ts, and make the EN | العربية toggle actually switch language and dir="rtl" (Arabic strings can be a first draft).
5. Add a footer "Presented by Find My Career" and a swappable <FmcLogo /> on the landing page and the email-preview card.

Do not add a backend. Keep USE_MOCK = true.
```

---

# PART B: Antigravity handoff (real backend)

**Before you start:** in Lovable, connect GitHub and push the project. Unzip `pathora-mvp.zip` into a `/server` folder in that same repo. Open the repo in Antigravity.

## API contract (already implemented in /server)
| UI function | Endpoint |
|---|---|
| createSession | `POST /api/session` `{ageBand}` |
| getNextQuestion | `GET /api/session/:id/next` |
| submitAnswer | `POST /api/session/:id/answer` `{questionId, optionId}` |
| getTeaser | `GET /api/session/:id/teaser` |
| checkout | `POST /api/session/:id/checkout` |
| login | `POST /api/login` |
| getReport | `GET /api/report` (Bearer token) |
| getChat / sendChat | `GET` / `POST /api/chat` (Bearer token) |
| staff | `GET /api/admin/chats`, `POST /api/admin/reply` (header `x-admin-key`) |

## Prompt for the Antigravity agent
```
This repo has a Lovable-built React UI (root) and a Node.js + Express + MySQL backend (/server). The UI calls everything through src/lib/api.ts with a USE_MOCK flag; the backend implements the same contract (see /server/README.md).

Tasks, in order. Do each one and verify it before moving on:
1. Set USE_MOCK=false and VITE_API_URL; implement every function in api.ts against the real endpoints (token in localStorage, Authorization header). Fix any response-shape differences on the UI side, not by changing the contract.
2. Run MySQL (docker-compose with mysql:8), apply /server/schema.sql, run the seed, start the server, and run the UI. Walk the full flow: age → quiz → teaser → details → payment → report → login → chat. Fix bugs.
3. Replace the demo payment in /server (POST /api/session/:id/checkout) with a real gateway integration behind an env flag (PAYMENT_PROVIDER = demo | stripe | tap | hyperpay). Mark an order paid ONLY from the provider's webhook; the checkout endpoint should return a payment URL and the UI should redirect to it. Keep "demo" as the default.
4. Move the report to server-side generation with an optional Claude API call (env ANTHROPIC_API_KEY): rule-based report as input, polished personalised text as output, and fall back to the rule-based report on any error. Never put the API key in the frontend.
5. Replace the /staff demo with a real staff app: protected login, list of chats, reply, unread badge. Use JWT with a staff role, not the shared admin key.
6. Security and quality: rate-limit /api/login and /api/session, validate all input with zod, add helmet and CORS for the UI origin, hash passwords (already bcrypt), add email via SMTP, add a privacy consent record with timestamp and guardian-consent flag for under-18s.
7. Add Arabic/RTL completeness, tests for engine.js (npm test) and a Playwright test of the full happy path.
8. Add a Dockerfile for each service and deploy notes for Coolify.
Show me a short summary and what to test after each task.
```

---

# PART C: Start-to-end demo script (about 7 minutes)

| Min | Screen | What you say |
|---|---|---|
| 0:00 | Landing | "Many people in the Gulf don't know their next step. Pathora finds it in seven minutes." |
| 0:30 | Age | "Age only sets where we start; it never limits the answers." |
| 1:00 | Quiz (persona: 22, finished a degree) | "Each question depends on the last answer. A graduate is asked about experience, not school subjects." |
| 2:30 | Reset → persona "Not sure yet" | "If someone says nothing interests them, we switch to deeper discovery questions." |
| 3:30 | Teaser | "We reveal a hint, not the answer. That is the reason to unlock." |
| 4:00 | Details + payment | "Secure payment: Mada, KNET, card or Apple Pay. This is a demo payment." |
| 4:45 | Email preview | "They get the report, portal link, username and password by email." |
| 5:15 | Report | "Top careers, pathway and a 30-90-365 day plan. It can be downloaded as a PDF." |
| 6:00 | Portal + staff view side by side | "The customer asks a question; our staff see it and answer live." |
| 6:45 | Close | "Pathora. Your Future, Your Path. Presented by Find My Career." |

**Presenting tips**
- Open `/portal` and `/staff` in two browser windows for the chat demo.
- Use the Demo drawer's **Persona** and **Pre-fill** so you never type live.
- Do a full dry run on both phone and laptop the day before.
- Be clear about what is real and what is demo: the questionnaire logic and report are real; payment and email are demo until Part B is done.
