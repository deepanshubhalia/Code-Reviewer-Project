# AI Code Reviewer - Quick Reference Guide

## Quick Project Overview

**Name:** AI Code Reviewer  
**What it does:** Users paste code → AI reviews it → Shows suggestions  
**Technologies:** React (Frontend), Express (Backend), Gemini AI (Intelligence)  
**Ports:** Frontend runs on 5173, Backend on 3000  

---

## One-Minute Explanation

"This is a full-stack web application that leverages Google's Gemini AI to provide professional code reviews. Users can paste JavaScript code into a web interface, click 'Review', and receive AI-generated feedback on code quality, performance, security, and best practices. The frontend is built with React and Vite for fast development, the backend uses Express.js to handle API requests, and Gemini AI provides the intelligent code analysis."

---

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│ React 19 (UI Framework) + Vite (Fast Build Tool)           │
│ ├─ react-simple-code-editor: Code input with highlighting  │
│ ├─ react-markdown: Display AI reviews nicely              │
│ ├─ axios: Send requests to backend                        │
│ ├─ PrismJS & highlight.js: Syntax highlighting           │
│ └─ Port: 5173 (development)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    HTTP (Axios)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│ Node.js + Express.js (API Framework)                      │
│ ├─ server.js: Entry point                                 │
│ ├─ app.js: Express configuration                          │
│ ├─ routes/ai.routes.js: API endpoints                     │
│ ├─ controllers/ai.controller.js: Request handling         │
│ ├─ services/ai.service.js: Business logic               │
│ ├─ CORS: Allow cross-origin requests                     │
│ └─ Port: 3000 (development)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
                  Google Generative AI
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     AI LAYER                                │
├─────────────────────────────────────────────────────────────┤
│ Google Gemini 2.0 Flash                                   │
│ ├─ Model: gemini-2.0-flash                               │
│ ├─ Analyzes code for quality, performance, security      │
│ ├─ Returns markdown-formatted review                     │
│ └─ Requires: API key from Google (free tier available)   │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### **GET http://localhost:3000/**
**Purpose:** Health check  
**Response:** "Hello World"  

### **POST http://localhost:3000/ai/get-review**
**Purpose:** Review code with AI  
**Request Body:**
```json
{
  "code": "function sum() { return 1 + 1 }"
}
```

**Response:**
```
🔍 Issues:
- Missing error handling
- No input validation
- Function name doesn't match logic

✅ Recommended Fix:
async function sum(a, b) {
  try {
    const result = a + b
    return { success: true, result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

💡 Improvements:
- Now handles multiple numbers
- Better error handling
- Returns structured response
```

---

## Complete Request-Response Flow

```
USER INITIATES REQUEST
│
├─→ Types/pastes code in editor (React Component)
│
├─→ Clicks "Review" button
│
├─→ reviewCode() function executes
│
├─→ axios.post('http://localhost:3000/ai/get-review', { code })
│   (Frontend sends code to Backend)
│
│                           BACKEND PROCESSES
│                           │
│                           ├─ Express receives POST request
│                           │
│                           ├─ Router matches /ai/get-review
│                           │
│                           ├─ Controller validates code exists
│                           │  └─ If missing: return 400 error
│                           │
│                           ├─ Controller calls aiService
│                           │
│                           ├─ Service initializes Gemini AI
│                           │
│                           ├─ Service sends code + system instruction to Google
│                           │
│                           └─ Waits for Gemini response (2-5 seconds)
│
├─ Backend receives markdown review from Gemini
│
├─ Backend sends review in HTTP response
│
├─ Frontend receives response via .then(response => ...)
│
├─ React state updated: setReview(response.data)
│
├─ React component re-renders
│
├─ Markdown component displays formatted review
│
└─ USER SEES REVIEW ON RIGHT SIDE
```

---

## File-by-File Explanation

### **Backend Entry Point: server.js**
```javascript
require('dotenv').config()     // Load environment variables (.env)
const app = require('./src/app')  // Import Express app

app.listen(3000, () => {       // Start server on port 3000
    console.log('Server running...')
})
```
**What it does:** Loads API key from .env, starts Express server on port 3000

---

### **Express Setup: src/app.js**
```javascript
const express = require('express')
const cors = require('cors')
const aiRoutes = require('./routes/ai.routes')

const app = express()

app.use(cors())           // Middleware: Allow all cross-origin requests
app.use(express.json())   // Middleware: Parse JSON request bodies

app.get('/', ...)         // Health check endpoint
app.use('/ai', aiRoutes)  // Mount /ai routes

module.exports = app
```
**What it does:** Sets up Express with CORS and JSON parsing, mounts routes

---

### **Router: src/routes/ai.routes.js**
```javascript
const router = express.Router()
const aiController = require('../controllers/ai.controller')

router.post('/get-review', aiController.getReview)
// POST /ai/get-review → calls aiController.getReview

module.exports = router
```
**What it does:** Defines POST endpoint that triggers code review

