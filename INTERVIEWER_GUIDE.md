# AI Code Reviewer - Complete Project Explanation for Interview

---

## 1. PROJECT OVERVIEW

**Project Name:** AI Code Reviewer

**Purpose:** This is a full-stack web application that analyzes code using Google's Gemini AI and provides detailed reviews, suggestions for improvement, and best practices. It acts like a senior code reviewer with 7+ years of experience who can review your code for quality, performance, security, and scalability.

**Target Users:** Developers who want instant code reviews, students learning to write better code, and teams improving code quality.

---

## 2. TECHNOLOGY STACK & WHY WE USED THEM

### **Backend Technologies:**

| Technology | Version | Why Used |
|-----------|---------|----------|
| **Node.js** | Latest | Server-side JavaScript runtime - lightweight, fast, event-driven |
| **Express.js** | 4.21.2 | Minimal web framework - handles HTTP requests/responses easily |
| **Google Generative AI** | 0.21.0 | Official SDK for Gemini AI - provides AI code review capabilities |
| **CORS** | 2.8.5 | Middleware to allow frontend to communicate with backend from different domains |
| **dotenv** | 16.4.7 | Manages environment variables like API keys securely |

### **Frontend Technologies:**

| Technology | Version | Why Used |
|-----------|---------|----------|
| **React** | 19.0.0 | Modern UI library - manage state and re-render efficiently |
| **Vite** | 6.1.0 | Build tool - extremely fast development and production builds |
| **Axios** | 1.7.9 | HTTP client - makes API calls to backend with less boilerplate |
| **React Markdown** | 9.0.3 | Renders markdown - AI responses are in markdown format |
| **highlight.js** | 11.11.1 | Code syntax highlighting - makes code readable in browser |
| **react-simple-code-editor** | 0.14.1 | Code editor component - users can type/paste code with syntax highlighting |
| **PrismJS** | 1.29.0 | Alternative syntax highlighting - improves code readability |
| **ESLint** | 9.19.0 | Code quality checker - finds and fixes JavaScript errors |

---

## 3. WHAT ARE APIs?

**API = Application Programming Interface**

Think of it as a "contract" or "bridge" between two software applications. It defines:
- **What requests you can send** (endpoints)
- **What data format to use**
- **What response you'll get back**

**Real-world analogy:** Like ordering food at a restaurant:
- You (client) tell the waiter (API) what you want
- The waiter takes it to the kitchen (server)
- Kitchen prepares and gives it back
- Waiter brings it to you

**Types of APIs we use:**

### **Internal API (Backend → Frontend)**
```
Route: POST http://localhost:3000/ai/get-review
Request Body: { "code": "function sum() { return 1 + 1 }" }
Response: "🔍 Issues: Missing error handling, etc..."
```

### **External API (Backend → Google Gemini)**
```
Google Generative AI SDK handles this internally
Sends code to Google servers → Gets AI review → Returns to frontend
```

---

## 4. USER FLOW (How the app works step-by-step)

```
1. User opens the website
   ↓
2. User sees code editor on left side (with default function)
   ↓
3. User pastes/types their JavaScript code
   ↓
4. User clicks "Review" button
   ↓
5. Frontend sends code to Backend (Axios HTTP request)
   ↓
6. Backend receives code at /ai/get-review endpoint
   ↓
7. Backend validates code (not empty)
   ↓
8. Backend sends code to Google Gemini AI with system prompt
   ↓
9. Google AI analyzes code (checks quality, performance, security, best practices)
   ↓
10. Google AI returns markdown formatted review
   ↓
11. Backend sends review back to frontend
   ↓
12. Frontend parses markdown and displays formatted review on right side
   ↓
13. User reads feedback and improves their code
```

---

