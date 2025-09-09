import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface PWAUpdatePromptProps {
  className?: string;
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ className = '' }) => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowUpdatePrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt && !offlineReady) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
      {offlineReady && (
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>App pronto para uso offline!</span>
          </div>
          <button
            onClick={close}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
      
      {showUpdatePrompt && (
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Nova versão disponível!</span>
            </div>
            <button
              onClick={close}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-white text-blue-500 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Atualizar
            </button>
            <button
              onClick={close}
              className="border border-white text-white px-4 py-2 rounded font-medium hover:bg-white hover:text-blue-500 transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAUpdatePrompt;