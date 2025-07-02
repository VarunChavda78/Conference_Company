# Conference Room Booking API Server

This is the backend API server for the Conference Room Booking application.

## Features

- JWT-based authentication
- RESTful API for booking management
- CORS enabled for frontend integration
- In-memory storage (can be replaced with a database)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Bookings
- `GET /api/bookings` - Get all bookings (with optional date filter)
- `GET /api/bookings/date/:date` - Get bookings for a specific date
- `POST /api/bookings` - Create a new booking (requires authentication)
- `PUT /api/bookings/:id` - Update a booking (requires authentication)
- `DELETE /api/bookings/:id` - Delete a booking (requires authentication)

### Health Check
- `GET /api/health` - Server health check

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Default Credentials

- Username: `SrashtaSoft`
- Password: `conf@123`

## Docker

To run with Docker:
```bash
docker build -t conference-room-booking-server .
docker run -p 5000:5000 conference-room-booking-server
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens 