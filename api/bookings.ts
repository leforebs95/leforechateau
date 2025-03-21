import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

export type Booking = Database['public']['Tables']['bookings']['Row'];
export type NewBooking = Database['public']['Tables']['bookings']['Insert'];
export type UpdateBooking = Database['public']['Tables']['bookings']['Update'];

async function createBooking(booking: NewBooking) {
  // Format dates to ISO string
  const startDate = format(new Date(booking.start_date), 'yyyy-MM-dd');
  const endDate = format(new Date(booking.end_date), 'yyyy-MM-dd');

  // Check availability
  const isAvailable = await checkAvailability(startDate, endDate);
  if (!isAvailable) {
    throw new Error('Selected dates are not available');
  }

  // Create booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      start_date: startDate,
      end_date: endDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getBookings(startDate?: string, endDate?: string) {
  let query = supabase.from('bookings').select('*');

  if (startDate && endDate) {
    query = query.or(`start_date.gte.${startDate},end_date.lte.${endDate}`);
  }

  const { data, error } = await query.order('start_date', { ascending: true });

  if (error) throw error;
  return data;
}

async function checkAvailability(startDate: string, endDate: string) {
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .neq('status', 'cancelled')
    .or(`start_date.lte.${startDate},end_date.gte.${endDate}`);

  if (bookingsError) throw bookingsError;

  const { data: blockedDates, error: blockedError } = await supabase
    .from('blocked_dates')
    .select('*')
    .or(`start_date.lte.${startDate},end_date.gte.${endDate}`);

  if (blockedError) throw blockedError;

  return bookings.length === 0 && blockedDates.length === 0;
}

async function updateBooking(id: string, updates: UpdateBooking) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteBooking(id: string) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const booking = await createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating booking' });
    }
  } else if (req.method === 'GET') {
    try {
      const { start_date, end_date } = req.query;
      const bookings = await getBookings(start_date as string, end_date as string);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const booking = await updateBooking(id as string, req.body);
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Error updating booking' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await deleteBooking(id as string);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Error deleting booking' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 