-- Migração para adicionar campos de CPF/CNPJ, dados da empresa e área financeira à tabela 'profiles'

-- Verificar se a tabela profiles existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Adicionar campos para CPF/CNPJ e dados da empresa (se ainda não existirem)
        BEGIN
            -- Verificar se o campo document já existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'document') THEN
                ALTER TABLE profiles ADD COLUMN document VARCHAR(20);
            END IF;

            -- Verificar se o campo document_type já existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'document_type') THEN
                ALTER TABLE profiles ADD COLUMN document_type VARCHAR(10) CHECK (document_type IN ('cpf', 'cnpj'));
            END IF;

            -- Adicionar campos para dados da empresa
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_name') THEN
                ALTER TABLE profiles ADD COLUMN company_name VARCHAR(200);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_address') THEN
                ALTER TABLE profiles ADD COLUMN company_address JSONB;
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_phone') THEN
                ALTER TABLE profiles ADD COLUMN company_phone VARCHAR(20);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_email') THEN
                ALTER TABLE profiles ADD COLUMN company_email VARCHAR(255);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_website') THEN
                ALTER TABLE profiles ADD COLUMN company_website VARCHAR(255);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_representative_name') THEN
                ALTER TABLE profiles ADD COLUMN company_representative_name VARCHAR(200);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_representative_position') THEN
                ALTER TABLE profiles ADD COLUMN company_representative_position VARCHAR(100);
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'company_representative_document') THEN
                ALTER TABLE profiles ADD COLUMN company_representative_document VARCHAR(20);
            END IF;

            -- Adicionar campos para dados financeiros
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'payment_methods') THEN
                ALTER TABLE profiles ADD COLUMN payment_methods JSONB DEFAULT '[]'::jsonb;
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'saved_credit_cards') THEN
                ALTER TABLE profiles ADD COLUMN saved_credit_cards JSONB DEFAULT '[]'::jsonb;
            END IF;

            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_schema = 'public' 
                          AND table_name = 'profiles' 
                          AND column_name = 'bitcoin_wallet') THEN
                ALTER TABLE profiles ADD COLUMN bitcoin_wallet VARCHAR(100);
            END IF;

            RAISE NOTICE 'Campos adicionados com sucesso à tabela profiles';
        EXCEPTION
            WHEN duplicate_column THEN
                RAISE NOTICE 'Alguns campos já existem na tabela profiles';
        END;
    ELSE
        RAISE EXCEPTION 'A tabela profiles não existe no banco de dados';
    END IF;
END
$$;

-- Comentários para documentação
COMMENT ON COLUMN profiles.document IS 'CPF ou CNPJ do usuário';
COMMENT ON COLUMN profiles.document_type IS 'Tipo de documento: cpf ou cnpj';
COMMENT ON COLUMN profiles.company_name IS 'Nome da empresa (quando document_type = cnpj)';
COMMENT ON COLUMN profiles.company_address IS 'Endereço da empresa em formato JSON';
COMMENT ON COLUMN profiles.company_phone IS 'Telefone da empresa';
COMMENT ON COLUMN profiles.company_email IS 'Email da empresa';
COMMENT ON COLUMN profiles.company_website IS 'Site da empresa';
COMMENT ON COLUMN profiles.company_representative_name IS 'Nome do representante da empresa';
COMMENT ON COLUMN profiles.company_representative_position IS 'Cargo do representante da empresa';
COMMENT ON COLUMN profiles.company_representative_document IS 'CPF do representante da empresa';
COMMENT ON COLUMN profiles.payment_methods IS 'Métodos de pagamento preferidos em formato JSON';
COMMENT ON COLUMN profiles.saved_credit_cards IS 'Cartões de crédito salvos em formato JSON (apenas tokens, sem dados sensíveis)';
COMMENT ON COLUMN profiles.bitcoin_wallet IS 'Endereço da carteira Bitcoin';

SELECT 'Migração concluída com sucesso!' as status;