import React, { useState, useEffect } from 'react';

interface VenuesRequirementDisplayProps {
  eventId: string;
  onVenueSelect: (venueData: any) => void;
}

const VenuesRequirementDisplay: React.FC<VenuesRequirementDisplayProps> = ({ eventId, onVenueSelect }) => {
  const [venueOptions, setVenueOptions] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenueOptions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/requirement-questions/?requirement_id=venues&event_id=${eventId}`);
        const data = await response.json();
        
        if (data.questions && data.questions.length > 0) {
          const venueQuestion = data.questions.find((q: any) => q.question_type === 'checkbox');
          if (venueQuestion && venueQuestion.options) {
            setVenueOptions(venueQuestion.options);
            setLoading(false);
            return;
          }
        }
        
        // If no questions found, try to get venue options from requirements API
        const requirementsResponse = await fetch(`http://localhost:8000/api/events/requirements/?event_id=${eventId}`);
        const requirementsData = await requirementsResponse.json();
        
        // Find venues requirement and extract venue options
        const venuesRequirement = requirementsData.find((req: any) => req.requirement_id === 'venues');
        if (venuesRequirement) {
          // Try to get questions for this specific requirement
          const questionsResponse = await fetch(`http://localhost:8000/api/events/requirement-questions/?requirement_id=venues`);
          const questionsData = await questionsResponse.json();
          
          if (questionsData.questions && questionsData.questions.length > 0) {
            const venueQuestion = questionsData.questions.find((q: any) => q.question_type === 'checkbox');
            if (venueQuestion && venueQuestion.options) {
              setVenueOptions(venueQuestion.options);
              setLoading(false);
              return;
            }
          }
        }
        
        // Final fallback - use event-specific venue options
        const eventSpecificVenues = getEventSpecificVenues(eventId);
        setVenueOptions(eventSpecificVenues);
      } catch (error) {
        console.error('Error loading venue options:', error);
        // Fallback venue options based on event type
        const eventSpecificVenues = getEventSpecificVenues(eventId);
        setVenueOptions(eventSpecificVenues);
      } finally {
        setLoading(false);
      }
    };

    loadVenueOptions();
  }, [eventId]);

  const getEventSpecificVenues = (eventId: string): string[] => {
    // Event-specific venue mapping
    const eventVenueMapping: Record<string, string[]> = {
      'tree-planting-drive': ['Outdoor Venue', 'Park', 'Forest Area', 'Farmland', 'Open Ground'],
      'clean-up-drive': ['Outdoor Venue', 'Park', 'Public Venue', 'Recycling Center', 'Open Ground'],
      'eco-festival': ['Outdoor Venue', 'Park', 'Community Centre', 'Open Ground'],
      'environmental-awareness-campaign': ['Outdoor Venue', 'Community Centre', 'Park', 'Public Venue'],
      'wedding': ['Banquet Hall', 'Marriage Hall', 'Resort', 'Hotel', 'Garden', 'Palace'],
      'conference': ['Hotel', 'Conference Centre', 'Banquet Hall', 'Community Centre', 'Commercial Space'],
      'birthday': ['Banquet Hall', 'Restaurant', 'Community Centre', 'Apartment', 'Garden'],
      'corporate-party': ['Hotel', 'Banquet Hall', 'Resort', 'Restaurant', 'Rooftop Venue'],
      'music-concert': ['Theatre', 'Stadium', 'Outdoor Venue', 'Arts Centre', 'Auditorium'],
      'sports-tournament': ['Stadium', 'Sports Centre', 'Outdoor Venue', 'Swimming Pool'],
      'health-camp': ['Community Centre', 'Clinic', 'Hospital', 'School'],
      'workshop': ['Conference Centre', 'Library', 'School', 'College', 'Training Center']
    };
    
    return eventVenueMapping[eventId] || ['Banquet Hall', 'Hotel', 'Community Center', 'Garden', 'Restaurant', 'Convention Center', 'Resort', 'Farmhouse', 'Auditorium', 'Open Ground', 'Home', 'Club House', 'Rooftop Venue', 'Beach Resort'];
  };

  const handleVenueToggle = (venue: string) => {
    setSelectedVenues(prev => 
      prev.includes(venue) 
        ? prev.filter(v => v !== venue)
        : [...prev, venue]
    );
  };

  const handleSave = () => {
    const venueData = {
      selectedVenues,
      guestCount,
      budgetRange,
      requirementId: 'venues'
    };
    onVenueSelect(venueData);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading venue options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🏛️ Venues
        </h3>
        
        {/* Venue Types Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select preferred venue types for your event*
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {venueOptions.map(venue => (
              <button
                key={venue}
                type="button"
                onClick={() => handleVenueToggle(venue)}
                className={`p-3 text-sm rounded-lg border-2 transition-all ${
                  selectedVenues.includes(venue)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                }`}
              >
                {venue}
              </button>
            ))}
          </div>
          {selectedVenues.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Selected: {selectedVenues.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Guest Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected number of guests
          </label>
          <input
            type="number"
            value={guestCount || ''}
            onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter expected guest count"
            min="1"
            max="10000"
          />
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue budget range
          </label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select budget range</option>
            <option value="Under ₹10,000">Under ₹10,000</option>
            <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
            <option value="Above ₹2,50,000">Above ₹2,50,000</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={selectedVenues.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            selectedVenues.length > 0
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Venue Preferences ({selectedVenues.length} selected)
        </button>
      </div>
    </div>
  );
};

export default VenuesRequirementDisplay;