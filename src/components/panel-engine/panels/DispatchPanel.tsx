/**
 * @classification PANEL
 * @authority Director
 * @status IMPLEMENTED
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';

interface DispatchEvent {
  id: number;
  time: string;
  message: string;
}

const dispatchMessages = [
  'Asset #34B requires immediate inspection.',
  'High-priority alert: Structural anomaly detected.',
  'Team Gamma, proceed to Sector 9.',
  'Weather advisory update: Wind speeds increasing.',
  'System integrity check initiated.',
  'Drone #A12 returning to base.',
];

let eventId = 0;

const DispatchPanel: React.FC = () => {
  const [events, setEvents] = useState<DispatchEvent[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newEvent: DispatchEvent = {
        id: eventId++,
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        message: dispatchMessages[Math.floor(Math.random() * dispatchMessages.length)],
      };

      setEvents(prevEvents => {
        const updatedEvents = [newEvent, ...prevEvents];
        // Keep a maximum of 6 entries
        return updatedEvents.length > 6 ? updatedEvents.slice(0, 6) : updatedEvents;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full text-sm font-mono">
      <ul>
        {events.map(event => (
          <li key={event.id} className="border-b border-white/10 py-1.5">
            <span className="text-green-400 mr-3">{event.time}</span>
            <span>{event.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DispatchPanel;
