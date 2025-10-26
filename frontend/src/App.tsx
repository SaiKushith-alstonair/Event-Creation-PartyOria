import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import EventCreationPage from './components/EventCreationPage';
import EventList from './components/EventList';
import ErrorBoundary from './components/ErrorBoundary';
import errorLogger from './utils/errorLogger';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'eventCreation' | 'eventList'>('landing');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Display system information on app load
    console.log('🚀 PartyOria Event Management System Started');
    errorLogger.displaySystemInfo();
    
    // Log app initialization
    console.log('App initialized with state:', {
      currentView,
      selectedSection,
      selectedSubsection
    });
  }, []);

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handleSubsectionSelect = (subsectionId: string, fromPlanButton?: boolean) => {
    setSelectedSubsection(subsectionId);
    if (fromPlanButton) {
      setCurrentView('eventCreation');
    }
  };

  const handleBack = () => {
    if (selectedSubsection) {
      setSelectedSubsection(null);
    } else if (selectedSection) {
      setSelectedSection(null);
    }
  };

  const handleShowEventList = () => {
    setCurrentView('eventList');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedSection(null);
    setSelectedSubsection(null);
    setEditEventId(undefined);
  };

  const handleCreateNewEvent = () => {
    setEditEventId(undefined);
    setCurrentView('eventCreation');
  };

  return (
    <ErrorBoundary>
      {currentView === 'eventList' && (
        <EventList
          onEditEvent={(eventId: string, sectionId: string, subsectionId: string) => {
            console.log('Editing event:', { eventId, sectionId, subsectionId });
            setEditEventId(eventId);
            setSelectedSection(sectionId);
            setSelectedSubsection(subsectionId);
            setCurrentView('eventCreation');
          }}
          onBack={handleBackToLanding}
        />
      )}

      {currentView === 'eventCreation' && (
        <EventCreationPage
          sectionId={selectedSection || ''}
          subsectionId={selectedSubsection || ''}
          onBack={handleBackToLanding}
          onEventCreated={(eventName: string, clientName: string) => {
            console.log('Event created:', { eventName, clientName });
            setCurrentView('landing');
            setSelectedSection(null);
            setSelectedSubsection(null);
            setEditEventId(undefined);
          }}
          editEventId={editEventId}
        />
      )}

      {currentView === 'landing' && (
        <LandingPage
          selectedSection={selectedSection}
          onSectionSelect={handleSectionSelect}
          onSubsectionSelect={handleSubsectionSelect}
          onBack={handleBack}
          onShowEventList={handleShowEventList}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
