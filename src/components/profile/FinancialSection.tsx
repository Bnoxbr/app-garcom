import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface CreditCard {
  id: string;
  last4: string;
  brand: string;
  is_default: boolean;
}

interface FinancialSectionProps {
  cards: CreditCard[];
  onAddCard: (cardData: any) => void; // A ser definido com a integração de pagamento
  onDeleteCard: (cardId: string) => void;
  onSetDefault: (cardId: string) => void;
}

const mockCards: CreditCard[] = [
  {
    id: 'card_1',
    last4: '4242',
    brand: 'Visa',
    is_default: true,
  },
  {
    id: 'card_2',
    last4: '8431',
    brand: 'Mastercard',
    is_default: false,
  },
];

const FinancialSection: React.FC<FinancialSectionProps> = ({ 
    cards = mockCards, 
    onAddCard, 
    onDeleteCard, 
    onSetDefault 
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = () => {
    // Lógica para abrir o modal/formulário de adição de cartão
    toast.success('Funcionalidade para adicionar cartão a ser implementada.');
    // onAddCard({ ... });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
      <h3 className="font-semibold text-lg mb-4">Área Financeira</h3>
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <i className={`fab fa-cc-${card.brand.toLowerCase()} text-2xl mr-3`}></i>
              <div>
                <p className="font-medium">**** **** **** {card.last4}</p>
                {card.is_default && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Padrão</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!card.is_default && (
                <button onClick={() => onSetDefault(card.id)} className="text-gray-500 hover:text-blue-600 text-sm">Definir Padrão</button>
              )}
              <button onClick={() => onDeleteCard(card.id)} className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={handleAddCard} 
        className="w-full mt-4 py-2 text-center text-blue-600 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Adicionar Novo Cartão
      </button>
    </div>
  );
};

export default FinancialSection;