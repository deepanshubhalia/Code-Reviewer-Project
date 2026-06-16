# AI Code Reviewer - Interview Code Walk-through

## Key Code Examples with Explanations

---

## 1. FRONTEND: App.jsx - Main Component

### **Full Code**
```javascript
import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  // State for code input
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  // State for AI review
  const [review, setReview] = useState(``)

  // Initialize syntax highlighting
  useEffect(() => {
    prism.highlightAll()
  }, [])

  // Send code to backend for review
  async function reviewCode() {
    const response = await axios.post(
      'http://localhost:3000/ai/get-review',
      { code }
    )
    setReview(response.data)
  }

  return (
    <>
      <main>
        {/* LEFT SIDE: CODE EDITOR */}
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => 
                prism.highlight(
                  code, 
                  prism.languages.javascript, 
                  "javascript"
                )
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          {/* REVIEW BUTTON */}
          <div
            onClick={reviewCode}
            className="review">
            Review
          </div>
        </div>

        {/* RIGHT SIDE: REVIEW DISPLAY */}
        <div className="right">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
          >
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App
```

### **What Each Part Does:**

**Imports (Lines 1-8):**
```javascript
import { useState, useEffect } from 'react'           // React hooks
import Editor from "react-simple-code-editor"         // Code editor component
import Markdown from "react-markdown"                 // Render markdown review
import axios from 'axios'                             // HTTP client
import "./App.css"                                    // Styling
```
Purpose: Import everything needed for the component

**State Management (Lines 12-19):**
```javascript
const [code, setCode] = useState('function sum() { return 1 + 1 }')
// code: holds user's code
// setCode: function to update code when user types

const [review, setReview] = useState('')
// review: holds AI's review
// setReview: function to update review when response arrives
```
Purpose: Store component data that changes

**Syntax Highlighting Setup (Lines 21-24):**
```javascript
useEffect(() => {
  prism.highlightAll()      // Initialize syntax highlighting
}, [])                       // [] means run once on mount
```
Purpose: Set up code highlighting when component loads

**HTTP Request to Backend (Lines 26-32):**
```javascript
async function reviewCode() {
  const response = await axios.post(
    'http://localhost:3000/ai/get-review',  // Backend URL
    { code }                                  // Send code
  )
  setReview(response.data)  // Update review with response
}
```
Purpose: Send code to backend and get review

**JSX (Lines 34-79):**
- Left side: Code editor (`<Editor>`) where user types
- Button: "Review" button that calls `reviewCode()`
- Right side: Markdown component displays review

---

## 2. BACKEND: server.js - Entry Point

### **Code**
```javascript
require('dotenv').config()              // Load .env variables
const app = require('./src/app')        // Import Express app

app.listen(3000, () => {                // Start server
    console.log('Server is running on http://localhost:3000')
})
```

### **Explanation:**
- Line 1: Load environment variables from `.env` file (API key stored there)
- Line 2: Import Express app configuration
- Line 4: Start Express server on port 3000
- Line 5: Log message confirming server started

### **Key Concept - Why .env?**
```javascript
// ❌ BAD: API key exposed in code
const apiKey = "sk-proj-abc123xyz"
module.exports = { apiKey }

// ✓ GOOD: API key in .env file (not in git)
// .env file:
// GOOGLE_GEMINI_KEY=sk-proj-abc123xyz

// Access in code:
const apiKey = process.env.GOOGLE_GEMINI_KEY
```
Never commit API keys to GitHub!

---

## 3. BACKEND: src/app.js - Express Setup

### **Code**
```javascript
const express = require('express')
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express()

// MIDDLEWARE SECTION
app.use(cors())                    // Allow cross-origin requests
app.use(express.json())            // Parse JSON request bodies

// ROUTES SECTION
app.get('/', (req, res) => {
    res.send('Hello World')        // Health check
})

app.use('/ai', aiRoutes)           // Use /ai routes

module.exports = app
```

### **Middleware Explanation:**

**What is middleware?**
Function that processes request before reaching endpoint.

Think of it as a security checkpoint:
```
Request → Security Gate (CORS check) → Metal Detector (JSON parse) → Endpoint
```

