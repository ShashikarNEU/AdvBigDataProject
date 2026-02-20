# Plan API — Advanced Big Data & Distributed Systems

A distributed **RESTful API** for managing hierarchical health plan data, built with **Node.js**, **Redis**, and **Elasticsearch**. Features advanced capabilities including JSON Schema validation, ETag-based conditional caching, Pub/Sub messaging via RabbitMQ, parent-child indexing in Elasticsearch, and token-based security via Google OAuth 2.0.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Primary Store | Redis (key-value, in-memory) |
| Search & Analytics | Elasticsearch (with parent-child join mapping) |
| Message Queue | RabbitMQ (Pub/Sub for async indexing) |
| Validation | JSON Schema (AJV) |
| Authentication | Google OAuth 2.0 (JWT Bearer tokens) |
| Caching | ETag-based conditional HTTP requests |

---

## Features

- **CRUD Operations** — Create, Read, Patch, and Delete hierarchical plan objects
- **JSON Schema Validation** — All incoming payloads are validated against a strict schema before processing
- **Redis Storage** — All plan data stored in Redis for fast access and flexible key-value retrieval
- **ETag Caching** — Conditional GET/DELETE with `If-None-Match` and `If-Match` headers for efficient client-side caching
- **Elasticsearch Integration** — Plans indexed with parent-child join mapping for advanced search and analytics
- **RabbitMQ Pub/Sub** — Write operations publish messages to a queue; a consumer asynchronously indexes data into Elasticsearch
- **Google OAuth 2.0** — All endpoints secured with JWT Bearer token authentication
- **Patch Support** — Partial updates with merge semantics for nested plan objects

---

## API Endpoints

### Plan CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/v1/plan` | ✅ | Create a new plan |
| GET | `/v1/plan/:objectId` | ✅ | Retrieve a plan by ID (supports ETag) |
| PUT | `/v1/plan/:objectId` | ✅ | Replace an existing plan |
| PATCH | `/v1/plan/:objectId` | ✅ | Partially update a plan |
| DELETE | `/v1/plan/:objectId` | ✅ | Delete a plan by ID |

### Search (Elasticsearch)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/v1/search` | ✅ | Query plans in Elasticsearch |

---

## Example Request

### Create a Plan

```bash
curl -X POST http://localhost:3000/v1/plan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d @usecase.json
```

**Response** `201 Created` with ETag header:
```
ETag: "abc123hash"
```

### Conditional GET

```bash
curl -X GET http://localhost:3000/v1/plan/12xvxc345ssdsds \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "If-None-Match: \"abc123hash\""
# Returns 304 Not Modified if unchanged
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- Redis (running on `localhost:6379`)
- Elasticsearch (running on `localhost:9200`)
- RabbitMQ (running on `localhost:5672`)
- Google Cloud project with OAuth 2.0 credentials

### 1. Clone the Repository

```bash
git clone https://github.com/ShashikarNEU/AdvBigDataProject.git
cd AdvBigDataProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```env
PORT=3000
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
RABBITMQ_URL=amqp://localhost:5672
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Start Services

```bash
# Start Redis
redis-server

# Start Elasticsearch
./bin/elasticsearch

# Start RabbitMQ
rabbitmq-server

# Start the API
npm start
```

### 5. Start the Elasticsearch Consumer

```bash
npm run consumer
```

---

## Architecture

```
HTTP Request
     ↓
JWT Validation (Google OAuth)
     ↓
JSON Schema Validation (AJV)
     ↓
Redis (Read/Write)
     ↓
RabbitMQ Publisher
     ↓
RabbitMQ Consumer (async)
     ↓
Elasticsearch Index (parent-child)
```

---

## Testing

Import the Postman collection from `postman/plan-api.postman_collection.json` to test all endpoints with pre-configured requests and auth tokens.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
