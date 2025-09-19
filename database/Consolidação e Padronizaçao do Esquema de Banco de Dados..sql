-- schema.sql
-- Este arquivo define a estrutura completa e final do banco de dados para o App Garçom.
-- Rode este script em um banco de dados limpo para criar todo o esquema do zero.

-- Tabela 'profiles': A fonte central da identidade do usuário
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
    role character varying,
    full_name character varying
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated user full access to their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Tabela 'contratantes': Perfil de dados dos contratantes
CREATE TABLE IF NOT EXISTS public.contratantes (
    id uuid NOT NULL PRIMARY KEY REFERENCES public.profiles(id),
    nome_fantasia character varying,
    cnpj character varying,
    endereco text,
    phone character varying,
    email character varying,
    document character varying,
    document_type character varying,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);
ALTER TABLE public.contratantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated user full access to their own contratante data"
ON public.contratantes
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Tabela 'professionals': Perfil de dados dos profissionais
CREATE TABLE IF NOT EXISTS public.professionals (
    id uuid NOT NULL PRIMARY KEY REFERENCES public.profiles(id),
    nome_completo character varying,
    telefone character varying,
    bio text,
    categoria uuid REFERENCES public.categorias(id),
    especialidades text[],
    anos_experiencia integer,
    formacao text[],
    disponibilidade_semanal jsonb,
    valor_hora numeric,
    dados_mei jsonb,
    dados_financeiros jsonb,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated user full access to their own professional data"
ON public.professionals
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Tabela 'categorias'
CREATE TABLE IF NOT EXISTS public.categorias (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    nome character varying NOT NULL,
    icone character varying NOT NULL,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);

-- Tabela 'regioes'
CREATE TABLE IF NOT EXISTS public.regioes (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    nome character varying NOT NULL,
    descricao text,
    imagem_url text,
    ativo boolean DEFAULT true,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);

-- Tabela 'experiences'
CREATE TABLE IF NOT EXISTS public.experiences (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_experiencia character varying NOT NULL,
    descricao_experiencia text,
    preco numeric,
    duracao integer,
    regiao_id uuid REFERENCES public.regioes(id),
    categoria_id uuid REFERENCES public.categorias(id),
    imagem_url text,
    rating numeric DEFAULT 0,
    total_avaliacoes integer DEFAULT 0,
    ativo boolean DEFAULT true,
    featured boolean DEFAULT false,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);

-- Tabela 'agendamentos'
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    id_contratante uuid REFERENCES public.contratantes(id),
    id_profissional uuid REFERENCES public.professionals(id),
    data_servico date NOT NULL,
    horario_servico time without time zone NOT NULL,
    status_agendamento character varying DEFAULT 'pending',
    observacoes text,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now()
);

-- Tabela 'servicos_realizados'
CREATE TABLE IF NOT EXISTS public.servicos_realizados (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    id_profissional uuid REFERENCES public.professionals(id),
    id_contratante uuid REFERENCES public.contratantes(id),
    data_servico date,
    tipo_servico character varying,
    valor numeric,
    status character