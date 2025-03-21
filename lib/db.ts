import { supabase } from './supabase';
import type { Database } from './supabase';

export type Booking = Database['public']['Tables']['bookings']['Row'];
export type NewBooking = Database['public']['Tables']['bookings']['Insert'];
export type UpdateBooking = Database['public']['Tables']['bookings']['Update'];

export async function createBooking(booking: NewBooking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings(startDate?: string, endDate?: string) {
  let query = supabase.from('bookings').select('*');

  if (startDate && endDate) {
    query = query.or(`start_date.gte.${startDate},end_date.lte.${endDate}`);
  }

  const { data, error } = await query.order('start_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function checkAvailability(startDate: string, endDate: string) {
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

export async function updateBooking(id: string, updates: UpdateBooking) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 