## 5. ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              FRONTEND (React + Vite)                      │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │   App.jsx (Main Component)                          │  │ │
│  │  │                                                       │  │ │
│  │  │  ┌──────────────────┐    ┌─────────────────────┐   │  │ │
│  │  │  │ Code Editor      │    │ Markdown Display    │   │  │ │
│  │  │  │ (left side)      │    │ (right side)        │   │  │ │
│  │  │  │                  │    │                     │   │  │ │
│  │  │  │ - Input code     │    │ - Shows AI review   │   │  │ │
│  │  │  │ - Syntax HL      │    │ - Formatted text    │   │  │ │
│  │  │  │ - React Editor   │    │ - Code suggestions  │   │  │ │
│  │  │  └──────────────────┘    └─────────────────────┘   │  │ │
│  │  │                                                       │  │ │
│  │  │  [Review Button] ← onClick triggers Axios call      │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↑                                     │
│                            │                                     │
│                    axios.post() HTTP Request                    │
│                    (code sent to backend)                       │
│                            │                                     │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    localhost:3000
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                            ↓                                     │
│                    BACKEND (Express.js)                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  server.js (Entry Point)                                  │ │
│  │  - Loads environment variables (.env file)                │ │
│  │  - Starts Express server on port 3000                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  src/app.js (Express Setup)                               │ │
│  │  - CORS middleware (allows cross-origin requests)         │ │
│  │  - JSON body parser                                       │ │
│  │  - Routes setup                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Routes (/ai/get-review)                                  │ │
│  │  - POST endpoint receives code from frontend              │ │
│  │  - Calls controller function                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controllers (ai.controller.js)                           │ │
│  │  - Receives HTTP request                                  │ │
│  │  - Validates code (check if not empty)                    │ │
│  │  - Extracts code from request body                        │ │
│  │  - Calls service layer                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Services (ai.service.js)                                 │ │
│  │  - Business logic layer                                   │ │
│  │  - Initializes Google Generative AI SDK                   │ │
│  │  - Creates Gemini AI model instance                       │ │
│  │  - Sets system instruction (code reviewer persona)        │ │
│  │  - Sends code prompt to Gemini                            │ │
│  │  - Returns AI response (markdown format)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             ↓                                     │
│              EXTERNAL API (Google Cloud)                         │
│                             │                                     │
│         ┌────────────────────┼────────────────────┐              │
│         │                    │                    │              │
│         ↓                    ↓                    ↓              │
│    Gemini 2.0 (AI Engine) - Analyzes code and generates reviews │
│                                                                   │
│    Process:                                                      │
│    1. Receives code + system instruction                        │
│    2. Analyzes for: Quality, Performance, Security, Best 🕐     │
│    3. Generates markdown formatted review                       │
│                                                                   │
│         ↑                    ↑                    ↑              │
│         └────────────────────┼────────────────────┘              │
│                             ↓                                     │
│                    Return AI Review (markdown)                   │
│                             ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controller sends review back through HTTP response        │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────────┘
                             │
                    Response sent to Frontend
                             │
┌────────────────────────────↓──────────────────────────────────┐
│                                                                   │
│  Frontend receives response (Axios .then())                     │
│            ↓                                                     │
│  Parse response and update React state (setReview)             │
│            ↓                                                     │
│  React re-renders with Markdown component                      │
│            ↓                                                     │
│  User sees formatted review on the right side                  │
│                                                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. FILE STRUCTURE & EXPLANATION

### **Backend Structure:**

