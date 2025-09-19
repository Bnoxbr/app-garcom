import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profissional, Profile } from '../types';

interface ProfessionalsGridProps {
  professionals: (Profissional & Profile)[];
}

const ProfessionalsGrid: React.FC<ProfessionalsGridProps> = ({ professionals }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Profissionais Disponíveis</h3>
        <button 
          onClick={() => navigate('/search')}
          className="text-gray-600 text-sm flex items-center cursor-pointer hover:text-gray-800 hover:translate-x-1 transition-all duration-200"
        >
          <span>Ver todos</span>
          <i className="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
      
      {/* Grid responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
        {professionals.slice(0, 21).map((professional, index) => (
          <div 
            key={professional.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 hover:translate-y-[-2px] hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in"
            onClick={() => navigate(`/professional/profile/${professional.id}`)}
            style={{ 
              height: '160px',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Container da imagem com overlay */}
            <div className="relative" style={{ height: '90px' }}>
              <img
                src={professional.avatar_url || "/images/default-avatar.svg"}
                alt={`Foto de ${professional.full_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-avatar.svg";
                }}
              />
            </div>
            
            {/* Informações do profissional */}
            <div className="p-2" style={{ height: '70px' }}>
              {/* Linha superior: Nome/Categoria à esquerda, Rating/Status à direita */}
              <div className="flex justify-between items-start mb-1">
                {/* Nome e categoria - canto superior esquerdo */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate leading-tight">
                    {professional.full_name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {professional.especialidades?.[0] || 'Profissional'}
                  </p>
                </div>
                
                {/* Rating e Status - canto superior direito */}
                <div className="flex flex-col items-end ml-2">
                  <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center mb-1">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{professional.rating || 'N/A'}</span>
                  </div>
                  {professional.available && (
                    <div className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Disponível
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botão para ver mais profissionais */}
      {professionals.length > 21 && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/search')}
            className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:translate-y-[-1px] border border-gray-200"
          >
            Ver mais {professionals.length - 21} profissionais
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsGrid;