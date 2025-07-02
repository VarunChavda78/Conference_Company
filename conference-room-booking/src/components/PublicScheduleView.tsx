import React, { useState } from 'react';
import { useBookings } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import './ScheduleView.css';
import './PublicScheduleView.css';

const HOURS = Array.from({ length: 23 }, (_, i) => i + 1); // 1 to 23
const DAYS = 7; // Monday to Sunday
const HOUR_HEIGHT = 60; // px

const PublicScheduleView: React.FC = () => {
  const { bookings } = useBookings();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const navigate = useNavigate();
  const selected = new Date(selectedDate);
  const weekStart = startOfWeek(selected, { weekStartsOn: 1 }); // Monday
  const weekDates = Array.from({ length: DAYS }, (_, i) => addDays(weekStart, i));

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = booking.date.length > 10 ? booking.date.split('T')[0] : booking.date;
      return isSameDay(parseISO(bookingDate), date);
    });
  };

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return '#e74c3c'; // red
      case 'teaching_session':
        return '#27ae60'; // green
      case 'stand_up':
        return '#2980ef'; // blue
      case 'interview':
        return '#04836c'; // teal
      default:
        return '#e74c3c';
    }
  };

  const getBookingPosition = (booking: any) => {
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    const start = (startHour + startMin / 60) - 1; // 1 AM is 0
    const end = (endHour + endMin / 60) - 1;
    const top = start * HOUR_HEIGHT;
    const height = Math.max((end - start) * HOUR_HEIGHT, 24);
    return { top, height };
  };

  return (
    <div className="public-schedule-container">
      <div className="public-header">
        <div className="header-content header-content-row">
          <h1 className="main-title">Conference Room Booking</h1>
          <button className="header-login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
      <div className="public-schedule-date-picker-row">
        <label htmlFor="week-date-picker">Select Week: </label>
        <input
          id="week-date-picker"
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>
      {/* Flex row: table left, legend right */}
      <div className="week-grid-outer-flex">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="week-grid-header-row">
            <div className="week-grid-time-col"></div>
            {weekDates.map(date => (
              <div key={date.toISOString()} className="week-grid-day-header">
                <div>{format(date, 'EEE')}</div>
                <div>{format(date, 'dd/MM')}</div>
              </div>
            ))}
          </div>
          <div className="week-grid-main-row">
            {/* Time labels */}
            <div className="week-grid-time-col">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="week-grid-time-label"
                  style={{ height: HOUR_HEIGHT }}
                >
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
              ))}
            </div>
            {/* Day columns */}
            {weekDates.map(date => (
              <div key={date.toISOString()} className="week-grid-day-col">
                {/* Hour lines */}
                {HOURS.map((_, i) => (
                  <div key={i} className="week-grid-hour-line" style={{ top: i * HOUR_HEIGHT }} />
                ))}
                {/* Bookings */}
                {getBookingsForDay(date).map(booking => {
                  const { top, height } = getBookingPosition(booking);
                  return (
                    <div
                      key={booking.id}
                      className="booking-item week-grid-booking"
                      style={{
                        backgroundColor: getBookingTypeColor(booking.type),
                        top,
                        height,
                      }}
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="booking-content">
                        <div className="booking-title">{booking.title}</div>
                        <div className="booking-details">
                          <span>{booking.presenter}</span>
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="booking-type">
                          {booking.type.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Legend to the right of the table, outside the grid */}
        <div className="schedule-legend schedule-legend-right">
          <h3>Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
              <span>Meeting</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
              <span>Teaching Session</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#2980ef' }}></div>
              <span>Stand-up</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#04836c' }}></div>
              <span>Interview</span>
            </div>
          </div>
        </div>
      </div>
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Session Details</h3>
            <div className="modal-divider" />
            <div className="modal-columns-row">
              <div className="modal-col">
                <div className="modal-row"><label>Title:</label><span>{selectedBooking.title}</span></div>
                <div className="modal-row"><label>Booker:</label><span>{selectedBooking.booker}</span></div>
                <div className="modal-row"><label>Presenter:</label><span>{selectedBooking.presenter}</span></div>
                <div className="modal-row"><label>Date:</label><span>{selectedBooking.date}</span></div>
                <div className="modal-row"><label>Start Time:</label><span>{selectedBooking.startTime}</span></div>
                <div className="modal-row"><label>End Time:</label><span>{selectedBooking.endTime}</span></div>
              </div>
              <div className="modal-col">
                <div className="modal-row"><label>Type:</label><span>{selectedBooking.type.replace('_', ' ').toUpperCase()}</span></div>
                <div className="modal-row"><label>Number of People:</label><span>{selectedBooking.numberOfPeople}</span></div>
                <div className="modal-row"><label>Description:</label><span style={{whiteSpace: 'pre-line'}}>{selectedBooking.description}</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
              <button onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicScheduleView; 