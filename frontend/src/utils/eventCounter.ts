import { eventSections } from '../data/eventSections';

export const getEventCounts = () => {
  const totalEvents = eventSections.reduce((total, section) => 
    total + section.subsections.length, 0
  );
  
  const categoryCounts = eventSections.map(section => ({
    category: section.name,
    count: section.subsections.length
  }));

  return {
    total: totalEvents,
    categories: categoryCounts
  };
};