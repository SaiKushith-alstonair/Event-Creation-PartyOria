import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getEventTheme } from '../utils/eventThemes';

interface BreadcrumbProps {
  sectionName: string;
  subsectionName: string;
  onBack: () => void;
  eventType?: string;
  subsectionId?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  sectionName,
  subsectionName,
  onBack,
  eventType = 'corporate',
  subsectionId,
}) => {
  const theme = getEventTheme(eventType, subsectionId);
  
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 ${theme.accent} hover:opacity-80 font-medium mb-4 transition-colors bg-white px-4 py-2 rounded-lg border`}
      >
        <ArrowLeft size={20} />
        Back to Event Selection
      </button>
      
      <nav className={`flex items-center space-x-2 text-sm ${theme.text}`}>
        <span className="opacity-70">Event Categories</span>
        <ChevronRight size={16} className="opacity-50" />
        <span className="font-medium">{sectionName}</span>
        <ChevronRight size={16} className="opacity-50" />
        <span className={`font-semibold ${theme.accent}`}>{subsectionName}</span>
      </nav>
    </div>
  );
};

export default Breadcrumb;