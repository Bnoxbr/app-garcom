import React from 'react';
import { usePWA } from '../hooks/usePWA';

interface OfflineNotificationProps {
  className?: string;
}

const OfflineNotification: React.FC<OfflineNotificationProps> = ({ className = '' }) => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Você está offline. Algumas funcionalidades podem estar limitadas.</span>
        </div>
      </div>
    </div>
  );
};

export default OfflineNotification;