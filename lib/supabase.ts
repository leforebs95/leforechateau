import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          start_date: string;
          end_date: string;
          number_of_guests: number;
          total_price: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          start_date: string;
          end_date: string;
          number_of_guests: number;
          total_price: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          start_date?: string;
          end_date?: string;
          number_of_guests?: number;
          total_price?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}; 