# AI Matchmaker — Frontend

React frontend for the AI Matchmaker application. Connects to the FastAPI backend for AI-powered matchmaking.

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Axios** for API calls
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

## Backend Connection

The dev server proxies `/api/*` requests to `http://localhost:8000`. Make sure the backend is running:

```bash
cd ../ai_backend
docker compose up -d    # PostgreSQL + Qdrant
python main.py          # FastAPI on port 8000
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features overview |
| `/create-profile` | Form to create a new dating profile |
| `/profile/:userId` | View a profile with details |
| `/find-matches` | Enter a profile ID to search matches |
| `/matches/:userId` | View AI-ranked matches with scores |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | API base URL |
