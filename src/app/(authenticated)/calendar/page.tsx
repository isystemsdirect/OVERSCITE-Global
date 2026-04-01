
'use client';

import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  Calendar as CalendarIcon,
  Users,
  Loader2,
  MapPin,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockInspectors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getCalendarBookings, createCalendarBooking } from '@/lib/services/calendar-service';
import { CalendarBooking } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type CellState = {
  state: 'booked' | 'available' | 'empty';
  booking?: CalendarBooking;
};

const getColorFromId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

import { PageHeader } from '@/components/layout/PageHeader';

export default function CalendarPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`);

  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInspectors, setSelectedInspectors] = useState<string[]>(
    mockInspectors.map(i => i.id)
  );
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await getCalendarBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleInspectorToggle = (inspectorId: string) => {
    setSelectedInspectors(prev =>
      prev.includes(inspectorId)
        ? prev.filter(id => id !== inspectorId)
        : [...prev, inspectorId]
    );
  };

  const allInspectorsSelected = selectedInspectors.length === mockInspectors.length;
  const handleToggleAll = () => {
    if (allInspectorsSelected) {
      setSelectedInspectors([]);
    } else {
      setSelectedInspectors(mockInspectors.map(i => i.id));
    }
  };

  const handleCreateBooking = () => {
    toast({
      title: "Booking Requested",
      description: "Opening operational dispatch wizard for new appointment creation...",
    });
    // In real implementation, this opens a modal or navigates to a real form
  };

  const isTimeInBooking = (time: string, booking: CalendarBooking) => {
    const bookingStart = new Date(booking.start_at as string);
    const bookingEnd = new Date(booking.end_at as string);
    const [hour] = time.split(':').map(Number);
    const bookingStartHour = bookingStart.getHours();
    const bookingEndHour = bookingEnd.getHours();
    return hour >= bookingStartHour && hour < bookingEndHour;
  };

  const getCellForSlot = (dayIndex: number, time: string): CellState => {
    // Basic day matching for SEED_BOOKINGS (Oct 28 - Nov 3 cycle)
    const booking = bookings.find(b => {
      const bDate = new Date(b.start_at as string);
      const bDayIndex = (bDate.getDay() + 6) % 7; // Mon is 0
      return bDayIndex === dayIndex && isTimeInBooking(time, b);
    });

    if (booking) return { state: 'booked', booking };
    
    // For consistency with design, suggest availability during business hours
    const hour = parseInt(time.split(':')[0]);
    if (dayIndex < 5 && hour >= 9 && hour <= 17) return { state: 'available' };
    
    return { state: 'empty' };
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Calendar & Scheduling" 
        status="live"
        guidanceId="smart-scheduler"
        description="The Operations Calendar provides a unified temporal view of all scheduled inspections, team rotations, and jurisdictional deadlines across the OVERSCITE network. It allows mission controllers to optimize personnel allocation and track the multi-phase lifecycle of complex field assessments. By synchronizing with regional time zones and weather intelligence, the calendar helps prevent operational delays and safety violations. This scheduling engine is critical for maintaining the high-density workflow required to meet global inspection demands."
      />
      <div className="grid max-w-full gap-8 px-0 md:grid-cols-[280px_1fr]">
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="toggle-all"
                checked={allInspectorsSelected}
                onCheckedChange={handleToggleAll}
              />
              <Label htmlFor="toggle-all" className="font-semibold">Toggle All</Label>
            </div>
            {mockInspectors.map(inspector => {
              const avatar = PlaceHolderImages.find(p => p.id === inspector.imageHint);
              return (
                <div key={inspector.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={inspector.id}
                    checked={selectedInspectors.includes(inspector.id)}
                    onCheckedChange={() => handleInspectorToggle(inspector.id)}
                    style={{ borderColor: getColorFromId(inspector.id) }}
                    className="data-[state=checked]:bg-transparent"
                  />
                  {avatar && (
                    <Image src={avatar.imageUrl} alt={inspector.name} width={32} height={32} className="rounded-full" />
                  )}
                  <Label htmlFor={inspector.id} className="flex-1 cursor-pointer">{inspector.name}</Label>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Schedule (Beta)</CardTitle>
              <CardDescription>
                Weekly operational overview with real-time record persistence.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" className="gap-1"><CalendarIcon className="h-4 w-4" /> Nov 1 - Nov 7, 2023</Button>
              <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              <Button onClick={handleCreateBooking}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Booking
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-24 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Retreiving persisted records...</p>
            </div>
          ) : (
            <div className="grid grid-cols-8 grid-rows-[auto,1fr] gap-px border-l border-t bg-border overflow-x-auto min-w-[800px]">
              <div className="bg-card/80 p-2"></div>
              {days.map((day) => (
                <div key={day} className="bg-card/80 p-2 text-center font-semibold">
                  {day}
                </div>
              ))}

              {times.map((time, timeIndex) => (
                <React.Fragment key={time}>
                  <div className="row-span-1 bg-card/80 p-2 text-right text-xs text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {time}
                    </div>
                  </div>
                  {days.map((day, dayIndex) => {
                    const cell = getCellForSlot(dayIndex, time);
                    const booking = cell.booking;
                    const isSelected = booking && selectedInspectors.includes(booking.created_by === 'system' ? mockInspectors[0].id : booking.created_by); // Simplified mapping
                    const color = booking ? getColorFromId(booking.id) : 'hsl(var(--primary))';

                    return (
                      <div key={`${day}-${time}`} className="row-span-1 bg-card/80 p-1 text-xs relative min-h-[60px]">
                        {cell.state === 'booked' && booking ? (
                          <div
                            className={cn(
                              "border border-primary/50 text-white rounded-md p-2 h-full flex flex-col justify-center transition-all duration-300 shadow-sm",
                              isSelected ? "bg-primary opacity-100" : "bg-muted/40 opacity-30"
                            )}
                            style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
                          >
                            <p className="font-bold truncate" title={booking.title}>{booking.title.split(':')[0]}</p>
                            <div className="flex items-center gap-1 opacity-80 mt-1">
                                <MapPin className="h-2 w-2" />
                                <span className="text-[10px] truncate">{booking.location}</span>
                            </div>
                          </div>
                        ) : cell.state === 'available' ? (
                          <div className="bg-primary/5 border border-primary/10 text-primary-foreground rounded-md p-1 h-full flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-[10px]">
                            Available
                          </div>
                        ) : (
                          <div className="bg-muted/10 h-full rounded-md"></div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
