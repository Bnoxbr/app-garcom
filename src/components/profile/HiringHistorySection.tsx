import React from 'react';

interface Hiring {
  id: number;
  name: string;
  photo: string;
  position: string;
  date: string;
  status: string;
  rating: number;
}

interface HiringHistorySectionProps {
  history: Hiring[];
}

const HiringHistorySection: React.FC<HiringHistorySectionProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <p className="text-gray-500">Nenhum histórico de contratação encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3">Histórico Recente</h3>
        <div className="space-y-3">
            {history.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-medium">{item.name}</h4>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${item.status === "Finalizado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                            >
                                {item.status}
                            </span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <div className="text-sm text-gray-500">
                                <span>{item.position}</span>
                                <span className="mx-2">•</span>
                                <span>{item.date}</span>
                            </div>
                            <div className="flex items-center text-yellow-500 text-sm">
                                <i className="fas fa-star mr-1"></i>
                                <span>{item.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <button className="w-full mt-3 py-3 text-center text-gray-600 text-sm cursor-pointer hover:bg-gray-100 rounded-lg">
            Ver histórico completo
        </button>
    </div>
  );
};

export default HiringHistorySection;