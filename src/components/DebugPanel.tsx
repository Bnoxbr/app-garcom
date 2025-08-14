import React, { useEffect, useState } from 'react';
import { useProfessionals } from '../hooks/useProfessionals';
import { useCategories } from '../hooks/useCategories';
import { supabase } from '../lib/supabase';

interface DebugPanelProps {
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const { professionals, loading: profLoading, error: profError } = useProfessionals();
  const { categories, loading: catLoading, error: catError } = useCategories();
  const [directData, setDirectData] = useState<any>(null);
  const [directError, setDirectError] = useState<string | null>(null);

  useEffect(() => {
    // Teste direto do Supabase
    const testDirect = async () => {
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('*')
          .limit(3);
        
        if (error) {
          setDirectError(error.message);
        } else {
          setDirectData(data);
        }
      } catch (err) {
        setDirectError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    testDirect();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🔍 Debug Panel</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Hook useProfessionals */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">📊 Hook useProfessionals</h3>
            <div className="text-sm space-y-1">
              <p><strong>Loading:</strong> {profLoading ? '✅ Sim' : '❌ Não'}</p>
              <p><strong>Error:</strong> {profError ? `❌ ${profError}` : '✅ Nenhum'}</p>
              <p><strong>Data Count:</strong> {professionals?.length || 0}</p>
              {professionals && professionals.length > 0 && (
                <div>
                  <p><strong>Primeiro item:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(professionals[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Hook useCategories */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">📊 Hook useCategories</h3>
            <div className="text-sm space-y-1">
              <p><strong>Loading:</strong> {catLoading ? '✅ Sim' : '❌ Não'}</p>
              <p><strong>Error:</strong> {catError ? `❌ ${catError}` : '✅ Nenhum'}</p>
              <p><strong>Data Count:</strong> {categories?.length || 0}</p>
              {categories && categories.length > 0 && (
                <div>
                  <p><strong>Primeiro item:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(categories[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Teste direto */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">🔗 Teste Direto Supabase</h3>
            <div className="text-sm space-y-1">
              <p><strong>Error:</strong> {directError ? `❌ ${directError}` : '✅ Nenhum'}</p>
              <p><strong>Data Count:</strong> {directData?.length || 0}</p>
              {directData && directData.length > 0 && (
                <div>
                  <p><strong>Primeiro item:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(directData[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Variáveis de ambiente */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">🔧 Variáveis de Ambiente</h3>
            <div className="text-sm space-y-1">
              <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Definida' : '❌ Não definida'}</p>
              <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Definida' : '❌ Não definida'}</p>
              {import.meta.env.VITE_SUPABASE_URL && (
                <p><strong>URL:</strong> <code className="bg-gray-100 px-1 rounded">{import.meta.env.VITE_SUPABASE_URL}</code></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};