**CORS Middleware:**
```javascript
app.use(cors())
// Problem: Frontend at localhost:5173 calls backend at localhost:3000
// Browser blocks this for security (different ports = different origin)
// CORS says: "This is allowed!"
```

**JSON Parser:**
```javascript
app.use(express.json())
// Problem: Request body is raw bytes
// Solution: Parse it into JavaScript object
// { "code": "..." } → JavaScript object we can use
```

---

## 4. BACKEND: src/routes/ai.routes.js - API Endpoint Definition

### **Code**
```javascript
const express = require('express')
const aiController = require("../controllers/ai.controller")

const router = express.Router()

router.post("/get-review", aiController.getReview)
// POST /ai/get-review → calls getReview function

module.exports = router
```

### **How Routing Works:**
```
User sends: POST http://localhost:3000/ai/get-review
                                       ↓
app.use('/ai', aiRoutes)         // Routes are under /ai
                                       ↓
router.post("/get-review", ...)  // Matches /get-review
                                       ↓
aiController.getReview           // Calls this function
```

---

## 5. BACKEND: src/controllers/ai.controller.js - Request Handler

### **Code**
```javascript
const aiService = require("../services/ai.service")

module.exports.getReview = async (req, res) => {
    
    // Extract code from request body
    const code = req.body.code
    
    // VALIDATION: Check if code exists
    if (!code) {
        return res.status(400).send("Code is required")
    }
    
    // BUSINESS LOGIC: Call service to get review
    const response = await aiService(code)
    
    // RESPONSE: Send review back to client
    res.send(response)
}
```

### **Step-by-Step Breakdown:**

**Step 1: Extract Data**
```javascript
const code = req.body.code
// req.body = { "code": "function sum() { ... }" }
// code = "function sum() { ... }"
```

**Step 2: Validate**
```javascript
if (!code) {
    return res.status(400).send("Code is required")
}
// If code is empty/null → return error (400 = Bad Request)
// Don't proceed to next step
```

**Step 3: Process**
```javascript
const response = await aiService(code)
// Call service function with code
// await = wait for it to complete (service calls Gemini, takes 2-5 seconds)
```

**Step 4: Respond**
```javascript
res.send(response)
// Send markdown review back to frontend
```

### **HTTP Status Codes:**
```
200: OK (success)
400: Bad Request (client error - missing code)
404: Not Found (endpoint doesn't exist)
500: Server Error (backend crashed)
```

---

## 6. BACKEND: src/services/ai.service.js - Gemini Integration

### **Code**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai")

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY)

// Create AI model instance
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
        Here's a solid system instruction for your AI code reviewer:
        
        AI System Instruction: Senior Code Reviewer (7+ Years of Experience)
        
        Role & Responsibilities:
        You are an expert code reviewer with 7+ years of development experience.
        
        Your role is to analyze, review, and improve code. You focus on:
        - Code Quality: Ensuring clean, maintainable, and well-structured code
        - Best Practices: Suggesting industry-standard coding practices
        - Efficiency & Performance: Identifying areas to optimize
        - Error Detection: Spotting potential bugs and security risks
        - Scalability: Advising on how to make code adaptable for future growth
        
        Guidelines for Review:
        1. Provide Constructive Feedback: Be detailed yet concise
        2. Suggest Code Improvements: Offer refactored versions
        3. Detect & Fix Performance Bottlenecks
        4. Ensure Security Compliance
        5. Promote Consistency
        6. Follow DRY (Don't Repeat Yourself) & SOLID Principles
        7. Identify Unnecessary Complexity
        8. Verify Test Coverage
        9. Ensure Proper Documentation
        10. Encourage Modern Practices
        
        Output Format:
        ❌ Bad Code: [Show the problem]
        🔍 Issues: [List problems]
        ✅ Recommended Fix: [Show improved code]
        💡 Improvements: [Explain why it's better]
    `
});

// Function to generate review
async function generateContent(prompt) {
    const result = await model.generateContent(prompt)
    console.log(result.response.text())
    return result.response.text()
}

module.exports = generateContent
```

### **Part-by-Part Explanation:**

**Step 1: Import and Initialize**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY)
```
- Import Google's SDK
- Initialize with API key from environment

**Step 2: Create Model**
```javascript
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",    // Which AI model to use
    systemInstruction: "..."       // How to behave
})
```
- Model: "gemini-2.0-flash" = fast, efficient version
- System Instruction: Tells AI to act as senior code reviewer

**Step 3: Send to AI**
```javascript
const result = await model.generateContent(prompt)
// prompt = user's code
// result = AI's review (markdown format)
```

**Step 4: Return Review**
```javascript
return result.response.text()
// Extract text from response and return
```

### **Why "System Instruction"?**
Without it: User sends code → AI randomly generates response  
With it: User sends code → AI follows instructions → Professional review

Think of it like:
```
System Instruction = How Google Gemini should behave
                   = What role to play (code reviewer)
                   = What to pay attention to
                   = How to format response
