import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, differenceInDays } from 'date-fns';

interface BookingCalendarProps {
  onDateSelect: (startDate: Date, endDate: Date) => void;
  minNights?: number;
  maxNights?: number;
  bookedDates?: Array<{ start: Date; end: Date }>;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onDateSelect,
  minNights = 2,
  maxNights = 14,
  bookedDates = []
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateSelect = (date: Date | null) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateSelect = (date: Date | null) => {
    if (startDate && date) {
      const nights = differenceInDays(date, startDate);
      if (nights >= minNights && nights <= maxNights) {
        setEndDate(date);
        onDateSelect(startDate, date);
      }
    }
  };

  const isDateBlocked = (date: Date) => {
    return bookedDates.some(({ start, end }) => {
      return date >= start && date <= end;
    });
  };

  const highlightWithRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) {
      const nights = differenceInDays(date, startDate);
      return date >= startDate && nights <= maxNights;
    }
    return date >= startDate && date <= endDate;
  };

  return (
    <div className="bg-white rounded-lg">
      <style jsx global>{`
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-radius: 0.5rem;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          padding-top: 1rem;
        }
        .react-datepicker__day-name {
          color: #6b7280;
          font-weight: 500;
        }
        .react-datepicker__day {
          color: #1f2937;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        .react-datepicker__day:hover {
          background-color: #f3f4f6;
        }
        .react-datepicker__day--selected {
          background-color: #0070f3 !important;
          color: white;
        }
        .react-datepicker__day--in-range {
          background-color: #e0f2fe;
          color: #0070f3;
        }
        .react-datepicker__day--disabled {
          color: #d1d5db;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateSelect}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            excludeDates={bookedDates.map(({ start }) => start)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select check-in date"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            calendarClassName="!font-sans"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateSelect}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? addDays(startDate, minNights) : new Date()}
            maxDate={startDate ? addDays(startDate, maxNights) : undefined}
            excludeDates={bookedDates.map(({ end }) => end)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select check-out date"
            disabled={!startDate}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            calendarClassName="!font-sans"
          />
        </div>
      </div>

      {startDate && !endDate && (
        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <p>Please select a check-out date ({minNights}-{maxNights} nights)</p>
          <p className="text-xs mt-1 text-gray-500">
            Minimum stay: {minNights} nights • Maximum stay: {maxNights} nights
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar; 