import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'bookings.db'));

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    number_of_guests INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blocked_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export interface Booking {
  id?: number;
  start_date: string;
  end_date: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  number_of_guests: number;
  total_price: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlockedDate {
  id?: number;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at?: string;
}

interface CountResult {
  count: number;
}

export function createBooking(booking: Booking): number {
  const stmt = db.prepare(`
    INSERT INTO bookings (
      start_date, end_date, guest_name, guest_email, 
      guest_phone, number_of_guests, total_price, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    booking.start_date,
    booking.end_date,
    booking.guest_name,
    booking.guest_email,
    booking.guest_phone || null,
    booking.number_of_guests,
    booking.total_price,
    booking.status || 'pending'
  );

  return result.lastInsertRowid as number;
}

export function getBookings(startDate?: string, endDate?: string): Booking[] {
  let query = 'SELECT * FROM bookings';
  const params: any[] = [];

  if (startDate && endDate) {
    query += ' WHERE (start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?)';
    params.push(startDate, endDate, startDate, endDate);
  }

  query += ' ORDER BY start_date';
  
  const stmt = db.prepare(query);
  return stmt.all(...params) as Booking[];
}

export function checkAvailability(startDate: string, endDate: string): boolean {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count 
    FROM bookings 
    WHERE status != 'cancelled' 
    AND (
      (start_date <= ? AND end_date >= ?) OR
      (start_date <= ? AND end_date >= ?) OR
      (start_date >= ? AND end_date <= ?)
    )
  `);

  const blockedStmt = db.prepare(`
    SELECT COUNT(*) as count 
    FROM blocked_dates 
    WHERE (start_date <= ? AND end_date >= ?) OR
          (start_date <= ? AND end_date >= ?) OR
          (start_date >= ? AND end_date <= ?)
  `);

  const params = [startDate, startDate, endDate, endDate, startDate, endDate];
  
  const bookingCount = (stmt.get(...params) as CountResult).count;
  const blockedCount = (blockedStmt.get(...params) as CountResult).count;

  return bookingCount === 0 && blockedCount === 0;
}

export default db; 