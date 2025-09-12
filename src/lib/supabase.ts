import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// PASSO 1: Verifique se as variáveis de ambiente estão sendo lidas
console.log('URL do Supabase:', supabaseUrl)
console.log('Chave Anon:', supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// PASSO 2: Faça uma pequena requisição de teste para o banco de dados
const testConnection = async () => {
  console.log('Testando a conexão com o Supabase...')
  try {
    const { data, error } = await supabase.from('professionals').select('name').limit(1)

    if (error) {
      console.error('ERRO NO TESTE DE CONEXÃO:', error.message)
    } else {
      console.log('SUCESSO NO TESTE DE CONEXÃO. Dados recebidos:', data)
    }
  } catch (err) {
    console.error('ERRO CRÍTICO NO TESTE DE CONEXÃO:', err)
  }
}

// Chame a função de teste
testConnection()