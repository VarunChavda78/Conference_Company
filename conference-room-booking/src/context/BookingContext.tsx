import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Booking, BookingType } from '../types';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  getBookingsByDate: (date: string) => Booking[];
  getBookingsByTimeRange: (date: string, startTime: string, endTime: string) => Booking[];
  removeBooking: (id: string) => void;
  editBooking: (id: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = 'conference_room_bookings';

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((b: any) => ({ ...b, createdAt: new Date(b.createdAt) }));
      } catch {
        return [];
      }
    }
    // Start with no bookings by default
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const getBookingsByDate = (date: string): Booking[] => {
    return bookings.filter(booking => booking.date === date);
  };

  const getBookingsByTimeRange = (date: string, startTime: string, endTime: string): Booking[] => {
    return bookings.filter(booking => 
      booking.date === date && 
      booking.startTime < endTime && 
      booking.endTime > startTime
    );
  };

  const removeBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const editBooking = (id: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>) => {
    setBookings(prev => prev.map(booking =>
      booking.id === id ? { ...booking, ...updatedData } : booking
    ));
  };

  const value: BookingContextType = {
    bookings,
    addBooking,
    getBookingsByDate,
    getBookingsByTimeRange,
    removeBooking,
    editBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}; 