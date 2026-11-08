# Kindora – Backend API

The backend service for Kindora, a social development events platform. It provides authentication, event management, event participation, and protected API endpoints.

## Technologies

- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- JWT
- CORS

## Features

1. Email and password authentication.
2. Google OAuth authentication.
3. JWT-based API authentication.
4. Create and manage community events.
5. Retrieve upcoming events.
6. Search and filter events.
7. Join events with duplicate participation prevention.
8. Retrieve user-created events.
9. Retrieve joined events.
10. Update and delete events with ownership verification.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API welcome |
| GET | /api/health | Health check |
| GET | /api/events | Upcoming events |
| GET | /api/events/:id | Event details |
| POST | /api/events | Create event |
| PATCH | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |
| POST | /api/events/:id/join | Join event |
| GET | /api/events/joined | Joined events |
| GET | /api/events/mine | My events |
| GET | /api/protected/profile | Protected profile |

Authentication endpoints are handled by Better Auth under `/api/auth`.

## Environment Variables

Create a `.env` file in the server root:

    PORT=5000
    NODE_ENV=development
    CLIENT_URL=http://localhost:3000
    MONGODB_URI=your_mongodb_connection_string
    BETTER_AUTH_SECRET=your_auth_secret
    BETTER_AUTH_URL=http://localhost:5000
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

Never commit real credentials or the `.env` file to GitHub.

## Installation

Clone the repository:

    git clone https://github.com/nibirshafuan/kindora-server.git

Enter the directory:

    cd kindora-server

Install dependencies:

    npm install

Configure the `.env` file with your credentials.

## Run Development Server

    npm run dev

Default API address:

    http://localhost:5000

## Production Build

Compile TypeScript:

    npm run build

Start the production server:

    npm start

## Author

Nibir Shafuan  
Department of Computer Science and Engineering  
Daffodil International University

## License

Developed for academic purposes.
