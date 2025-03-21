import { NextApiRequest, NextApiResponse } from 'next';
import { createBooking, getBookings, checkAvailability } from '../../lib/db';
import { format } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const booking = req.body;
      
      // Format dates to ISO string
      const startDate = format(new Date(booking.start_date), 'yyyy-MM-dd');
      const endDate = format(new Date(booking.end_date), 'yyyy-MM-dd');

      // Check availability
      const isAvailable = checkAvailability(startDate, endDate);
      
      if (!isAvailable) {
        return res.status(400).json({ error: 'Selected dates are not available' });
      }

      // Create booking
      const bookingId = createBooking({
        ...booking,
        start_date: startDate,
        end_date: endDate,
      });

      res.status(201).json({ id: bookingId });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Error creating booking' });
    }
  } else if (req.method === 'GET') {
    try {
      const { start_date, end_date } = req.query;
      
      const bookings = getBookings(
        start_date as string,
        end_date as string
      );

      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 