```
BackEnd/
├── server.js                          [ENTRY POINT]
│   └── Loads dotenv
│   └── Requires app.js
│   └── Starts server on port 3000
│
├── package.json
│   └── Project metadata & dependencies
│   └── Main file: server.js
│
├── src/
│   ├── app.js                         [EXPRESS SETUP]
│   │   └── Creates Express app
│   │   └── CORS middleware (allows frontend requests)
│   │   └── JSON parser middleware
│   │   └── GET / route (health check)
│   │   └── Uses /ai routes
│   │
│   ├── controllers/
│   │   └── ai.controller.js           [REQUEST HANDLER]
│   │       └── getReview function
│   │       └── Receives request with code
│   │       └── Validates code exists
│   │       └── Calls aiService function
│   │       └── Sends response back to client
│   │
│   ├── routes/
│   │   └── ai.routes.js               [API ENDPOINTS]
│   │       └── POST /ai/get-review
│   │           → Triggers aiController.getReview
│   │
│   └── services/
│       └── ai.service.js              [BUSINESS LOGIC]
│           └── Initializes Google Generative AI SDK
│           └── Creates Gemini model instance
│           └── Sets system instruction (reviewer persona)
│           └── generateContent function:
│               - Takes code as prompt
│               - Sends to Gemini AI
│               - Returns markdown review
│               - Logs response to console
```

### **Frontend Structure:**

```
Frontend/
├── package.json
│   └── Dependencies: React, Vite, Axios, Markdown
│
├── vite.config.js
│   └── Vite build configuration
│   └── React plugin setup
│
├── eslint.config.js
│   └── Code quality rules for JavaScript
│
├── index.html
│   └── HTML entry point
│   └── <div id="root"></div> where React mounts
│
├── src/
│   ├── main.jsx                       [ENTRY POINT]
│   │   └── Renders App component into #root
│   │   └── Imports CSS
│   │
│   ├── App.jsx                        [MAIN COMPONENT]
│   │   └── Uses hooks:
│   │       - useState for code & review state management
│   │       - useEffect for syntax highlighting setup
│   │   └── Two main sections:
│   │       1. Left side: Code Editor
│   │          - react-simple-code-editor component
│   │          - PrismJS for syntax highlighting
│   │          - User can edit code
│   │       2. Right side: Review Display
│   │          - React-Markdown component
│   │          - highlight.js for syntax highlighting
│   │          - Displays AI review
│   │   └── reviewCode function:
│   │       - axios.post() sends code to backend
│   │       - Updates review state with response
│   │   └── Review button triggers review
│   │
│   ├── App.css
│   │   └── Styling for layout (split left-right design)
│   │   └── Button styles
│   │   └── Code editor styles
│   │   └── Review panel styles
│   │
│   └── index.css
│       └── Global styles
│       └── Font configurations
```

---

## 7. KEY CODE FLOWS

### **Backend Request Flow:**

**File: server.js**
```javascript
require('dotenv').config()        // Load API keys from .env
const app = require('./src/app') // Import Express app

app.listen(3000, () => {          // Start server
    console.log('Server running on http://localhost:3000')
})
```

**File: src/app.js**
```javascript
const app = express()
app.use(cors())                   // Enable cross-origin requests
app.use(express.json())           // Parse JSON requests
app.use('/ai', aiRoutes)          // Register /ai routes
```

**File: routes/ai.routes.js**
```javascript
router.post("/get-review", aiController.getReview)
// When POST to /ai/get-review, call getReview function
```

**File: controllers/ai.controller.js**
```javascript
module.exports.getReview = async (req, res) => {
    const code = req.body.code;        // Get code from request
    if (!code) {                       // Validate
        return res.status(400).send("Code is required");
    }
    const response = await aiService(code);  // Get AI review
    res.send(response);                // Send back to client
}
```

**File: services/ai.service.js**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
// Initialize AI with API key from .env file

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are a senior code reviewer...`
    // Set AI personality/instructions
});

async function generateContent(prompt) {
    const result = await model.generateContent(prompt);
    // Send code to Gemini, get review
    return result.response.text();
    // Return markdown formatted review
}
```

### **Frontend Request Flow:**

