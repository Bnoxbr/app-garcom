import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Ajuste o caminho se necessário
import { useAuthContext } from '../hooks/useAuth'; // Ajuste o caminho se necessário
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Props {
  professional: any;
  onClose: () => void;
}

export const OfertaDetalhadaForm: React.FC<Props> = ({ professional, onClose }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    horaInicio: '',
    horaFim: '',
    traje: '',
    contatoLocal: '',
    observacoes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Botão 'Enviar Oferta' clicado. Iniciando handleSubmit...");

    if (!user) {
      console.error("ERRO: Usuário não autenticado.");
      toast.error("Você precisa estar logado para contratar.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Enviando sua oferta...');
    
    try {
        console.log("2. Verificações passaram. Montando os dados da oferta...");
        
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        const checklistData = {
          status: 'pendente',
          detalhes_contratante: {
            traje: formData.traje,
            contato_no_local: formData.contatoLocal,
            observacoes: formData.observacoes,
          },
          confirmacoes_prestador: {},
        };

        console.log("3. Objeto da oferta pronto para ser enviado:", checklistData);

        const { data, error } = await supabase
          .from('bookings')
          .insert([
            {
              client_id: user.id,
              provider_id: professional.id,
              status: 'pending',
              expira_em: expirationTime,
              status_visualizacao_prestador: 'ENVIADA',
              checklist_alinhamento: checklistData,
              service_date: formData.data,
              hora_inicio: formData.horaInicio,
              hora_fim: formData.horaFim,
            },
          ])
          .select()
          .single();

        console.log("4. Resposta do Supabase recebida.");

        if (error) {
          throw error;
        }

        console.log("5. Sucesso! Dados retornados:", data);
        toast.success('Oferta enviada com sucesso!', { id: toastId });
        navigate(`/aguardando-aceite/${data.id}`);

    } catch (error) {
        console.error("🔥 ERRO CRÍTICO no handleSubmit:", error);
        toast.error(`Falha ao enviar a oferta: ${(error as any).message || 'Erro desconhecido'}`, { id: toastId });
    } finally {
        console.log("6. Finalizando handleSubmit.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detalhes da Oferta para {professional.nome_completo}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
              <input type="date" name="data" value={formData.data} onChange={handleInputChange} required className="input-style" />
              <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} required className="input-style" />
              <input type="time" name="horaFim" value={formData.horaFim} onChange={handleInputChange} required className="input-style" />
            </div>
          </div>

          <div>
            <label htmlFor="traje" className="block text-sm font-medium text-gray-700">Traje Requerido</label>
            <input type="text" id="traje" name="traje" value={formData.traje} onChange={handleInputChange} required className="mt-1 input-style w-full" placeholder="Ex: Social completo, terno preto" />
          </div>

          <div>
            <label htmlFor="contatoLocal" className="block text-sm font-medium text-gray-700">Pessoa de Contato no Local</label>
            <input type="text" id="contatoLocal" name="contatoLocal" value={formData.contatoLocal} onChange={handleInputChange} required className="mt-1 input-style w-full" placeholder="Ex: Falar com Joana, gerente" />
          </div>

          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações Essenciais</label>
            <textarea id="observacoes" name="observacoes" rows={3} value={formData.observacoes} onChange={handleInputChange} className="mt-1 input-style w-full" placeholder="Ex: Entrada de serviço pelos fundos"></textarea>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400">
              {isSubmitting ? 'Enviando...' : 'Enviar Oferta'}
            </button>
          </div>
        </form>
      </div>
      <style>{`.input-style { display: block; width: 100%; border-radius: 0.5rem; border: 1px solid #D1D5DB; padding: 0.5rem 0.75rem; }`}</style>
    </div>
  );
};