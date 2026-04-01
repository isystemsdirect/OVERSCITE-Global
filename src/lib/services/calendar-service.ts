import { CalendarBooking } from '../types';

// Seed initial bookings for realism
const SEED_BOOKINGS: CalendarBooking[] = [
  {
    id: 'book-101',
    title: 'Site Inspection: 123 Industrial Way',
    start_at: new Date('2023-11-01T09:00:00').toISOString(),
    end_at: new Date('2023-11-01T11:00:00').toISOString(),
    location: '123 Industrial Way, Los Angeles, CA',
    status: 'confirmed',
    linked_entity_type: 'inspection',
    linked_entity_id: 'insp-001',
    created_by: 'system',
  },
  {
    id: 'book-102',
    title: 'Governance Review: Q4 Prep',
    start_at: new Date('2023-11-02T14:00:00').toISOString(),
    end_at: new Date('2023-11-02T15:30:00').toISOString(),
    location: 'Virtual Conference Room 4',
    status: 'confirmed',
    linked_entity_type: 'meeting',
    linked_entity_id: 'meet-002',
    created_by: 'Director Anderson',
  },
  {
    id: 'book-103',
    title: 'Equipment Maintenance - Drone Fleet 7',
    start_at: new Date('2023-11-03T08:00:00').toISOString(),
    end_at: new Date('2023-11-03T12:00:00').toISOString(),
    location: 'Tech Hub B',
    status: 'tentative',
    linked_entity_type: 'operational_block',
    linked_entity_id: 'maint-003',
    created_by: 'Tech Lead',
  }
];

export async function getCalendarBookings(): Promise<CalendarBooking[]> {
  // Simulate fetch
  return [...SEED_BOOKINGS];
}

export async function createCalendarBooking(booking: Omit<CalendarBooking, 'id'>): Promise<CalendarBooking> {
  const newBooking: CalendarBooking = {
    ...booking,
    id: `book-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  console.log('Operational booking created and persisted:', newBooking);
  // Log audit event: calendar_booking_created
  return newBooking;
}
