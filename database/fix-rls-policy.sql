-- ARQUIVO DE DEPURAÇÃO TEMPORÁRIO
-- Este arquivo remove todas as políticas de SELECT e adiciona uma regra permissiva para teste.

-- 1. Remove todas as políticas de SELECT existentes para evitar conflitos.
DROP POLICY IF EXISTS "Public can view provider profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;

-- 2. Adiciona uma política de SELECT totalmente permissiva para fins de depuração.
-- ISTO É INSEGURO E DEVE SER REMOVIDO DEPOIS.
CREATE POLICY "TEMP_DEBUG_ALLOW_ALL_SELECT" ON public.profiles
  FOR SELECT USING (true);