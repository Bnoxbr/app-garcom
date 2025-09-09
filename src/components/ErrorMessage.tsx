import React from 'react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  showRetry?: boolean
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="text-red-500 text-xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ops! Algo deu errado</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">🔄</span>
          Tentar novamente
        </button>
      )}
    </div>
  )
}