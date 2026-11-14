# Kindora – Backend API

The backend API for **Kindora**, a community-driven platform that connects people with meaningful volunteer opportunities and community development events.

It provides authentication, event management, event participation, and secure protected API endpoints.

**Live Application:** https://kindora-client-five.vercel.app

## My Role

**Full-Stack Developer**

Designed and developed the backend API, authentication integration, database operations, and event management functionality.

## Technology Stack

- Node.js
- Express.js 5
- TypeScript
- MongoDB
- Better Auth
- JWT
- JOSE
- CORS
- dotenv

## Key Features

- Email and password authentication
- Google OAuth authentication
- JWT-based authentication using JWKS verification
- Protected API routes with Bearer Token authentication
- Create and manage community events
- Retrieve upcoming events and event details
- Search events by title, description, and location
- Filter events by category
- Join and leave community events
- Prevent duplicate event participation
- Retrieve user-created events
- Retrieve joined events
- Verify event ownership before updating or deleting
- MongoDB integration for persistent data storage
- Health check endpoint

## API Documentation

Base URL (local):

```text
http://localhost:5000
```

### General Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | API welcome message | Public |
| GET | `/api/health` | Server health check | Public |

### Authentication

Better Auth handles authentication under:

```text
/api/auth/*
```

Supported authentication methods:

- Email and password
- Google OAuth

### Event Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/events` | Get upcoming events | Public |
| GET | `/api/events/:id` | Get event details | Public |
| POST | `/api/events` | Create an event | Protected |
| PATCH | `/api/events/:id` | Update an event | Protected |
| DELETE | `/api/events/:id` | Delete an event | Protected |
| POST | `/api/events/:id/join` | Join an event | Protected |
| DELETE | `/api/events/:id/join` | Leave an event | Protected |
| GET | `/api/events/joined` | Get joined events | Protected |
| GET | `/api/events/mine` | Get events created by the user | Protected |

### Event Search and Filtering

The upcoming events endpoint supports query parameters:

| Parameter | Description |
|---|---|
| `search` | Search by title, description, or location |
| `category` | Filter events by event category |
| `limit` | Control the maximum number of results |

Example:

```text
GET /api/events?search=volunteer&category=Environment&limit=10
```

### Protected Routes

Protected endpoints require a valid JWT access token in the Authorization header.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The backend verifies tokens using the Better Auth JWKS endpoint.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=kindora

BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Important:**
- Replace placeholder values with your actual credentials.
- Configure Google OAuth credentials in your Google Cloud project.
- Use the appropriate frontend URL and authentication URL for your environment.
- Never commit `.env` files or expose secret credentials publicly.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/nibirshafuan/kindora-server.git
```

### 2. Navigate to the Project

```bash
cd kindora-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and provide the required configuration.

### 5. Run the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with automatic reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start the compiled production server |

## Project Structure

```text
kindora-server/
├── scripts/
├── src/
│   ├── config/
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── controllers/
│   │   └── event.controller.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   └── event.routes.ts
│   └── server.ts
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Database Collections

The application uses MongoDB collections for:

- `events` – Stores community event information.
- `eventParticipants` – Stores event participation records.

A unique compound index on `eventId` and `userEmail` prevents duplicate participation in the same event.

## Related Repository

**Frontend:** https://github.com/nibirshafuan/kindora-client

**Backend:** https://github.com/nibirshafuan/kindora-server

**Live Application:** https://kindora-client-five.vercel.app

## Developer

**Nibir Shafuan**

Computer Science and Engineering
Daffodil International University

- GitHub: https://github.com/nibirshafuan
- LinkedIn: https://www.linkedin.com/in/nibirshafuan
- Portfolio: https://nibirshafuan.vercel.app

## License

Developed for academic purposes.
