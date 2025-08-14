import React, { useState, useRef, useEffect } from 'react';
import PlaceholderImage from '../../components/ui/PlaceholderImage';
import NavigationPlaceholder from '../../components/ui/NavigationPlaceholder';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - será substituído por hooks do Supabase
  const quickReplies = [
    'Sim, posso começar',
    'Qual o salário?',
    'Preciso de mais detalhes',
    'Quando seria?',
    'Obrigado pelo interesse'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui será implementada a lógica de envio via Supabase
      console.log('Enviando mensagem:', message);
      setMessage('');
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center px-4 py-3">
          <NavigationPlaceholder to="/back" className="cursor-pointer">
            <i className="fas fa-arrow-left text-xl mr-3 text-gray-600"></i>
          </NavigationPlaceholder>
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <PlaceholderImage 
                type="profile" 
                size="40x40" 
                className="w-full h-full object-cover" 
                alt="Mariana Silva"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Mariana Silva</h1>
              <p className="text-sm text-gray-500">Online agora</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <NavigationPlaceholder to="/call" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="fas fa-phone text-gray-600"></i>
            </NavigationPlaceholder>
            <NavigationPlaceholder to="/video" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="fas fa-video text-gray-600"></i>
            </NavigationPlaceholder>
            <NavigationPlaceholder to="/menu" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="fas fa-ellipsis-v text-gray-600"></i>
            </NavigationPlaceholder>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="pt-20 pb-32 px-4 space-y-4">
        {/* Message from Mariana */}
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <PlaceholderImage 
              type="profile" 
              size="32x32" 
              className="w-full h-full object-cover object-top" 
              alt="Mariana Silva"
            />
          </div>
          <div className="max-w-[75%]">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
              <p className="text-sm">Olá! Vi que você está procurando um garçom para seu restaurante. Tenho 3 anos de experiência em restaurantes de alta gastronomia.</p>
            </div>
            <span className="text-xs text-gray-500 ml-1 mt-1 block">09:30</span>
          </div>
        </div>

        {/* Message from User */}
        <div className="flex mb-4 justify-end">
          <div className="max-w-[75%]">
            <div className="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 shadow-sm">
              <p className="text-sm">Olá Mariana! Sim, estamos contratando. Qual sua disponibilidade de horários?</p>
            </div>
            <div className="flex justify-end items-center mt-1 mr-1">
              <span className="text-xs text-gray-500 block">09:45</span>
              <i className="fas fa-check-double text-blue-500 text-xs ml-1"></i>
            </div>
          </div>
        </div>

        {/* Message from Mariana */}
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <PlaceholderImage 
              type="profile" 
              size="32x32" 
              className="w-full h-full object-cover object-top" 
              alt="Mariana Silva"
            />
          </div>
          <div className="max-w-[75%]">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
              <p className="text-sm">Tenho disponibilidade para trabalhar em período integral ou meio período. Prefiro turnos noturnos, mas sou flexível.</p>
            </div>
            <span className="text-xs text-gray-500 ml-1 mt-1 block">10:15</span>
          </div>
        </div>

        {/* Message from User */}
        <div className="flex mb-4 justify-end">
          <div className="max-w-[75%]">
            <div className="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 shadow-sm">
              <p className="text-sm">Perfeito! Precisamos de alguém para o turno noturno, das 18h às 23h. Você poderia começar na próxima semana para um período de teste?</p>
            </div>
            <div className="flex justify-end items-center mt-1 mr-1">
              <span className="text-xs text-gray-500 block">10:20</span>
              <i className="fas fa-check-double text-blue-500 text-xs ml-1"></i>
            </div>
          </div>
        </div>

        {/* Unread Message from Mariana (highlighted) */}
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <PlaceholderImage 
              type="profile" 
              size="32x32" 
              className="w-full h-full object-cover object-top" 
              alt="Mariana Silva"
            />
          </div>
          <div className="max-w-[75%]">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg rounded-tl-none p-3 shadow-sm">
              <p className="text-sm">Posso começar na próxima terça-feira. Qual horário prefere?</p>
            </div>
            <span className="text-xs text-gray-500 ml-1 mt-1 block">10:45</span>
          </div>
        </div>

        <div ref={messagesEndRef}></div>
      </div>

      {/* Quick Replies */}
      <div className="fixed bottom-16 w-full bg-white border-t border-gray-100 px-2 py-2">
        <div className="flex overflow-x-auto pb-1 no-scrollbar">
          {quickReplies.map((reply, index) => (
            <button 
              key={index} 
              onClick={() => handleQuickReply(reply)}
              className="flex-shrink-0 bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm mr-2 whitespace-nowrap cursor-pointer hover:bg-gray-200"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex items-center px-3 py-2">
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 cursor-pointer">
            <i className="fas fa-paperclip"></i>
          </button>
          <div className="flex-1 mx-2 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="w-full py-2 px-3 rounded-lg bg-gray-100 border-none text-sm resize-none max-h-24 min-h-[40px]"
              rows={1}
            ></textarea>
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
              <i className="far fa-smile"></i>
            </button>
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full cursor-pointer ${message.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Chat;