// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. 

import React, { useState, useRef, useEffect } from 'react';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickReplies] = useState([
    'Às 9h está bom',
    'Prefiro às 14h',
    'Podemos conversar sobre isso?',
    'Obrigado pela disponibilidade'
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-10">
        <div className="flex items-center px-4 py-3">
          <a 
            href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/1e3dbf0d-dee6-4e1a-8032-0f055f0d88fb" 
            data-readdy="true" 
            className="mr-3 cursor-pointer"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </a>
          <div className="flex items-center flex-1">
            <div className="relative mr-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520restaurant%2520uniform%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=60&height=60&seq=1&orientation=squarish"
                  alt="Mariana Silva"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-800 bg-green-500"></div>
            </div>
            <div>
              <h2 className="font-semibold">Mariana Silva</h2>
              <div className="flex items-center">
                <span className="text-xs text-gray-300">Garçom</span>
                <span className="text-xs text-green-400 ml-2">• online</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer mr-1">
              <i className="fas fa-phone-alt"></i>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="pt-16 pb-32 px-4 overflow-y-auto">
        <div className="py-2 text-center">
          <span className="text-xs bg-gray-200 rounded-full px-3 py-1 text-gray-500">
            05 de Maio, 2025
          </span>
        </div>

        {/* System Message */}
        <div className="py-2 text-center">
          <span className="text-xs bg-gray-200 rounded-full px-3 py-1 text-gray-500">
            Você conectou com Mariana Silva
          </span>
        </div>

        {/* Message from Mariana */}
        <div className="flex mb-4 mt-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520restaurant%2520uniform%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=60&height=60&seq=1&orientation=squarish"
              alt="Mariana Silva"
              className="w-full h-full object-cover object-top"
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
            <img
              src="https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520restaurant%2520uniform%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=60&height=60&seq=1&orientation=squarish"
              alt="Mariana Silva"
              className="w-full h-full object-cover object-top"
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
            <img
              src="https://readdy.ai/api/search-image?query=Professional%2520portrait%2520of%2520a%2520female%2520waitress%2520in%2520restaurant%2520uniform%252C%2520warm%2520smile%252C%2520confident%2520posture%252C%2520well-groomed%2520appearance%252C%2520neutral%2520restaurant%2520background%252C%2520high%2520quality%2520professional%2520headshot%252C%2520soft%2520lighting%252C%2520realistic%2520photo%252C%2520subject%2520fills%252080%2520percent%2520of%2520frame&width=60&height=60&seq=1&orientation=squarish"
              alt="Mariana Silva"
              className="w-full h-full object-cover object-top"
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
              className="flex-shrink-0 bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm mr-2 whitespace-nowrap cursor-pointer !rounded-button hover:bg-gray-200"
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
            className={`p-2 rounded-full cursor-pointer !rounded-button ${message.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-10 hidden">
        <div className="grid grid-cols-5 h-16">
          <a href="https://readdy.ai/home/2306f3cf-5149-440e-ad37-bcddea6fa55c/fdcee889-a23c-4468-b01c-7af64b96c87c" data-readdy="true" className="flex flex-col items-center justify-center text-gray-500 cursor-pointer no-underline">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Início</span>
          </a>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1">Buscar</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-calendar-alt text-lg"></i>
            <span className="text-xs mt-1">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-800 cursor-pointer">
            <i className="fas fa-comment-alt text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <i className="fas fa-building text-lg"></i>
            <span className="text-xs mt-1">Perfil</span>
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

export default App;

