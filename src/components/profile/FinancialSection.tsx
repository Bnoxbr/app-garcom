import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

interface Card {
  id: string;
  last4: string;
  brand: string;
  isDefault: boolean;
}

interface FinancialSectionProps {
  cards: Card[];
  onDeleteCard: (cardId: string) => void;
  onSetDefaultCard: (cardId: string) => void;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ cards, onDeleteCard, onSetDefaultCard }) => {

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestão Financeira</h3>
      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.id} className={`p-4 rounded-lg border ${card.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{card.brand} **** {card.last4}</p>
                {card.isDefault && <span className="text-xs font-medium text-blue-600">Padrão</span>}
              </div>
              <div className="flex items-center space-x-2">
                {!card.isDefault && (
                  <button onClick={() => onSetDefaultCard(card.id)} className="text-sm text-blue-600 hover:underline">Definir como padrão</button>
                )}
                <button onClick={() => onDeleteCard(card.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        <PlusCircle className="w-5 h-5 mr-2" />
        Adicionar Novo Cartão
      </button>
    </div>
  );
};

export default FinancialSection;