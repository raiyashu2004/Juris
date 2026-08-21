<div align="center">
  <img src="./frontend/public/juris_app_icon_dark.png" width="90" height="90" alt="Juris Logo" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  <h1>Juris — Indian Legal Intelligence & Research System</h1>
  <p><strong>Authoritative computational legal research, case law discovery, and contract risk analysis built strictly for Indian jurisprudence.</strong></p>
  <p>
    <a href="https://botjuris-six.vercel.app">🚀 Live Web Application</a> •
    <a href="https://github.com/raiyashu2004/Juris">📦 GitHub Repository</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Concurrency-50%2B%20Concurrent%20Users-blue?style=flat-square" alt="Concurrency" />
    <img src="https://img.shields.io/badge/Security-OWASP%20Hardened-green?style=flat-square" alt="Security" />
    <img src="https://img.shields.io/badge/AI%20Engine-Gemini%203.1%20Flash-orange?style=flat-square" alt="AI Engine" />
    <img src="https://img.shields.io/badge/Framework-FastAPI%20%7C%20React%2018-black?style=flat-square" alt="Framework" />
  </p>

  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#architecture--security">Architecture & Security</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-reference">API Reference</a>
</div>

<br/>

---

## 🏛️ Overview

**Juris** is an enterprise-grade legal tech platform built specifically for Indian advocates, corporate counsel, and legal researchers. It addresses the fundamental bottlenecks of modern Indian practice: exhaustive precedent searching, contract risk inspection, and accurate procedural drafting under the Constitution of India, Bharatiya Nyaya Sanhita (BNS / IPC), Bharatiya Nagarik Suraksha Sanhita (BNSS / CrPC), and decades of Supreme Court and High Court rulings.

Built with an authoritative **Gazette Editorial design system** and powered by a high-concurrency **FastAPI + LangChain** backend, Juris operates with strict anti-hallucination guardrails and verified citations.

---

## ✨ Key Features

- **Smart Legal Research & RAG Pipeline**: Ask complex factual briefs and receive structured ratio decidendi grounded in verified bare acts and court rulings without citation hallucinations.
- **Contract & Document Risk Analyzer**: Upload legal documents (PDF, DOCX, TXT) for clause-by-clause inspection, missing clause detection, and statutory compliance checks.
- **Precedent & Case Finder**: Discover relevant Supreme Court and High Court judgments by querying case facts or statutory provisions.
- **Procedural Drafting Assistant**: Accelerate preparation of anticipatory bail petitions, writ petitions, and legal notices formatted to standard court conventions.
- **Persistent Conversational Memory**: Multi-turn dialogue management with domain guardrails (Constitutional, Criminal, Civil, Family, Property, Labour).

---

## 🛡️ Architecture & Security

Juris is engineered for **high concurrency (50+ simultaneous active sessions)** with defense-in-depth security:

```
                  ┌────────────────────────────────────────┐
                  │          Inbound Web Traffic           │
                  └──────────────────┬─────────────────────┘
                                     │
                 ┌───────────────────▼──────────────────────┐
                 │  Multi-Layer Security Middleware Stack   │
                 │  - OWASP Security Headers (CSP, HSTS...) │
                 │  - Sliding-Window Token Bucket Limiter   │
                 │  - Hardened CORS & Request Sanitizer     │
                 │  - Global Exception Sanitizer & Tracing  │
                 └───────────────────┬──────────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             │                                               │
  ┌──────────▼──────────────┐                    ┌───────────▼───────────┐
  │  FastAPI Async Routers  │                    │ Non-blocking Document │
  │  (Auth, Chat, Cases)    │                    │ Parser (PyMuPDF/Docx) │
  └──────────┬──────────────┘                    └───────────┬───────────┘
             │                                               │
             │                                   ┌───────────▼───────────┐
             │                                   │ ThreadPool Offloader  │
             │                                   │ (Prevents Event Loop  │
             │                                   │  Starvation)          │
             │                                   └───────────┬───────────┘
             │                                               │
  ┌──────────▼───────────────────────────────────────────────▼───────────┐
  │              Shared Resource & Connection Pools                      │
  │  - Async HTTP Connection Pool (Keep-Alive, DNS Cache, 100 conns)     │
  │  - AsyncPG Database Pool (min=10, max=60, acquire timeout)           │
  │  - Thread-Safe LRU Session Memory Manager with Auto-Eviction         │
  └──────────────────────────────────────────────────────────────────────┘
```

### Security Highlights:
1. **OWASP Security Headers**: Comprehensive response protection with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Strict-Transport-Security`, `Content-Security-Policy`, and `Referrer-Policy`.
2. **Sliding-Window Rate Limiter**: Route-level token bucket rate limiting preventing DoS attacks and credential stuffing without external Redis dependencies.
3. **Magic-Byte File Verification**: Verifies true file signatures (`%PDF-`, `PK\x03\x04`, `\x89PNG`, `\xff\xd8\xff`) to protect against disguised malicious executables and decompression bombs.
4. **Path Traversal Sanitization**: Strips directory traversal sequences (`../../etc/passwd`) and normalizes path separators.
5. **No Stack Trace Disclosure**: Sanitized error responses prevent server internals or filepaths from leaking to clients.
6. **Threadpool Offloading**: CPU-intensive document processing is offloaded to background threads, ensuring sub-millisecond response times for concurrent users.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Material Symbols, Lora (Serif) & Plus Jakarta Sans / Inter / JetBrains Mono |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, LangChain |
| **AI / LLM** | Google Gemini (`gemini-3.1-flash-lite`), LangChain Google GenAI |
| **Vector DB** | PostgreSQL (`pgvector`), AsyncPG Connection Pool (10–60 connections) |
| **Document Processing** | PyMuPDF (fitz), Python-Docx, Async I/O Threadpool |
| **Deployment** | Vercel (Frontend SPA) & Render (Backend API) |

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/raiyashu2004/Juris.git
cd Juris
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` in `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://juris:juris_secret@localhost:5432/juris
JWT_SECRET=your_secure_random_jwt_secret
```

Launch FastAPI server:
```bash
uvicorn main:app --reload --port 10000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:
```env
VITE_BACKEND_URL=http://localhost:10000
```

Start Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System health check & active session telemetry |
| `/api/chat/generic-stream` | `POST` | LangChain SSE streaming proxy with context injection |
| `/api/chat/generic` | `POST` | Non-streaming conversational endpoint |
| `/api/chat/ask` | `POST` | Scoped legal research RAG query with citation extraction |
| `/api/documents/analyse` | `POST` | Multi-format legal document analyzer (PDF, DOCX, TXT) |
| `/api/cases/search` | `GET` | Case law precedent search across vector DB & Kanoon |
| `/api/cases/similar` | `GET` | Similar case finder based on factual briefs |
| `/api/auth/register` | `POST` | Rate-limited advocate registration |
| `/api/auth/login` | `POST` | Rate-limited JWT authentication |

---

## 📜 Legal Disclaimer

*Juris is an artificial intelligence research and workflow tool designed for advocates and legal professionals. It does not provide formal legal advice and does not create an attorney-client relationship under the Advocates Act, 1961. Always independently verify statutory provisions and judicial citations before making court submissions.*

---

<div align="center">
  <sub>© 2026 Juris Legal Systems. All Rights Reserved.</sub>
</div>
