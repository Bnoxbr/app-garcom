import React from 'react';
import { useAuthContext } from '@/hooks/useAuth'; // Corrigido para usar alias absoluto

const DebugAuth: React.FC = () => {
  const { user, profile, loading, error, signIn, signOut } = useAuthContext();

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>🕵️ TESTE DE FOGO: DIAGNÓSTICO DE AUTH</h1>
      <hr />
      
      {/* ESTADO ATUAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>ESTADO CRÍTICO</h3>
          <p><strong>Loading:</strong> {loading ? '🔴 TRUE (Carregando...)' : '🟢 FALSE (Pronto)'}</p>
          <p><strong>Error:</strong> {error || 'Nenhum'}</p>
          <p><strong>Sessão Ativa:</strong> {user ? '✅ SIM' : '❌ NÃO'}</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>DADOS DO USUÁRIO (Auth)</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>DADOS DO PERFIL (DB)</h3>
          <pre>{profile ? JSON.stringify(profile, null, 2) : '⚠️ PERFIL É NULL'}</pre>
        </div>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* AÇÕES MANUAIS */}
      <h3>AÇÕES DE TESTE (Sem Redirecionamento Automático)</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => signOut()}
          style={{ padding: '15px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          FORÇAR LOGOUT
        </button>

        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          DAR F5 (RELOAD)
        </button>
      </div>

      {/* LOGIN MANUAL PARA TESTE */}
      {!user && (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px dashed #ccc' }}>
            <h4>Teste de Login Direto</h4>
            <form onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                const pass = (e.target as any).pass.value;
                signIn(email, pass);
            }}>
                <input name="email" placeholder="Email" style={{ padding: '10px', marginRight: '10px' }} />
                <input name="pass" type="password" placeholder="Senha" style={{ padding: '10px', marginRight: '10px' }} />
                <button type="submit" style={{ padding: '10px 20px' }}>Logar</button>
            </form>
        </div>
      )}
    </div>
  );
};

export default DebugAuth;