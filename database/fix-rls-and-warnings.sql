-- Habilita RLS para a tabela contratantes
ALTER TABLE public.contratantes ENABLE ROW LEVEL SECURITY;

-- Permite acesso de leitura público para a tabela contratantes
CREATE POLICY "Public read access for contratantes" ON public.contratantes FOR SELECT USING (true);

-- Habilita RLS para a tabela servicos_realizados
ALTER TABLE public.servicos_realizados ENABLE ROW LEVEL SECURITY;

-- Permite acesso de leitura público para a tabela servicos_realizados
CREATE POLICY "Public read access for servicos_realizados" ON public.servicos_realizados FOR SELECT USING (true);

-- Habilita RLS para a tabela avaliacoes
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Permite acesso de leitura público para a tabela avaliacoes
CREATE POLICY "Public read access for avaliacoes" ON public.avaliacoes FOR SELECT USING (true);