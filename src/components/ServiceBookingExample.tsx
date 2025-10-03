import React, { useState } from 'react'
import { Calendar, Star, MapPin, Clock, DollarSign } from 'lucide-react'
import ServiceBookingModal from './ServiceBookingModal'
import type { Profissional, Booking } from '../types'

const ServiceBookingExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])

  // Exemplo de profissional
  const exampleProfessional: Profissional = {
    id: '1',
    nome_completo: 'João Silva',
    categoria: 'Eletricista',
    valor_hora: 75,
    avatar_url: '/default-avatar.png',
    descricao: 'Eletricista com 10 anos de experiência em instalações residenciais e comerciais.',
    avaliacao_media: 4.8,
    total_avaliacoes: 127,
    disponibilidade: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    regiao: 'São Paulo - SP',
    telefone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const handleBookingSuccess = (booking: Booking) => {
    setBookings(prev => [...prev, booking])
    setIsModalOpen(false)
    
    // Aqui você pode adicionar notificações, redirecionamentos, etc.
    alert('Reserva realizada com sucesso!')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sistema de Reserva de Serviços</h1>
        
        {/* Card do Profissional */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <img 
                src={exampleProfessional.avatar_url || '/default-avatar.png'} 
                alt={exampleProfessional.nome_completo}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {exampleProfessional.nome_completo}
                    </h2>
                    <p className="text-gray-600">{exampleProfessional.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(exampleProfessional.valor_hora || 0)}
                    </p>
                    <p className="text-sm text-gray-500">por hora</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{exampleProfessional.avaliacao_media}</span>
                    <span>({exampleProfessional.total_avaliacoes} avaliações)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exampleProfessional.regiao}</span>
                  </div>
                </div>
                
                <p className="mt-3 text-gray-700">{exampleProfessional.descricao}</p>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Disponível: {exampleProfessional.disponibilidade?.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Reservar Serviço</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Reservas</h3>
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Serviço com {exampleProfessional.nome_completo}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.service_date).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(booking.service_date).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.job_description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(booking.price)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status === 'pending' ? 'Pendente' : 
                         booking.status === 'confirmed' ? 'Confirmado' : 
                         booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Escolha o Profissional</p>
                <p className="text-blue-700">Selecione o profissional ideal para seu serviço</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900">Faça a Reserva</p>
                <p className="text-blue-700">Pague 30% de entrada para garantir o serviço</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-blue-900">Serviço Realizado</p>
                <p className="text-blue-700">Pague o restante após a conclusão</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professional={exampleProfessional}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}

export default ServiceBookingExample