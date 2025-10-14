// Local: src/pages/PoliticadeAvaliacao.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const PoliticadeAvaliacao: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md z-30">
                 <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
                     <div className="flex items-center">
                         <button onClick={() => navigate(-1)} className="flex items-center cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700">
                             <i className="fas fa-arrow-left text-lg"></i>
                         </button>
                         <h1 className="text-lg font-medium ml-3">Política de Avaliações</h1>
                     </div>
                 </div>
            </div>
            
            <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-gray-700">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Nossa Política de Avaliações: Confiança e Transparência</h1>
                <p className="mb-6">No Mr. Staffer, acreditamos que um sistema de avaliações justo é a base para uma comunidade segura e confiável. Nossas políticas foram criadas para garantir que todas as avaliações sejam autênticas, relevantes e construtivas.</p>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Quem pode fazer uma avaliação?</h2>
                        <p>Apenas contratantes e profissionais que concluíram um serviço através da nossa plataforma podem se avaliar mutuamente. A opção de avaliar é liberada 24 horas após o check-out do profissional, garantindo que a experiência completa seja considerada.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">2. O que compõe a avaliação?</h2>
                        <p>A avaliação de um profissional é baseada em quatro critérios objetivos, com notas de 1 a 5 estrelas: Pontualidade, Atendimento, Apresentação e Proatividade. A nota exibida no perfil é a média de todas as avaliações recebidas. O comentário é um espaço para detalhar a experiência.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">3. O que não é permitido em um comentário?</h2>
                        <p>Buscamos manter um ambiente respeitoso. Comentários que contenham discurso de ódio, palavrões, dados pessoais (telefones, e-mails), spam, publicidade ou que não sejam relacionados ao serviço prestado serão removidos.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">4. O Profissional pode responder?</h2>
                        <p>Sim. Encorajamos os profissionais a responderem às avaliações. Essa resposta será pública e aparecerá logo abaixo do comentário original, promovendo um diálogo transparente e permitindo que o profissional agradeça um elogio ou esclareça um mal-entendido.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Como denunciar uma avaliação?</h2>
                        <p>Se você acredita que uma avaliação viola nossas políticas, por favor, use a opção "Sinalizar" ao lado do comentário. Nossa equipe analisará o caso o mais breve possível.</p>
                    </div>
                </div>
                <p className="mt-8 text-center text-gray-500">Agradecemos por nos ajudar a construir uma plataforma mais segura e confiável para todos!</p>
            </div>
        </div>
    );
};

export default PoliticadeAvaliacao;
