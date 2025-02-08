# Plan API

This is a RESTful API for managing plans. It supports CRD (Create, Read, Delete) operations and uses Redis as a key-value store. The API also implements ETag-based conditional requests for efficient caching.

## Features

- **Create a Plan**: Create a new plan with JSON payload.
- **Read a Plan**: Fetch a plan by its `objectId`. Supports conditional GET using ETags.
- **Delete a Plan**: Delete a plan by its `objectId`.
- **Validation**: Incoming payloads are validated against a JSON schema.
- **Redis Storage**: All data is stored in Redis for fast access.

## API Endpoints

### 1. Create a Plan
- **URL**: `/v1/plan`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body**: JSON payload (see example in `usecase.json`).
- **Response**:
  - `201 Created` with ETag in headers.

### 2. Read a Plan
- **URL**: `/v1/plan/{objectId}`
- **Method**: `GET`
- **Headers**:
  - `If-None-Match: {ETag}` (optional, for conditional GET).
- **Response**:
  - `200 OK` with plan data and ETag in headers.
  - `304 Not Modified` if ETag matches.

### 3. Delete a Plan
- **URL**: `/v1/plan/{objectId}`
- **Method**: `DELETE`
- **Response**:
  - `204 No Content` on successful deletion.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Redis (running locally or remotely)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/plan-api.git
   cd plan-api
