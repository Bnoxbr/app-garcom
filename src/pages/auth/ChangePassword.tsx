import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Lock } from 'lucide-react'; // Usando ícones profissionais

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuthContext();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (password !== confirmPassword) {
      return toast.error("As senhas não coincidem.");
    }
    if (password.length < 6) {
      return toast.error("A senha deve ter no mínimo 6 caracteres.");
    }

    try {
        setLoading(true);
        console.log("Iniciando alteração de senha...");

        // Chama a função do useAuth
        const { error } = await updatePassword(password);
        
        if (error) {
            console.error("Erro ao alterar senha:", error);
            toast.error(`Erro: ${error.message}`);
        } else {
            console.log("Senha alterada com sucesso!");
            toast.success("Senha alterada com sucesso!");
            // Limpa os campos
            setPassword('');
            setConfirmPassword('');
            // Volta para o perfil após um breve delay
            setTimeout(() => navigate('/profile'), 1000);
        }
    } catch (err: any) {
        console.error("Erro inesperado:", err);
        toast.error("Ocorreu um erro inesperado.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Alterar Senha</h2>
          <p className="text-sm text-gray-500 mt-2">Crie uma nova senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <div className="relative">
                <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••"
                />
                <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Salvando...</span>
                  </>
              ) : (
                  'Alterar Senha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;