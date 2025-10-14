import React, { useState } from 'react';
import type { Profissional } from '../types';
import ServiceBookingModal from './ServiceBookingModal';

const ServiceBookingExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleProfessional: Profissional = {
    id: '1',
    nome_completo: 'João da Silva',
    telefone: '11999998888',
    bio: 'Especialista em casamentos e eventos corporativos.',
    categoria: 'Garçom',
    especialidades: ['Vinhos', 'Coquetelaria'],
    disponibilidade_semanal: {
      segunda: { inicio: '18:00', fim: '23:00' },
      quarta: { inicio: '19:00', fim: '00:00' },
      sexta: { inicio: '18:00', fim: '02:00' },
      sabado: { inicio: '12:00', fim: '02:00' },
      domingo: { inicio: '12:00', fim: '22:00' },
    },
    valor_hora: 75.5,
    avatar_url: 'https://i.pravatar.cc/150?u=joao',
    rating: 4.9,
    reviews: 89,
    distance: "5km",
    available: true,
    price: '75.50',
    description: 'Especialista em casamentos e eventos corporativos.',
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exemplo de Agendamento</h1>
      <div className="max-w-sm rounded overflow-hidden shadow-lg p-4">
        <img className="w-full" src={exampleProfessional.avatar_url} alt={exampleProfessional.nome_completo} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{exampleProfessional.nome_completo}</div>
          <p className="text-gray-700 text-base">
            {exampleProfessional.bio}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {exampleProfessional.especialidades && exampleProfessional.especialidades.map((spec, index) => (
            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{spec}</span>
          ))}
        </div>
        <div className="px-6 py-4">
          <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Agendar Serviço
          </button>
        </div>
      </div>

      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        professional={exampleProfessional}
      />
    </div>
  );
};

export default ServiceBookingExample;