---

### **Controller: src/controllers/ai.controller.js**
```javascript
module.exports.getReview = async (req, res) => {
    const code = req.body.code    // Extract code from request
    
    if (!code) {
        return res.status(400).send('Code is required')
    }
    
    const response = await aiService(code)  // Get AI review
    res.send(response)            // Send review to client
}
```
**What it does:** Validates request, calls service, returns response

---

### **Service: src/services/ai.service.js**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY)
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: 'You are a senior code reviewer...'  // Personality
})

async function generateContent(prompt) {
    const result = await model.generateContent(prompt)
    return result.response.text()  // Return markdown review
}

module.exports = generateContent
```
**What it does:** Sends code to Gemini AI, gets review, returns it

---

### **Frontend Main: Frontend/src/App.jsx**
```javascript
import { useState, useEffect } from 'react'
import axios from 'axios'
import Editor from 'react-simple-code-editor'
import Markdown from 'react-markdown'

function App() {
    const [code, setCode] = useState('')      // Code state
    const [review, setReview] = useState('')  // Review state
    
    async function reviewCode() {
        const response = await axios.post(
            'http://localhost:3000/ai/get-review',
            { code }
        )
        setReview(response.data)  // Update with AI response
    }
    
    return (
        <>
            <Editor value={code} onChange={setCode} />     {/* Left side */}
            <button onClick={reviewCode}>Review</button>
            <Markdown>{review}</Markdown>                   {/* Right side */}
        </>
    )
}
```
**What it does:** Manages code input, sends to backend, displays review

---

## Environment Setup

### **Backend .env file:**
```
GOOGLE_GEMINI_KEY=your_api_key_here
```

Get free API key from: https://aistudio.google.com/app/apikeys

### **Frontend .env (optional):**
```
VITE_API_URL=http://localhost:3000
```

---

## Key npm Commands Explained

### **Backend Commands:**

| Command | What it does | When to use |
|---------|------------|-----------|
| `npm install` | Downloads all dependencies from package.json | First time setup |
| `node server.js` | Starts the server on port 3000 | Run backend |
| `npm install -g nodemon` | Installs nodemon globally | Once, for auto-restart |
| `nodemon server.js` | Starts server + auto-restarts on file changes | Development |

### **Frontend Commands:**

| Command | What it does | When to use |
|---------|------------|-----------|
| `npm install` | Downloads React, Vite, and other packages | First time setup |
| `npm run dev` | Starts Vite dev server on port 5173 with hot reload | Development |
| `npm run build` | Creates optimized production build in /dist | Before deploying |
| `npm run lint` | Checks code for style/quality issues | Before committing |
| `npm run preview` | Shows what production build looks like | Test production build |

---

## Startup Procedure (Step-by-Step)

### **Terminal 1 - Backend:**
```bash
# Navigate to backend
cd BackEnd

# Install once
npm install

# Create .env file with API key
echo "GOOGLE_GEMINI_KEY=your_key" > .env

# Start server
node server.js
# Output: "Server is running on http://localhost:3000"
```

### **Terminal 2 - Frontend:**
```bash
# Navigate to frontend
cd Frontend

# Install once
npm install

# Start dev server
npm run dev
# Output: "Local: http://localhost:5173"
```

### **In Browser:**
1. Open http://localhost:5173
2. Paste code in left editor
3. Click "Review" button
4. See AI review on right side

---

## Interview Q&A Cheat Sheet

**Q: What is this project?**  
A: An AI-powered code review platform using React, Express, and Google Gemini.

**Q: Why use React?**  
A: Component-based, state management with hooks, fast re-rendering, large ecosystem.

**Q: Why Express?**  
A: Lightweight web framework, perfect for building REST APIs, large community support.

**Q: Why Gemini?**  
A: State-of-the-art AI model, fast with "flash" variant, understands code well, good pricing.

**Q: How does frontend talk to backend?**  
A: Axios makes HTTP POST request with code. Backend calls Gemini. Response comes back.

**Q: What is an API?**  
A: Interface defining how apps communicate. Like a menu - you order something, kitchen provides it.

**Q: What are the main files?**  
A: Backend: server.js (start), app.js (setup), controller (handle request), service (business logic). Frontend: App.jsx (main component).

**Q: How to add database?**  
A: Use MongoDB. Create schemas for users, reviews. Handle queries in service layer.

**Q: How to scale?**  
A: Load balancing (multiple servers), caching (Redis), database replication, message queues.

**Q: What are potential issues?**  
A: No authentication, no database, single server, Gemini rate limits, no error handling in frontend.

---

## Architecture Patterns Used

### **MVC (Model-View-Controller) in Backend**
```
Request → Router → Controller → Service → Google API → Response
          (Routes) (Request handling) (Business Logic)
