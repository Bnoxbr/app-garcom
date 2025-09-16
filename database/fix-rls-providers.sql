-- Adiciona a política de RLS para permitir a leitura pública de perfis de prestadores
CREATE POLICY "Permitir leitura pública de perfis de prestadores"
ON public.profiles
FOR SELECT
USING (role = 'prestador');