**File: App.jsx**
```javascript
import axios from 'axios'

function App() {
    const [code, setCode] = useState(`function sum() { return 1 + 1 }`)
    const [review, setReview] = useState(``)

    async function reviewCode() {
        // Send code to backend
        const response = await axios.post(
            'http://localhost:3000/ai/get-review', 
            { code }
        )
        // Update review state with response
        setReview(response.data)
    }

    return (
        <main>
            <div className="left">
                {/* Code Editor */}
                <Editor
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => prism.highlight(...)}
                />
                <button onClick={reviewCode} className="review">
                    Review
                </button>
            </div>
            <div className="right">
                {/* Display Review */}
                <Markdown rehypePlugins={[rehypeHighlight]}>
                    {review}
                </Markdown>
            </div>
        </main>
    )
}
```

---

## 8. HOW GEMINI AI IS USED

**Step 1: Google Generative AI SDK Initialization**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
```

**Step 2: Model Configuration**
```javascript
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",  // Fast, efficient model
    systemInstruction: `You are a senior code reviewer with 7+ years...`
    // This instruction tells AI how to behave
});
```

**Step 3: System Instruction (Persona)**
The system instruction defines:
- **Role:** Senior code reviewer with 7+ years experience
- **What to check:** Code quality, performance, security, best practices
- **How to respond:** Detailed, constructive feedback with code examples
- **Output format:** Markdown with ❌ Bad Code, ✅ Recommended Fix, 💡 Improvements

**Step 4: Sending Code for Review**
```javascript
const result = await model.generateContent(userCode);
return result.response.text();
```

User's code is sent to Google's servers → Gemini analyzes it → Returns markdown review

**Why Gemini 2.0 Flash?**
- ⚡ **Speed:** Processes requests in milliseconds
- 💰 **Cost-effective:** Lower API usage costs
- 🎯 **Accurate:** Understands code structure well
- 📝 **Context:** Can handle reasonable code lengths

---

## 9. IMPORTANT NPM COMMANDS

### **Backend Commands:**

```bash
# Install dependencies
npm install

# Run the server
node server.js

# Or with nodemon (auto-restart on code changes)
npm install -g nodemon
nodemon server.js

# What each command does:
# - npm install: Downloads all packages from package.json
# - node server.js: Starts the Express server
# - nodemon: Watches for file changes and restarts automatically
```

### **Frontend Commands:**

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
# Output: "Local: http://localhost:5173"
# Hot reload: Changes appear instantly without refresh

# Build for production
npm build
# Creates optimized build in /dist folder

# Run linter to check code quality
npm run lint
# Shows formatting/style issues

# Preview production build
npm run preview
# Test the production build locally

# What each command does:
# - npm run dev: Development server with live reloading
# - npm run build: Minifies and optimizes code for deployment
# - npm run lint: Finds code quality issues
# - npm run preview: Shows what production build will look like
```

---

## 10. TECHNOLOGY CHOICES EXPLAINED

### **Why Node.js + Express for Backend?**
- ✅ JavaScript both frontend and backend (one language)
- ✅ Lightweight and fast for I/O operations
- ✅ Large ecosystem with libraries
- ✅ Non-blocking, event-driven architecture
- ✅ Great for APIs and microservices
- ❌ Not ideal for CPU-heavy computations

### **Why React + Vite for Frontend?**
- ✅ React: Component-based, reusable UI logic
- ✅ Vite: 30-40x faster builds than Webpack
- ✅ Hot Module Replacement (HMR): Instant updates
- ✅ Both are industry standards
- ✅ Great developer experience
- ✅ Vite produces tiny production bundles

### **Why Google Gemini AI?**
- ✅ State-of-the-art LLM (Large Language Model)
- ✅ Fast responses with "flash" model
- ✅ Understands multiple programming languages
- ✅ Good at code analysis and suggestions
- ✅ Official SDK makes integration easy
- ✅ Scalable (handles millions of requests)

### **Why CORS Middleware?**
- ✅ Frontend (localhost:5173) needs to call backend (localhost:3000)
- ✅ Different ports = cross-origin request
- ✅ CORS allows this safely
- ✅ Security: only allows frontend to make requests

---

