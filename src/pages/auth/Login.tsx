import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { Loading } from '../../components';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading, user, profile, error: authError } = useAuthContext(); 
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [BLINDAGEM TOTAL] Trava física para impedir loops do navegador/Google
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Se já redirecionamos uma vez, pare. Não importa o que o navegador faça.
    if (hasRedirected.current) return;

    if (!loading && user) {
      if (profile) {
         console.log("Login: Perfil confirmado. Redirecionando...");
         hasRedirected.current = true; // Trava ativada
         navigate('/profile', { replace: true });
      } else {
         console.warn("Login: Aguardando perfil...");
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(formData.email, formData.password);
    } catch (err) {
      console.error(err);
      toast.error('Erro: E-mail ou senha incorretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="A verificar autenticação..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button onClick={() => navigate('/')} className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
            <span className="mr-2">←</span> Voltar ao início
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Entrar na sua conta</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">📧</span>
                <input id="email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 outline-none" placeholder="seu@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔒</span>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 outline-none" placeholder="Sua palavra-passe" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {(!authError && user && !profile) && (
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  Autenticado. A carregar dados do perfil...
              </div>
            )}

            {authError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{authError}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none disabled:opacity-50">
              {isSubmitting ? 'A entrar...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center space-y-4">
            <Link to="/auth/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">Esqueceu a palavra-passe?</Link>
            <div className="text-sm text-gray-600">Não tem conta? <Link to="/auth/register" className="font-medium text-gray-800 hover:text-gray-900">Cadastre-se</Link></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;