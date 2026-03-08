# How to Run This Project

This guide explains how to run the **AI Matchmaker** application end-to-end: databases, backend API, and React frontend.

---

## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| **Docker Desktop** | Run PostgreSQL and Qdrant (vector database) |
| **Python 3.10+** | Run the FastAPI backend |
| **Node.js 18+** | Run the React frontend |
| **OpenAI API Key** | AI embeddings and match explanations |

---

## Project Structure

```
AI Project/
├── ai_backend/          # FastAPI + OpenAI + Qdrant + PostgreSQL
├── frontend/            # React (Vite) UI
└── HOW_TO_RUN.md        # This file
```

---

## Step 1: Start the Databases

From the project root:

```bash
cd ai_backend
docker compose up -d
```

This starts:

- **PostgreSQL** on `localhost:5432` (user: `matchmaker`, db: `matchmaker`)
- **Qdrant** on `localhost:6333` (vector store for embeddings)

Check that both are running:

```bash
docker compose ps
```

---

## Step 2: Configure the Backend

1. Copy the example environment file:

   ```bash
   cd ai_backend
   cp .env.example .env
   ```

2. Edit `.env` and set your OpenAI API key:

   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

   Other variables (Postgres, Qdrant) are already set for the Docker setup.

3. Install Python dependencies and run the API:

   ```bash
   pip install -r requirements.txt
   python main.py
   ```

   The API runs at **http://localhost:8000**.  
   Interactive docs: **http://localhost:8000/docs**.

---

## Step 3: Run the Frontend

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The React app runs at **http://localhost:3000**.  
It proxies `/api` requests to the backend at `http://localhost:8000`.

---

## Quick Reference

| What | Command | URL |
|------|---------|-----|
| Start DBs | `cd ai_backend && docker compose up -d` | PostgreSQL `:5432`, Qdrant `:6333` |
| Start backend | `cd ai_backend && python main.py` | http://localhost:8000 |
| Start frontend | `cd frontend && npm run dev` | http://localhost:3000 |

Use **three terminals** (or run backend/frontend in the background) so all three stay running.

---

## Using the App

1. Open **http://localhost:3000** in your browser.
2. Click **Get Started** or **Create Profile**.
3. Fill in the profile form (name, age, interests, personality, relationship goals, etc.).
4. After saving, you’ll see your **Profile** page with a unique **Profile ID**.
5. Click **Find My Matches** to get AI-ranked matches with compatibility scores and explanations.
6. Create at least two profiles (e.g. different genders) so the matcher has candidates to return.

---

## Stopping the Project

- **Frontend:** `Ctrl+C` in the terminal where `npm run dev` is running.
- **Backend:** `Ctrl+C` in the terminal where `python main.py` is running.
- **Databases:**

  ```bash
  cd ai_backend
  docker compose down
  ```

  To also remove stored data (profiles, vectors):

  ```bash
  docker compose down -v
  ```

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| "Connection refused" to backend | Ensure `python main.py` is running and nothing else is using port 8000. |
| "Profile not found" / empty matches | Backend needs at least two profiles; create more via the frontend. |
| OpenAI errors | Check `OPENAI_API_KEY` in `ai_backend/.env` and that the key is valid and has credits. |
| Docker errors | Ensure Docker Desktop is running and ports 5432 and 6333 are free. |
