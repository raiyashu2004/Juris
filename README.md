<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/scale.svg" width="80" height="80" alt="NyayaBot Logo" />
  <h1>NyayaBot — Indian Legal AI Assistant</h1>
  <p>A serverless, AI-powered legal research and drafting platform built for Indian advocates and law students. Powered by Gemini AI and Supabase.</p>

  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a>
</div>

<br/>

## ⚖️ Overview

NyayaBot is a modern legal tech application designed to solve the biggest pain points in Indian legal practice: endless precedent searching, manual contract review, and formatting standard drafts. 

Unlike generic AI chat tools, NyayaBot strictly operates within the boundaries of Indian law (Constitution, IPC/BNS, CrPC, etc.) and emphasizes **anti-hallucination** by requiring verified citations for legal claims.

## ✨ Features

- **Smart Legal Research**: Ask complex legal questions and get plain-English answers backed by Indian case law and bare acts.
- **Contract Risk Analysis**: Upload a lease or employment agreement. NyayaBot instantly flags one-sided clauses and missing protections before your client signs.
- **Precedent Search**: Describe your case facts to pull up the most relevant Supreme Court and High Court judgments.
- **Drafting Assistant**: Generate standard bail applications, writ petitions, and legal notices with proper Indian court formatting.
- **In-App Legal Feed**: A live feed aggregating the latest legal news, supreme court judgments, and gazette notifications.
- **Cloud Vault**: Securely upload, store, and manage your legal documents in the cloud.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS
- **Backend & Auth**: Supabase (PostgreSQL, Authentication, Storage)
- **AI Engine**: Google Gemini (gemini-2.5-flash)
- **Icons**: Lucide React
- **Deployment**: Vercel (Recommended)

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/raiyashu2004/nyayabot.git
cd nyayabot/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory and add your keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Setup Supabase Infrastructure
In your Supabase SQL Editor, run the following to create the required tables and storage buckets:
```sql
-- Create Document Metadata Table
CREATE TABLE documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  file_name text not null,
  file_type text not null,
  file_size text not null,
  storage_path text not null,
  status text default 'Analyzed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own docs" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own docs" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own docs" ON documents FOR DELETE USING (auth.uid() = user_id);

-- Create Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('nyayabot_docs', 'nyayabot_docs', false);

-- Enable Storage Security Policies
CREATE POLICY "Users upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nyayabot_docs' AND (auth.uid()::text = (storage.foldername(name))[1]));
CREATE POLICY "Users read files" ON storage.objects FOR SELECT USING (bucket_id = 'nyayabot_docs' AND (auth.uid()::text = (storage.foldername(name))[1]));
CREATE POLICY "Users delete files" ON storage.objects FOR DELETE USING (bucket_id = 'nyayabot_docs' AND (auth.uid()::text = (storage.foldername(name))[1]));
```

### 5. Run the Application
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🏗 Architecture Note
This project was recently migrated from a heavy Python/FastAPI architecture to a fully **Serverless React application**. 
- The `frontend/` folder contains the active, production-ready React application.
- The `backend/` and `data/` folders contain legacy Python data ingestion and LangChain scripts, preserved for future custom RAG (Retrieval-Augmented Generation) pipeline implementations.

## 📜 Disclaimer
NyayaBot is an AI assistant intended for research and drafting assistance. It is **not a substitute for qualified legal counsel**. Always verify citations and legal advice with an advocate enrolled with the Bar Council of India before submitting documents to a court of law.

---
*Built with ❤️ for the Indian Legal Community.*
