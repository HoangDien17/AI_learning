# AI Matchmaker

AI-powered matchmaking backend that uses embeddings (OpenAI or local **all-MiniLM-L6-v2**) and Qdrant vector search to recommend compatible romantic partners.

## Architecture

```
User → FastAPI → Profile Service → OpenAI (embedding) → Qdrant (vector store)
                                  → PostgreSQL (structured data)
User → FastAPI → Matchmaking Agent → Stage 1: Qdrant (candidate generation)
                                    → Stage 2: Ranking model (full scoring)
                                    → OpenAI (compatibility explanation)
```

## Tech Stack

| Component      | Technology              |
|----------------|-------------------------|
| API            | FastAPI                 |
| Embeddings     | Local (sentence-transformers all-MiniLM-L6-v2) or OpenAI text-embedding-3-small |
| Vector DB      | Qdrant                  |
| Relational DB  | PostgreSQL              |
| Orchestration  | Docker Compose          |

## Project Structure

```
app/
  api/          → FastAPI routes
  agents/       → Matchmaking agent (orchestrates the pipeline)
  services/     → Embedding, profile, and scoring services
  database/     → PostgreSQL and Qdrant client wrappers
  models/       → SQLAlchemy ORM + Pydantic schemas
  utils/        → Config and logging
main.py         → Application entrypoint
```

## Quick Start

### 1. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432) and Qdrant (port 6333).

### 2. Configure environment

```bash
cp .env.example .env
# For local embeddings (default): no API key needed. Set EMBEDDING_DIMENSIONS=384.
# For OpenAI embeddings: set EMBEDDING_PROVIDER=openai, OPENAI_API_KEY, and EMBEDDING_DIMENSIONS=1536.
```

If you switch embedding provider or dimensions, delete the Qdrant collection so it can be recreated with the correct vector size (e.g. in Qdrant UI or via API).

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the server

```bash
python main.py
```

The API runs at **http://localhost:8000**. Interactive docs at **/docs**.

## API Endpoints

### Create a profile

```bash
curl -X POST http://localhost:8000/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "age": 29,
    "gender": "female",
    "location": "San Francisco, CA",
    "occupation": "Software Engineer",
    "interests": "hiking, traveling, reading psychology books, yoga",
    "personality": "Curious, empathetic, and adventurous",
    "lifestyle": "Active and health-conscious, enjoys weekends outdoors",
    "relationship_goals": "Long-term relationship leading to marriage",
    "partner_preferences": "Someone who values family, personal growth, and enjoys outdoor activities"
  }'
```

### Create another profile

```bash
curl -X POST http://localhost:8000/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob",
    "age": 31,
    "gender": "male",
    "location": "San Francisco, CA",
    "occupation": "Product Manager",
    "interests": "hiking, cooking, reading, personal development",
    "personality": "Thoughtful, ambitious, and family-oriented",
    "lifestyle": "Balanced lifestyle, enjoys both city life and nature",
    "relationship_goals": "Long-term relationship with someone who shares similar values",
    "partner_preferences": "An empathetic, curious person who enjoys outdoor activities and values growth"
  }'
```

### Get a profile

```bash
curl http://localhost:8000/profiles/{user_id}
```

### Find matches

```bash
curl http://localhost:8000/matches/{user_id}?top_k=5
```

Returns ranked matches with compatibility scores and AI-generated explanations.

## Compatibility Scoring

```
compatibility_score =
    0.6 × embedding_similarity    (semantic closeness of profile texts)
  + 0.2 × shared_interests        (Jaccard overlap of interest lists)
  + 0.1 × location_score          (text similarity of locations)
  + 0.1 × relationship_goal_match (text similarity of goals)
```

## Matchmaking Agent Pipeline

1. Load user profile from PostgreSQL
2. Generate embedding via OpenAI
3. Query Qdrant for top-N similar vectors (with metadata filters)
4. Compute composite compatibility score for each candidate
5. Generate natural-language explanation via OpenAI chat
6. Return ranked results
