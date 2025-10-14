import React from 'react';

const CreateServiceOffer: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Nova Oferta de Serviço</h1>
      <form className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Título do Serviço</label>
          <input type="text" id="title" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" placeholder="Ex: Garçom para evento de casamento" />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Descrição</label>
          <textarea id="description" rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" placeholder="Descreva os detalhes do serviço, o que você espera do profissional, etc."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Data e Hora</label>
            <input type="datetime-local" id="date" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Localização</label>
            <input type="text" id="location" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" placeholder="Ex: Av. Paulista, 1000, São Paulo - SP" />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="value" className="block text-gray-700 font-bold mb-2">Valor (R$)</label>
          <input type="number" id="value" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" placeholder="150.00" />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            Criar Oferta e Buscar Profissionais
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateServiceOffer;