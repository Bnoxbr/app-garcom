import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuctions } from '@/hooks/useAuctions';
import { useCategories } from '@/hooks/useCategories';
import { useAuthContext } from '@/hooks/useAuth';

const CreateAuction: React.FC = () => {
    const { createAuction, loading } = useAuctions();
    const { categories, loading: loadingCategories, error: errorCategories } = useCategories();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [endDate, setEndDate] = useState("");
    const [basePrice, setBasePrice] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title || !description || !categoryId || !endDate || !basePrice) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const newAuction = await createAuction({
                title,
                description,
                category_id: String(categoryId),
                end_date: endDate,
                base_price: basePrice as number,
            });
            console.log("Leilão criado:", newAuction);
            navigate(`/auctions`);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao criar o leilão. Tente novamente.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Cabeçalho */}
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200">
                        <i className="fas fa-arrow-left text-gray-600"></i>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Criar Novo Leilão</h1>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Título do Leilão */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título do Serviço</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Garçom para evento de 100 pessoas"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Descreva o que você precisa, incluindo data, local, número de convidados, etc."
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>

                    {/* Categoria e Data de Encerramento (em linha) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                                id="category"
                                value={category || ''}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                                disabled={loadingCategories}
                            >
                                <option value="" disabled>
                                    {loadingCategories ? 'Carregando...' : 'Selecione uma categoria'}
                                </option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errorCategories && <p className="text-red-500 text-sm mt-1">{errorCategories}</p>}
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Data Limite para Lances</label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Preço Base */}
                    <div>
                        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo (R$)</label>
                        <input
                            type="number"
                            id="basePrice"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="Ex: 150,00"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Botão de Envio */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        >
                            {loading ? 'Publicando Leilão...' : 'Publicar Leilão'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAuction;