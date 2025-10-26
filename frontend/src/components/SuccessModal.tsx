import React from 'react';
import { CheckCircle, X, Calendar, Plus } from 'lucide-react';
import { getEventTheme } from '../utils/eventThemes';

interface SuccessModalProps {
  eventName: string;
  clientName: string;
  onClose: () => void;
  eventType?: string;
  subsectionId?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ eventName, clientName, onClose, eventType = 'corporate', subsectionId }) => {
  const theme = getEventTheme(eventType, subsectionId);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.cardBg} rounded-xl shadow-lg max-w-md w-full border-2`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${theme.text}`}>Event Created!</h3>
                <p className={`${theme.accent} opacity-80`}>Your event has been successfully created</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`${theme.accent} hover:opacity-60 transition-all hover:scale-110`}
            >
              <X size={24} />
            </button>
          </div>

          <div className={`${theme.cardBg} rounded-lg p-4 mb-6 border ${theme.accent.replace('text-', 'border-')}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className={theme.icon} size={20} />
              <span className={`font-medium ${theme.text}`}>Event Details</span>
            </div>
            <p className={`${theme.text} font-semibold`}>{eventName}</p>
            <p className={`${theme.accent} text-sm font-medium`}>Client: {clientName}</p>
            <p className={`${theme.accent} text-sm opacity-80`}>
              Your vendors will be notified and will contact you soon with availability and quotes.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={`font-medium ${theme.text}`}>What's Next?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 ${theme.accent.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                <span className={`${theme.accent} opacity-80`}>Vendors will review your requirements and respond within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 ${theme.accent.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                <span className={`${theme.accent} opacity-80`}>You'll receive quotes and availability confirmations via email</span>
              </li>
              <li className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 ${theme.accent.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                <span className={`${theme.accent} opacity-80`}>Book your preferred vendors to finalize your event</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t-2 ${theme.accent.replace('text-', 'border-')} p-6 flex flex-col sm:flex-row gap-3`}>
          <button
            onClick={onClose}
            className={`flex items-center justify-center gap-2 ${theme.buttonBg} ${theme.buttonHover} text-white font-semibold py-3 px-6 rounded-lg transition-colors flex-1`}
          >
            <Plus size={20} />
            Create Another Event
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;