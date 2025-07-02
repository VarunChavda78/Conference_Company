import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Booking, BookingType } from '../types';
import { apiService } from '../services/api';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  getBookingsByDate: (date: string) => Booking[];
  getBookingsByTimeRange: (date: string, startTime: string, endTime: string) => Booking[];
  removeBooking: (id: string) => Promise<void>;
  editBooking: (id: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>) => Promise<void>;
  refreshBookings: () => Promise<void>;
  loading: boolean;
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

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshBookings = async () => {
    setLoading(true);
    try {
      const data = await apiService.getBookings();
      const parsedBookings = data.map((b: any) => ({ 
        ...b, 
        createdAt: new Date(b.createdAt) 
      }));
      setBookings(parsedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const newBooking = await apiService.createBooking(bookingData);
      setBookings(prev => [...prev, { ...newBooking, createdAt: new Date(newBooking.createdAt) }]);
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
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

  const removeBooking = async (id: string) => {
    try {
      await apiService.deleteBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error removing booking:', error);
      throw error;
    }
  };

  const editBooking = async (id: string, updatedData: Partial<Omit<Booking, 'id' | 'createdAt'>>) => {
    try {
      const updatedBooking = await apiService.updateBooking(id, updatedData);
      setBookings(prev => prev.map(booking =>
        booking.id === id ? { ...booking, ...updatedBooking, createdAt: new Date(updatedBooking.createdAt) } : booking
      ));
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const value: BookingContextType = {
    bookings,
    addBooking,
    getBookingsByDate,
    getBookingsByTimeRange,
    removeBooking,
    editBooking,
    refreshBookings,
    loading
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}; 