## 11. HOW TO START THE PROJECT

### **Start Backend:**

```bash
# Navigate to BackEnd folder
cd BackEnd

# Install dependencies (first time only)
npm install

# Create .env file with API key
echo "GOOGLE_GEMINI_KEY=your_api_key_here" > .env

# Start the server
node server.js

# Output: "Server is running on http://localhost:3000"
```

### **Start Frontend (in new terminal):**

```bash
# Navigate to Frontend folder
cd Frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Output: "Local: http://localhost:5173"
```

### **How to Get API Key:**

1. Go to https://aistudio.google.com/app/apikeys
2. Create new API key
3. Copy and paste in .env file
4. Save file

### **Test the App:**

1. Open http://localhost:5173 in browser
2. You should see code editor on left
3. Default code: `function sum() { return 1 + 1 }`
4. Click "Review" button
5. Wait 2-5 seconds for AI response
6. See review on right side

---

## 12. POTENTIAL INTERVIEW QUESTIONS & ANSWERS

### **Q1: How does the frontend communicate with the backend?**

**Answer:** 
The frontend uses Axios (HTTP client) to send POST requests to the backend. When a user clicks the "Review" button, the code is sent as JSON to `http://localhost:3000/ai/get-review`. The backend processes it and sends back the AI review as a string. The response is displayed using React Markdown component.

**Technical flow:**
```
React Component State → User clicks Review → axios.post() 
→ Backend Express endpoint → Google Gemini API 
→ Response back to Frontend → React state update → Re-render with review
```

### **Q2: What happens if the user sends empty code?**

**Answer:**
In the controller, we validate:
```javascript
if (!code) {
    return res.status(400).send("Code is required");
}
```
Returns HTTP 400 (Bad Request) error. Frontend doesn't handle this currently but should show error message.

**Improvement:** Add error handling in frontend:
```javascript
try {
    const response = await axios.post(...)
    setReview(response.data)
} catch (error) {
    setReview("Error: " + error.response.data)
}
```

### **Q3: Why use React hooks like useState and useEffect?**

**Answer:**
- **useState:** Manages component state (code and review). When state updates, React re-renders the component with new values.
- **useEffect:** Runs side effects. Here it initializes PrismJS syntax highlighting after component mounts. Dependencies: [] means it runs once.

### **Q4: Explain the system instruction in Gemini.**

**Answer:**
The system instruction defines AI behavior/personality. Our instruction tells Gemini:
- Act as senior code reviewer (7+ years experience)
- Check: quality, performance, security, best practices, scalability
- Provide: constructive feedback with examples
- Format: ❌ Issues, ✅ Fixes, 💡 Improvements

This makes responses consistent, detailed, and professional.

### **Q5: What's the difference between .env and environment variables in code?**

**Answer:**
- **`.env` file:** Plain text file storing secrets locally (not in git)
- **`process.env`:** Access environment variables in Node.js code
- **`dotenv` package:** Reads .env file and loads into process.env

Why? Never hardcode API keys in code for security. .env keeps them separate.

### **Q6: Why is CORS needed?**

**Answer:**
Browsers block requests from domain A (frontend: localhost:5173) to domain B (backend: localhost:3000) for security. CORS tells browser: "This is allowed." Without CORS, frontend couldn't call backend APIs.

### **Q7: How would you handle API rate limiting?**

**Answer:**
Gemini has request limits. Solutions:
1. Implement queue: store requests, process sequentially
2. Cache results: same code → don't call API again
3. Set timeouts: if taking >30s, fail gracefully
4. Implement backoff: if rate limited, wait and retry