```

---

## 7. COMPARISON: Before & After Improvement

### **Current Implementation (Works, but Issues)**

```javascript
// ❌ ISSUES:
// 1. No error handling in frontend
// 2. No rate limiting
// 3. No database (can't save reviews)
// 4. No authentication (anyone can use it)
// 5. No caching (same code = multiple API calls)

// Current flow:
User → [View review] → But if network error... nothing happens
```

### **Improved Implementation**

```javascript
// ✅ IMPROVEMENTS:

// 1. Error Handling
async function reviewCode() {
    try {
        const response = await axios.post(...)
        setReview(response.data)
    } catch (error) {
        setReview(`Error: ${error.message}`)
    }
}

// 2. Rate Limiting (Backend)
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,  // 100 requests per 15 minutes
    message: 'Too many requests, please try later'
})
app.use('/ai/get-review', limiter)

// 3. Caching with Redis
const redis = require('redis')
const client = redis.createClient()

async function generateContent(code) {
    // Check if we already reviewed this code
    const hash = crypto.createHash('sha256').update(code).digest('hex')
    const cached = await client.get(hash)
    
    if (cached) {
        return cached  // Return instantly! ⚡
    }
    
    // First time: call Gemini
    const review = await model.generateContent(code)
    
    // Save for 24 hours
    await client.setEx(hash, 86400, review)
    
    return review
}

// 4. Database (MongoDB)
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    userId: String,
    code: String,
    review: String,
    createdAt: { type: Date, default: Date.now }
})

const Review = mongoose.model('Review', ReviewSchema)

// Save review to database
await Review.create({
    userId: req.user.id,
    code: code,
    review: response
})

// 5. Authentication (JWT)
const jwt = require('jsonwebtoken')

// After login
const token = jwt.sign({ userId: user._id }, 'secret_key')

// On protected routes
router.post('/get-review', authenticateToken, aiController.getReview)

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']
    
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.status(403).send('No access')
        req.user = user
        next()
    })
}
```

---

## 8. Testing Examples

### **Unit Test - Controller**
```javascript
// npm install --save-dev jest

const aiController = require('../controllers/ai.controller')
const aiService = require('../services/ai.service')

jest.mock('../services/ai.service')

describe('AI Controller', () => {
    
    it('should return error if code is missing', async () => {
        const req = { body: { code: '' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        
        await aiController.getReview(req, res)
        
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith('Code is required')
    })
    
    it('should return review if code is valid', async () => {
        const mockReview = '❌ Issues found...'
        aiService.mockResolvedValue(mockReview)
        
        const req = { body: { code: 'function sum() { return 1+1 }' } }
        const res = { send: jest.fn() }
        
        await aiController.getReview(req, res)
        
        expect(res.send).toHaveBeenCalledWith(mockReview)
    })
})
```

### **Integration Test - Full Flow**
```javascript
const request = require('supertest')
const app = require('../src/app')

describe('API Integration Test', () => {
    
    it('should review code end-to-end', async () => {
        const response = await request(app)
            .post('/ai/get-review')
            .send({ code: 'var x = 1' })
        
        expect(response.status).toBe(200)
        expect(response.text).toContain('Issues') // Response contains issues
    })
})
```

### **Frontend Test - React Component**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
    
    it('should update code state when typing', () => {
        render(<App />)
        const editor = screen.getByDisplayValue('function sum()')
        
        fireEvent.change(editor, { target: { value: 'new code' } })
        
        expect(editor).toHaveValue('new code')
    })
    
    it('should display loading state while fetching review', async () => {
        render(<App />)
        const button = screen.getByText('Review')
        
        fireEvent.click(button)
        // Review loading...
        
        await waitFor(() => {
            expect(screen.getByText(/Issues/i))
        })
    })
})
```

---

## 9. Performance Optimization Examples

### **Before: Slow Queries**
```javascript
// ❌ Inefficient: N+1 query problem
const reviews = await Review.find()
for (let review of reviews) {
    const user = await User.findById(review.userId)  // Query per review!
}
// If 1000 reviews: 1000 database queries 🐌
```

### **After: Fast with Join**
```javascript
// ✓ Efficient: Single query
const reviews = await Review.find()
    .populate('userId')  // Join with User collection
    .lean()              // Don't load all fields
// 1 database query 🚀
```

### **Before: Unoptimized**
```javascript
// ❌ Slow: Full code stored, every query searches entire field
db.reviews.find({ code: { $regex: 'pattern' } })
// Searches entire 50KB code string for each review
```

### **After: Optimized with Indexing**
```javascript
// ✓ Fast: Index on important fields
db.reviews.createIndex({ language: 1, createdAt: -1 })

// Query uses index (milliseconds instead of seconds)
db.reviews.find({ language: 'javascript' }).sort({ createdAt: -1 })
```

---

## 10. Deployment Example (Firebase)

### **Deploy Frontend**
```bash
# Install Firebase tools
npm install -g firebase-tools
firebase login

# Build production bundle
npm run build

# Deploy
firebase deploy --only hosting
# Output: https://code-reviewer.firebaseapp.com
```

### **Deploy Backend (Heroku)**
```bash
# Install Heroku CLI
npm install -g heroku
heroku login

# Create app
heroku create code-reviewer-api

# Set environment variables
heroku config:set GOOGLE_GEMINI_KEY=your_key

# Deploy
git push heroku main
# Output: https://code-reviewer-api.herokuapp.com
```

### **Update Frontend API URL**
```javascript
// Frontend: Change localhost to production URL
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://code-reviewer-api.herokuapp.com'
    : 'http://localhost:3000'

const response = await axios.post(`${API_URL}/ai/get-review`, { code })
```

---

## Quick Interview Talking Points

**"The architecture follows MVC pattern:"**
- Model: Database (future enhancement)
- View: React components
- Controller: Express handlers

**"We use async/await for non-blocking operations:"**
```javascript
// Non-blocking: UI stays responsive
async function reviewCode() {
    const response = await axios.post(...)  // Wait, don't block
    setReview(response.data)
}
```

**"Separation of concerns into layers:"**
```
Frontend (UI) ← HTTP → Backend (API) ← SDK → AI (Google)
     ↑                      ↑               ↑
   React                 Express        Gemini
  Handles UI         Handles requests   Analyzes code
```

**"We handle errors at multiple levels:"**
```
Frontend: try-catch on API calls
Backend: Validation + error middleware
AI: Fallback if API fails
```

**"Scalability strategy:"**
```
Current: Single server
Next: Load balancing + Caching (Redis)
Then: Database + Message queues
Finally: Multi-region + Sharding
```

---

## Sticky Notes for Interview

**Remember to mention:**
✅ MVC architecture pattern  
✅ Async/await for performance  
✅ Separation of concerns (controller, service)  
✅ Error handling at multiple layers  
✅ Caching strategy (with Redis)  
✅ Database schema (MongoDB)  
✅ Scaling approach (load balancer, queues)  
✅ Authentication strategy (JWT)  
✅ Testing pyramid (unit, integration, e2e)  

**Topics to avoid:**
❌ Don't get too deep into AI ML concepts (not relevant)  
❌ Don't over-engineer if asked "How would you do X?"  
❌ Don't say "I don't know" - say "Good question, I would research..."
