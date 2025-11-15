import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profissional } from '../types';

// O nome pode variar (ex: ProfessionalWithProfile), mas 'Profissional' será ajustado para incluir os campos.
interface ProfessionalWithDetails extends Profissional {
    full_name?: string;
    average_rating?: number | string;
    total_reviews?: number;
    is_available?: boolean;
}

interface ProfessionalsGridProps {
  professionals: ProfessionalWithDetails[];
}

const ProfessionalsGrid: React.FC<ProfessionalsGridProps> = ({ professionals }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* TÍTULO: text-gray-800 -> text-sw-blue-primary */}
        <h3 className="text-lg font-semibold text-sw-blue-primary">Profissionais Disponíveis</h3>
        {/* BOTÃO VER TODOS: text-gray-600 -> text-sw-blue-primary (Melhor contraste) */}
        <button 
          onClick={() => navigate('/search')}
          className="text-sw-blue-primary text-sm flex items-center cursor-pointer hover:text-sw-yellow-accent hover:translate-x-1 transition-all duration-200"
        >
          <span>Ver todos</span>
          <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
        {professionals.slice(0, 21).map((professional, index) => {
           const displayName = professional.nome_completo || professional.full_name || 'Profissional';
           const rawRating = professional.average_rating ? Number(professional.average_rating) : 0; 
           const displayRating = (rawRating > 0) ? rawRating.toFixed(1) : 'N/A';
           const totalReviews = professional.total_reviews || 0;
           const firstSpecialty = professional.especialidades?.[0] || professional.categoria || 'Profissional';
           const isAvailable = professional.is_available || false; 

           return (
// NOVO TRECHO para o ProfessionalsGrid.tsx
// Adicionado 'shadow-md' para a sombra base e ajustado o hover para 'shadow-xl'
             <div 
               key={professional.id} 
               className="relative rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.03] hover:shadow-xl transition-all duration-300 opacity-0 animate-fade-in bg-white"
               onClick={() => navigate(`/professional/profile/${professional.id}`)}
// ...
               style={{ 
                 height: '180px', // Altura ligeiramente maior para o novo visual
                 animationDelay: `${index * 0.05}s`,
                 animationFillMode: 'forwards'
               }}
             >
                {/* Imagem de Fundo (100% da altura do Card) */}
                <img
                    src={professional.avatar_url || "/images/default-avatar.svg"}
                    alt={`Foto de ${displayName}`}
                    // Imagem ocupa 100% do espaço do Card
                    className="w-full h-full object-cover"
                    onError={(e) => {
                       (e.currentTarget as HTMLImageElement).src = "/images/default-avatar.svg";
                    }}
                />

                {/* Bloco de Gradiente para Legibilidade do Texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               
                {/* --- NOVO BLOCO DE INFORMAÇÃO (Canto Inferior Esquerdo) --- */}
                <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                    <div className="flex justify-between items-end">
                        <div className="flex-1 overflow-hidden">
                            {/* Nome */}
                            <h4 className="font-bold text-base truncate leading-tight text-shadow-sm">
                                {displayName}
                            </h4>
                            {/* Atuação/Especialidade */}
                            <p className="text-xs truncate opacity-80">
                                {firstSpecialty}
                            </p>
                        </div>
                        
                        {/* Bloco de Avaliação e Disponibilidade (Canto Inferior Direito) */}
                        <div className="flex flex-col items-end ml-2 flex-shrink-0">
                            {/* Avaliação (text-yellow-400 -> text-sw-yellow-accent) */}
                            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center mb-1">
                                <i className="fas fa-star text-sw-yellow-accent mr-1"></i>
                                <span>{displayRating}</span>
                            </div>
                            {/* Indicador de Disponível (bg-green-200 -> bg-sw-yellow-accent/40 text-sw-blue-primary) */}
                            {isAvailable && (
                                <div className="bg-sw-yellow-accent/40 text-sw-blue-primary text-xs px-2 py-0.5 rounded-full font-bold mt-1">
                                    Disponível
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             </div>
           );
        })}
      </div>
      
      {professionals.length > 21 && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/search')}
            // Corrigido para o novo branding (bg-sw-blue-primary no hover)
            className="bg-white hover:bg-sw-blue-primary/10 text-sw-blue-primary px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:translate-y-[-1px] border border-gray-200"
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