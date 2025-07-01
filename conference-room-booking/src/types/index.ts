export interface User {
  id: string;
  username: string;
  isOwner: boolean;
}

export enum BookingType {
  MEETING = 'meeting',
  TEACHING_SESSION = 'teaching_session',
  STAND_UP = 'stand_up',
  INTERVIEW = 'interview'
}

export interface Booking {
  id: string;
  booker: string;
  presenter: string;
  type: BookingType;
  startTime: string;
  endTime: string;
  date: string;
  title: string;
  description: string;
  numberOfPeople: number;
  createdAt: Date;
}

export interface TimeSlot {
  hour: number;
  bookings: Booking[];
}

export interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  getBookingsByDate: (date: string) => Booking[];
  getBookingsByTimeRange: (date: string, startTime: string, endTime: string) => Booking[];
  removeBooking: (id: string) => void;
  editBooking: (id: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>) => void;
} 