Example:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
```

### **Q8: How would you improve this application?**

**Answer:**

1. **Database:** Store code reviews in MongoDB to show history
2. **Authentication:** Let users save their reviews (with login)
3. **Multiple Languages:** Support Python, Java, C++, not just JavaScript
4. **Export:** Download reviews as PDF/Word documents
5. **Sharing:** Generate shareable links for code reviews
6. **Collaborative:** Multiple users reviewing same code
7. **Advanced Filtering:** Filter reviews by issue type (performance, security, etc.)
8. **Versioning:** Compare different versions of same code

---

## 13. SCALABILITY DISCUSSION

### **Current Limitations:**

1. **Single Backend Instance:** Only one server. If 1000 requests come → bottleneck
2. **Memory:** Stores data only in RAM (lost on restart)
3. **API Rate Limits:** Gemini has request limits
4. **No Database:** Can't persist reviews
5. **No Authentication:** Can't track users

### **How to Scale:**

#### **Scale Backend:**
```
1. Load Balancing: Multiple backend servers
   - Use Nginx/HAProxy to distribute requests
   - If server 1 is busy → route to server 2

2. Caching: Redis cache
   - Same code reviewed before? Return cached result
   - Reduce API calls to Gemini

3. Message Queues: Bull/RabbitMQ
   - User requests → Queue → Workers process them
   - Prevents overload

4. Microservices: Split into separate services
   - Auth Service, Review Service, Database Service
   - Scale each independently
```

#### **Scale Frontend:**
```
1. CDN: Serve static assets from edge locations
   - Users in India → download from Asia CDN
   - Users in US → download from US CDN
   - Faster loading

2. Lazy Loading: Load components as needed
   - Don't load everything at start
   - Only load review section when needed

3. Code Splitting: Split bundle into chunks
   - User downloads only what they need
   - Faster initial load
```

#### **Scale Database (when added):**
```
1. MongoDB Replication: Multiple copies of data
   - If one server fails → switch to replica
   - High availability

2. Sharding: Split data across multiple servers
   - Reviews 1-1M → Server 1
   - Reviews 1M-2M → Server 2
   - Parallel queries

3. Indexing: Speed up queries
   - Index by userId, timestamp, language
   - Fast lookups
```

#### **Scale API Calls:**
```
1. Batch Processing: Process multiple reviews together
2. Async Processing: Don't wait for immediate response
3. AI Model Alternatives: Cheaper/faster models for simple reviews
4. Fallback Options: If Gemini down, use OpenAI or Claude
```

### **Architecture After Scaling:**

```
Users (Global)
    ↓
CDN (Serves Static Files)
    ↓
Load Balancer (Nginx)
    ├─ Backend Server 1
    ├─ Backend Server 2
    ├─ Backend Server 3
    ↓
Cache Layer (Redis)
    ↓
Message Queue (RabbitMQ)
    ├─ Worker 1 (Processes reviews)
    ├─ Worker 2 (Processes reviews)
    ├─ Worker 3 (Processes reviews)
    ↓
Database (MongoDB Cluster)
    ├─ Primary Server
    ├─ Secondary Server 1
    ├─ Secondary Server 2
    ↓
External APIs
    ├─ Google Gemini
    ├─ Alternative AI (Claude, OpenAI)
```

---

## 14. DATABASE STRUCTURE (When Added)

If we add MongoDB, here's the schema:

```javascript
// Users Collection
db.users.insertOne({
    _id: ObjectId(),
    username: "john_dev",
    email: "john@example.com",
    passwordHash: "hashed_password",
    createdAt: new Date(),
    subscription: "pro"
})

// Code Reviews Collection
db.codeReviews.insertOne({
    _id: ObjectId(),
    userId: ObjectId("user_id"),
    code: "function sum() { return 1 + 1 }",
    language: "javascript",
    review: "❌ Code quality issues...",
    rating: 4.5,
    timestamp: new Date(),
    tags: ["performance", "readability"],
    isPublic: true
})

// API Usage Tracking
db.apiUsage.insertOne({
    _id: ObjectId(),
    userId: ObjectId("user_id"),
    date: new Date("2026-04-01"),
    requestsCount: 25,
    tokensUsed: 15000
})
```

Benefits:
- ✅ Persistent data
- ✅ Query user history
- ✅ Analytics and insights
- ✅ Billing tracking

---

## 15. SUMMARY TABLE

| Aspect | Details |
|--------|---------|
| **Project Type** | Full-stack AI application |
| **Purpose** | AI-powered code review platform |
| **Backend** | Node.js + Express + Google Gemini |
| **Frontend** | React + Vite |
| **Main API** | POST /ai/get-review |
| **Programming Language** | JavaScript (both sides) |
| **Local Ports** | Backend: 3000, Frontend: 5173 |
| **Database** | None (planned: MongoDB) |
| **Key Library** | @google/generative-ai |
| **Code Editor** | react-simple-code-editor |
| **Markdown Rendering** | react-markdown |
| **HTTP Client** | Axios |
| **Build Tool** | Vite |
| **Authentication** | None (planned: JWT) |
| **Deployment** | Can deploy on: Vercel, Netlify, AWS, Google Cloud |

---

## 16. QUICK FACTS FOR INTERVIEW

✅ **What is this project?**
An AI-powered code review tool that analyzes code using Google Gemini and provides detailed feedback on quality, performance, and best practices.

✅ **Tech stack?**
Frontend: React + Vite. Backend: Node.js + Express. AI: Google Generative AI (Gemini).

✅ **Why these technologies?**
React for fast UI, Vite for lightning-fast builds, Express for lightweight API, Gemini for state-of-the-art AI.

✅ **How does it work?**
User types code → Clicks Review → Axios sends to backend → Backend calls Gemini API → Gemini analyzes code → Returns markdown review → Frontend displays formatted review.

✅ **APIs used?**
1. Internal: /ai/get-review endpoint. 2. External: Google Generative AI API.

✅ **What's an API?**
Interface that defines how two programs communicate. Like a waiter between customer and kitchen.

✅ **Database?**
Currently in-memory only. Could add MongoDB for persistence.

✅ **How to scale?**
Use load balancing, caching (Redis), message queues, database replication, and CDN.

✅ **Potential improvements?**
User authentication, review history, multiple languages, PDF export, collaborative reviews, advanced filtering.

---

## 17. KEY CONCEPTS EXPLAINED SIMPLY

### **REST API**
Contract between client and server. Client asks for data in specific format, server responds in agreed format.

### **HTTP Methods**
- **GET:** Retrieve data (no body)
- **POST:** Send data to create something (has body)
- **PUT:** Update existing data
- **DELETE:** Remove data

We use POST because we're sending code.

### **Middleware**
Function that processes requests before reaching endpoint.
- CORS: Allows cross-origin requests
- express.json(): Parses JSON request bodies

### **Async/Await**
```javascript
async function reviewCode() {
    const response = await axios.post(...);
    // Wait for response before continuing
    setReview(response.data)
}
```

### **State Management (React)**
```javascript
const [code, setCode] = useState("")
// code: current value
// setCode: function to update value
// When setCode is called → component re-renders
```

### **Promises**
An operation that hasn't finished yet but will eventually.
```javascript
axios.post(...) // Returns promise
    .then(response => console.log(response)) // When it finishes
    .catch(error => console.log(error)) // If it fails
```

---

## FINAL CHECKLIST FOR INTERVIEW

Before the interview, you should be able to explain:

- [ ] What the project does (AI code reviewer)
- [ ] Why each technology was chosen
- [ ] How frontend and backend communicate (Axios + HTTP)
- [ ] Complete user flow (step-by-step)
- [ ] How Google Gemini is integrated
- [ ] What each file does
- [ ] Key npm commands and what they do
- [ ] How to start both frontend and backend
- [ ] What an API is and how to use it
- [ ] Potential questions and answers
- [ ] How to scale the application
- [ ] Database structure if added
- [ ] Key concepts (async/await, state, promises, etc.)
