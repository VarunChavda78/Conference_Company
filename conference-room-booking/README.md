# Conference Room Booking System

A modern React-based conference room booking application for your company. This application allows owners to manage bookings and provides a public view for all users to see the current schedule.

## Features

### For Owners (Authenticated Users)
- **Login System**: Secure authentication for owners
- **Create Bookings**: Add new conference room bookings with detailed information
- **Schedule Management**: View and manage all bookings in a visual timeline
- **Booking Details**: Include booker, presenter, type, time, date, title, description, and number of people

### For Public Users (Non-authenticated)
- **Public Schedule View**: View the current conference room schedule without login
- **Visual Timeline**: See bookings displayed in a clean, easy-to-read format
- **Date Navigation**: Browse different dates to see availability

### Booking Types
- **Meeting**: Standard business meetings
- **Teaching Session**: Educational or training sessions
- **Stand-up**: Daily standup meetings

## Demo Credentials

For testing the owner functionality:
- **Username**: `SrashtaSoft`
- **Password**: `conf@123`

## Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Docker (for containerized deployment)

### Installation Steps

#### Option 1: Development Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd conference-room-booking
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

5. **Start the frontend development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

#### Option 2: Docker Setup (Recommended for Production)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: `http://localhost:3002`
   - Backend API: `http://localhost:5000`

## Usage

### Public View (Default)
When you first visit the application, you'll see the public schedule view showing:
- Current day's schedule
- All existing bookings in a visual timeline
- Date selector to view different days
- Color-coded booking types

### Owner Login
1. Click the "Owner Login" button
2. Enter the demo credentials:
   - Username: `SrashtaSoft`
   - Password: `conf@123`
3. You'll be redirected to the owner dashboard

### Creating Bookings (Owner Only)
1. Login as owner
2. Click "Create Booking" tab
3. Fill in the booking form with:
   - **Booker**: Who is making the booking
   - **Presenter**: Who will be presenting
   - **Type**: Meeting, Teaching Session, or Stand-up
   - **Date**: Select the booking date
   - **Start Time**: When the session starts
   - **End Time**: When the session ends
   - **Title**: Brief title for the booking
   - **Description**: Detailed description
   - **Number of People**: Expected attendees
4. Click "Create Booking"

### Viewing Schedule
- **Schedule View**: See all bookings in a visual timeline
- **Date Navigation**: Use the date picker to view different days
- **Booking Details**: Hover over bookings to see details

## Technical Details

### Built With
- **React 18** with TypeScript
- **Node.js/Express** backend API
- **JWT Authentication** for secure login
- **React Context API** for state management
- **date-fns** for date manipulation
- **CSS3** with modern styling and responsive design

### Project Structure
```
src/
├── components/          # React components
│   ├── Login.tsx       # Authentication component
│   ├── Navigation.tsx  # Navigation bar
│   ├── BookingForm.tsx # Booking creation form
│   ├── ScheduleView.tsx # Owner schedule view
│   ├── PublicScheduleView.tsx # Public schedule view
│   └── *.css           # Component styles
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── BookingContext.tsx # Booking data management
├── types/              # TypeScript type definitions
│   └── index.ts        # Interfaces and enums
└── App.tsx             # Main application component
```

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Type Safety**: Full TypeScript implementation
- **Accessibility**: Proper focus management and keyboard navigation
- **Real-time Updates**: Immediate reflection of booking changes

## Customization

### Adding New Booking Types
1. Update the `BookingType` enum in `src/types/index.ts`
2. Add corresponding color in the `getBookingTypeColor` function
3. Update the booking form options

### Styling
- All styles are in CSS files alongside their components
- Uses CSS Grid and Flexbox for responsive layouts
- Custom color scheme can be modified in the CSS variables

### Authentication
- JWT-based authentication with secure token storage
- Backend API integration for persistent data
- Can be extended to integrate with external authentication systems

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User management system with roles
- Email notifications for bookings
- Calendar integration (Google Calendar, Outlook)
- Recurring booking support
- Room availability checking
- Booking approval workflow
- Real-time updates with WebSocket
- Mobile app development

## Support

For any issues or questions, please refer to the code comments or create an issue in the project repository.

## License

This project is created for internal company use. Please ensure compliance with your organization's policies.

This project is created for internal company use. Please ensure compliance with your organization's policies.
