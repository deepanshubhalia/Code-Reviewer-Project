# AI Code Reviewer - One-Page Interview Cheat Sheet

## Project Summary
**What:** AI-powered code review platform  
**User Flow:** Paste code → Click review → Get AI feedback  
**Tech:** React + Node.js + Google Gemini  
**Ports:** Frontend 5173, Backend 3000  

---

## Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | React 19 + Vite | Component-based, instant reloading |
| **Backend** | Express.js | Lightweight framework for APIs |
| **AI** | Gemini 2.0 Flash | Fast, accurate, cost-effective |
| **HTTP Client** | Axios | Easy async requests |
| **Code Highlight** | PrismJS + highlight.js | Beautiful code display |
| **Markdown** | react-markdown | Format AI responses nicely |
| **Build** | Vite | 30x faster than Webpack |

---

## File Structure

```
BackEnd/
├── server.js          → Start Express on port 3000
├── src/
│   ├── app.js         → Express setup (CORS, middleware)
│   ├── routes/        → Define /ai/get-review endpoint
│   ├── controllers/   → Validate requests, call service
│   └── services/      → Call Gemini API

Frontend/
├── vite.config.js     → Build configuration
├── src/
│   ├── App.jsx        → Main React component
│   ├── App.css        → Styling (split layout)
│   └── main.jsx       → Entry point
```

---

## Request Flow (10 Steps)

1. User pastes code in editor
2. Clicks "Review" button
3. **Frontend:** `axios.post('/ai/get-review', { code })`
4. **Backend Router:** Match POST /ai/get-review
5. **Controller:** Validate code exists
6. **Service:** Init Gemini with system instruction
7. **Gemini:** Analyze code (2-5 seconds)
8. **Service:** Return markdown review
9. **Frontend:** Parse response → Update state
10. **Display:** Render formatted review on right

---

## Key npm Commands

### Backend
```bash
npm install              # First time only
node server.js          # Start server
npm run dev             # Or with nodemon (auto-restart)
```

### Frontend
```bash
npm install             # First time only
npm run dev             # Start Vite dev server (hot reload)
npm run build           # Create optimized production build
npm run lint            # Check code quality
```

---

## API Endpoint

**POST http://localhost:3000/ai/get-review**

Request:
```json
{ "code": "function sum() { return 1 + 1 }" }
```

Response:
```
❌ Issues: Missing error handling, not scalable
✅ Fix: async function sum(a,b) { return a + b }
💡 Better: Now handles multiple numbers
```

---

## System Instruction (AI Personality)

Tells Gemini to:
- Act as senior code reviewer (7+ years)
- Check: quality, performance, security, best practices
- Format: ❌ Issues → ✅ Fixes → 💡 Improvements
- Be constructive and encouraging

---

## Quick Interview Q&A

| Q | A |
|---|---|
| **What is this?** | Full-stack AI code review platform using React, Express, and Google Gemini |
| **Why React?** | Component-based, state management, fast re-renders |
| **Why Express?** | Lightweight, perfect for APIs, large community |
| **Why Gemini?** | SOTA LLM, flash is fast, good pricing |
| **How communicate?** | Axios sends HTTP POST, backend processes, Gemini analyzes, response back |
| **What's API?** | Contract defining how apps communicate (endpoints, request/response format) |
| **What if no code?** | return res.status(400).send("Code required") |
| **Error handling?** | Validate at controller, try-catch at frontend |
| **Database?** | Currently none (future: MongoDB with MongoDB Atlas) |
| **Scale to 1M?** | Load balancer, Redis caching, message queues, DB replication |

---

## Architecture (Quick Overview)

```
USER BROWSER (React)
    ↓ (axios.post)
BACKEND (Express)
    ├─ Router → Controller → Service
    ↓
GOOGLE GEMINI (AI Analysis)
    ↓
RESPONSE (Markdown)
    ↓
DISPLAY (Markdown Component)
    ↓
USER READS REVIEW
```

---

## Key Concepts

**Async/Await:**
Wait for API response without freezing UI
```javascript
await axios.post(...) // Wait for response
setReview(data)       // Then update
```

**State Management:**
Component data that triggers re-render when changed
```javascript
const [code, setCode] = useState('')
setCode('new value')  // Component re-renders
```

**Middleware:**
Process requests before reaching endpoint
```javascript
app.use(cors())           // Allow cross-origin
app.use(express.json())   // Parse JSON body
```

**MVC Pattern:**
Separation of concerns
```
Model: Data (database)
View: UI (React components)
Controller: Request handler (Express)
Service: Business logic
```

---

## Scalability Strategy

**Current:** 1 server, no database, no caching  
**10K users:** Add load balancer + Redis caching  
**100K users:** Add database + message queues  
**1M users:** Multi-region + sharding + advanced failover  

---

## Tools & Resources

| Need | Tool |
|------|------|
| **API Key** | https://aistudio.google.com/app/apikeys |
| **Frontend Deploy** | Vercel, Netlify |
| **Backend Deploy** | Heroku, AWS, Google Cloud |
| **Database** | MongoDB Atlas (cloud) |
| **Cache** | Redis Cloud |
| **Monitoring** | Winston, Datadog |

---

## Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| Cannot connect backend | Not running | `node server.js` in BackEnd folder |
| 400 error on review | Code is empty | Check request validation |
| Slow response | Gemini rate limit | Implement Redis caching |
| No review displays | Axios error | Add try-catch in frontend |
| Frontend blank | Build issues | `npm install` then `npm run dev` |

---

## Deployment Checklist

- [ ] Add error handling (try-catch)
- [ ] Add authentication (JWT tokens)
- [ ] Add rate limiting (prevent abuse)
- [ ] Add database (save reviews)
- [ ] Set environment variables securely
- [ ] Remove console.log statements
- [ ] Test on multiple browsers
- [ ] Performance testing
- [ ] Security audit
- [ ] Add unit tests
- [ ] Set up CD/CI pipeline
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Heroku)

---

## Interview Talking Points (What to Emphasize)

✅ **Clean architecture:** Separated concerns (controller, service, route)  
✅ **Error handling:** Validation at multiple layers  
✅ **Scalability thinking:** Database, caching, load balancing  
✅ **Modern tech stack:** React hooks, async/await, Vite  
✅ **API design:** RESTful endpoint (/ai/get-review)  
✅ **Security:** API keys in .env, not exposed  
✅ **User experience:** Real-time feedback, syntax highlighting  
✅ **Future enhancements:** Database, auth, multi-language support  

---

## What Interviewer Will Notice

**Positive:**
- Using established frameworks (React, Express)
- Clean code organization (MVC pattern)
- Async programming understanding
- Security awareness (API keys in .env)
- Scalability thinking

**Areas to Explain:**
- Why these specific technologies
- How frontend-backend communication works
- How to handle errors
- How to scale the application
- What would you improve

---

## Last-Minute Memorize

**Request flow:** Editor → Button click → Axios → Backend route → Controller → Service → Gemini → Response → Markdown display

**Key files:** server.js (start) → app.js (setup) → routes → controller → service → Gemini

**Tech why:** React (fast UI), Express (lightweight API), Gemini (SOTA AI), Vite (fast builds)

**Database:** None currently, plan to add MongoDB with reviews collection

**Scale:** Load balancer for servers, Redis for caching, queues for processing, DB replication for reliability

---

## During Interview

1. **Be confident:** You understand the full stack
2. **Explain visually:** Draw boxes for frontend/backend/AI
3. **Use real examples:** "Here in App.jsx we use useState for..."
4. **Think about scale:** "For 1M users we would need..."
5. **Ask clarifying questions:** "Would enterprise features be needed?"
6. **Admit limitations:** "Currently no database, but would add MongoDB for..."
7. **Show enthusiasm:** "Enjoyed building this, learned a lot about async programming"

---

## PDF/Print Friendly - Keep in Pocket!

You now have 4 comprehensive documents:
1. **INTERVIEWER_GUIDE.md** - Complete walkthrough (15 pages)
2. **QUICK_REFERENCE.md** - Quick lookup (10 pages)
3. **SCALABILITY.md** - Advanced concepts (12 pages)
4. **CODE_WALKTHROUGH.md** - Code examples (15 pages)

**Use this sheet (1 page) for:**
- Pre-interview review (30 minutes before)
- Quick fact-checking during interview
- Post-interview notes