```

### **Component State in Frontend**
```
User Interaction → State Change → Re-render → DOM Update
  (Click)           (setCode)      (React)
```

### **Separation of Concerns**
- **Frontend:** UI/UX, user interaction
- **Backend:** API, business logic, integrations
- **AI Service:** Code analysis and review
- **Database (future):** Data persistence

---

## Common Interview Questions & Detailed Answers

**Q1: How does error handling work?**  
A: In controller, we check if code exists: `if (!code) res.status(400)...`. Frontend could wrap Axios in try-catch to handle network errors. Currently minimal, but should add:
```javascript
try {
    const response = await axios.post(...)
} catch (error) {
    setReview('Error: ' + error.message)
}
```

**Q2: How would you authenticate users?**  
A: Use JWT (JSON Web Tokens):
1. User logs in with email/password
2. Backend generates JWT token
3. Frontend stores in localStorage
4. Every API request includes token in header
5. Backend validates token before processing

**Q3: How to handle Gemini API costs?**  
A: 
- Implement caching (Redis): save responses for same code
- Rate limiting: max 10 reviews/minute per user
- Batch processing: group requests, send together
- Fallback: use cheaper model for simple reviews

**Q4: How to add support for multiple languages?**  
A: 
1. Add language selector in UI
2. Send language in request: `{ code, language: 'python' }`
3. Update system instruction: "Review [language] code"
4. Gemini handles Python, Java, C++, etc.

**Q5: How responsive is the system?**  
A: Gemini takes 2-5 seconds for response. For better UX:
- Show loading spinner while waiting
- Debounce multiple clicks
- Implement timeout (if >30s, show error)
- Add cancel button

**Q6: What's the database schema?**  
A:
```javascript
Users: { _id, username, email, password, createdAt }
Reviews: { _id, userId, code, language, review, rating, timestamp, tags }
APIUsage: { _id, userId, date, requestCount, tokensUsed }
```

**Q7: How to deploy?**  
A:
- **Frontend:** Vercel or Netlify (automatic from GitHub)
- **Backend:** Heroku, AWS, Google Cloud, Railway
- **Database:** MongoDB Atlas (cloud MongoDB)
- **Gemini Key:** Store in environment variables on platform

**Q8: What are security concerns?**  
A:
1. API key exposed in .env (use secrets management)
2. No input sanitization (malicious code could break things)
3. No user validation (anyone can use API)
4. Rate limiting needed (prevent abuse)
5. HTTPS must be used in production

---

## Performance Tips

### **Frontend:**
- Use React.memo() to prevent unnecessary re-renders
- Lazy load Markdown parser
- Code split with dynamic imports

### **Backend:**
- Cache frequently reviewed code
- Use connection pooling for database
- Implement request queuing

### **Gemini:**
- Use gemini-2.0-flash (faster than pro)
- Batch requests when possible
- Implement exponential backoff for retries

---

## Deployment Checklist

- [ ] Add error handling in frontend
- [ ] Add authentication (JWT)
- [ ] Add rate limiting
- [ ] Set up database (MongoDB)
- [ ] Add environment variables
- [ ] Remove console.logs
- [ ] Add HTTPS
- [ ] Test with multiple browsers
- [ ] Add API documentation
- [ ] Set up logging/monitoring
- [ ] Add unit tests
- [ ] Performance testing
- [ ] Security audit
- [ ] Deploy to production

---

## Resources for Further Learning

- **Express:** https://expressjs.com/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **Google Generative AI:** https://ai.google.dev/
- **Axios:** https://axios-http.com/
- **React Markdown:** https://github.com/remarkjs/react-markdown

---

## Summary for Quick Recall

| What | How | Why |
|-----|-----|-----|
| **Frontend** | React + Vite | Fast, modern UI development |
| **Backend** | Express.js | Lightweight API framework |
| **AI** | Gemini 2.0 | State-of-the-art LLM |
| **Communication** | Axios + HTTP | Reliable, standard protocol |
| **Request Handling** | MVC pattern | Clean, organized code |
| **Code Review** | System instruction | Custom AI behavior |
| **Styling** | CSS + Markdown | Beautiful, formatted output |
| **Future** | Database + Auth | Persistence + Security |

---

## Troubleshooting Common Issues

**Issue: "Cannot GET /"**  
→ Backend not running. Run `node server.js` in BackEnd folder.

**Issue: "Connection refused on localhost:3000"**  
→ Backend not started or wrong port. Check if server.js is running.

**Issue: Axios returns 400 error**  
→ Code is empty or not sent. Check request body: `{ code: "..." }`

**Issue: Gemini API returns error**  
→ Invalid API key in .env or reached rate limit. Check `process.env.GOOGLE_GEMINI_KEY`

**Issue: Frontend shows blank review**  
→ Response parsing issue. Check Axios error handling and response format.

**Issue: Hot reload not working in Vite**  
→ Restart dev server: `npm run dev`
