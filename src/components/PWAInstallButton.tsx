import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  variant = 'primary' 
}) => {
  const { canInstall, installApp, isInstalled, isOnline, showAutomaticBanner, setShowAutomaticBanner } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!canInstall) return;
    
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Erro ao instalar o app:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Não mostrar o botão se já estiver instalado
  if (isInstalled) {
    return (
      <div className={`flex items-center text-green-600 ${className}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">App Instalado</span>
      </div>
    );
  }

  // Não mostrar o botão se não for possível instalar
  if (!canInstall) {
    return null;
  }

  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg focus:ring-blue-500`;
      case 'secondary':
        return `${baseStyles} bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg focus:ring-gray-500`;
      case 'minimal':
        return `${baseStyles} text-blue-600 hover:text-blue-700 px-2 py-1 rounded focus:ring-blue-500`;
      default:
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg focus:ring-blue-500`;
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Status de conectividade */}
      <div className="flex items-center text-sm">
        <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Configuração do banner automático */}
      <div className="flex items-center space-x-2 text-sm">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAutomaticBanner}
            onChange={(e) => setShowAutomaticBanner(e.target.checked)}
            className="mr-2 rounded"
          />
          <span className="text-gray-600">Banner automático</span>
        </label>
      </div>

      {/* Botão de instalação */}
      <button
        onClick={handleInstall}
        disabled={isInstalling || !canInstall}
        className={getButtonStyles()}
      >
        {isInstalling ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Instalando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Instalar App
          </>
        )}
      </button>
      
      {variant !== 'minimal' && (
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Instale o app para acesso rápido e uso offline
        </p>
      )}
    </div>
  );
};

export default PWAInstallButton;