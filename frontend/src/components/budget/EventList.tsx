import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { budgetAPI } from '../services/api';
import { Calendar, Users, DollarSign } from 'lucide-react';

interface EventListProps {
  onSelectEvent: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await budgetAPI.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center p-4">Loading events...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{event.event_name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {event.form_data.event_type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    {event.form_data.attendees} attendees
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    ₹{event.form_data.budget.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-xs ${
                  event.budget_allocation ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.budget_allocation ? 'Allocated' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;