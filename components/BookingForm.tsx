import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import BookingCalendar from './BookingCalendar';

interface BookingFormProps {
  basePrice: number;
  onBookingComplete?: (bookingId: number) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  basePrice,
  onBookingComplete
}) => {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    number_of_guests: 1,
  });

  const [dates, setDates] = useState<{
    start_date: Date | null;
    end_date: Date | null;
  }>({
    start_date: null,
    end_date: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        guest_name: session.user.name || prev.guest_name,
        guest_email: session.user.email || prev.guest_email,
      }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (startDate: Date, endDate: Date) => {
    setDates({
      start_date: startDate,
      end_date: endDate
    });
  };

  const calculateTotalPrice = () => {
    if (!dates.start_date || !dates.end_date) return 0;
    const nights = Math.ceil(
      (dates.end_date.getTime() - dates.start_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return basePrice * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!dates.start_date || !dates.end_date) {
      setError('Please select your check-in and check-out dates');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          start_date: dates.start_date,
          end_date: dates.end_date,
          total_price: calculateTotalPrice(),
          user_id: session?.user?.id, // Include user ID if logged in
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const { id } = await response.json();
      if (onBookingComplete) {
        onBookingComplete(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <BookingCalendar
            onDateSelect={handleDateSelect}
            minNights={2}
            maxNights={14}
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="guest_name"
                name="guest_name"
                required
                value={formData.guest_name}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="John Doe"
                disabled={!!session} // Disable if user is logged in
              />
            </div>

            <div>
              <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="guest_email"
                name="guest_email"
                required
                value={formData.guest_email}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="john@example.com"
                disabled={!!session} // Disable if user is logged in
              />
            </div>

            <div>
              <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="guest_phone"
                name="guest_phone"
                value={formData.guest_phone}
                onChange={handleInputChange}
                className="mt-1 input"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700">
                Number of Guests
              </label>
              <input
                type="number"
                id="number_of_guests"
                name="number_of_guests"
                min="1"
                max="8"
                required
                value={formData.number_of_guests}
                onChange={handleInputChange}
                className="mt-1 input"
              />
            </div>
          </div>

          {dates.start_date && dates.end_date && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Price</h3>
                  <p className="text-sm text-gray-500">Including all taxes and fees</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ${calculateTotalPrice().toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${basePrice} per night
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !dates.start_date || !dates.end_date}
            className={`mt-8 w-full btn-primary ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Complete Booking'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm; 