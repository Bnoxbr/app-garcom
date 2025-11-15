import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
// Mantendo seus imports originais
import { useAuth, type UserProfile } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import React from 'react';

const formSchema = z
  .object({
    // --- Etapa 1: Login ---
    fullName: z.string().min(3, 'O nome completo é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    
    // --- Etapa 2: Dados Pessoais e Endereço (Agora Obrigatórios) ---
    phone: z.string().min(10, 'Telefone é obrigatório'),
    document: z.string().min(11, 'CPF ou CNPJ é obrigatório'),
    
    cep: z.string().min(8, 'CEP obrigatório'),
    city: z.string().min(2, 'Cidade obrigatória'),
    state: z.string().length(2, 'UF inválida (2 letras)'),
    address: z.string().min(5, 'Endereço é obrigatório'),
    
    // Apenas Nome da Empresa é opcional (mas validado se for CNPJ)
    companyName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    const doc = data.document?.replace(/\D/g, ''); 
    const isCnpj = doc && doc.length > 11; 

    // Se for CNPJ, o Nome da Empresa deixa de ser opcional e vira obrigatório
    if (isCnpj) {
      if (!data.companyName || data.companyName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome da Empresa é obrigatório para CNPJ.",
          path: ['companyName'],
        });
      }
    }
  });

// Campos da etapa 1 para validação parcial
const step1Fields = ['fullName', 'email', 'password', 'confirmPassword'] as const;

export function Register() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Controle de etapas
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      document: '',
      cep: '',
      city: '',
      state: '',
      address: '',
      companyName: '',
    },
    mode: 'onBlur',
  });

  // Monitora o documento para validação visual
  const documentValue = form.watch('document');
  const isCnpj = documentValue && documentValue.replace(/\D/g, '').length > 11;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      // Concatena o endereço completo para salvar no banco
      const fullAddress = `${values.address} - ${values.city}/${values.state}, CEP: ${values.cep}`;

      const profileData: Partial<UserProfile> = {
        full_name: values.fullName,
        nome_fantasia: values.companyName || values.fullName,
        telefone: values.phone,
        document: values.document,
        document_type: values.document.replace(/\D/g, '').length > 11 ? 'cnpj' : 'cpf',
        endereco: fullAddress, // Envia o endereço completo formatado
        role: 'contratante',
      };

      const { error: signUpError } = await signUp(values.email, values.password, profileData);

      if (signUpError) {
        setError(signUpError.message);
      } else {
        navigate('/auth/login', {
          state: { message: 'Conta criada com sucesso! Verifique seu email para confirmar.' },
        });
      }
    } catch (err: any) {
      console.error('Erro no onSubmit:', err);
      setError(err.message || 'Ocorreu um erro ao criar a conta. Tente novamente.');
    }
  }

  const goToNextStep = async () => {
    setError(null);
    const isValid = await form.trigger(step1Fields);
    if (isValid) {
      setStep(2);
    } else {
      setError("Preencha os campos obrigatórios corretamente.");
    }
  };

  const goToPrevStep = () => {
    setError(null);
    setStep(1);
  };

  const renderProgressBar = () => (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          {step > 1 ? '✓' : '1'}
        </div>
        <div className={`flex-1 h-1 transition-colors ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          2
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-sm font-medium text-gray-700">
          {step === 1 ? 'Informações de Login' : 'Dados e Endereço'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="self-start"
            disabled={loading}
          >
            &larr; Voltar
          </Button>
          <CardTitle className="text-2xl">Criar Conta de Contratante</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            
            {renderProgressBar()}

            <CardContent className="py-6 space-y-6">
              
              {/* --- ETAPA 1: LOGIN --- */}
              <div className={`space-y-4 ${step === 1 ? 'block' : 'hidden'}`}>
                <h3 className="text-lg font-medium">Informações de Login</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} placeholder="Sua senha" {...field} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                         <div className="relative">
                          <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirme sua senha" {...field} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
              </div>

              {/* --- ETAPA 2: DADOS OBRIGATÓRIOS --- */}
              <div className={`space-y-4 ${step === 2 ? 'block' : 'hidden'}`}>
                <h3 className="text-lg font-medium">Dados Cadastrais</h3>
                
                {/* Documento e Telefone */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="document" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF ou CNPJ</FormLabel>
                      <FormControl><Input placeholder="Digite apenas números" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl><Input placeholder="(99) 99999-9999" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>

                {/* CEP, Cidade e Estado */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4">
                    <FormField control={form.control} name="cep" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl><Input placeholder="00000-000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                  <div className="col-span-8 md:col-span-6">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl><Input placeholder="Nome da cidade" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                     <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF</FormLabel>
                        <FormControl><Input placeholder="SP" maxLength={2} {...field} className="uppercase" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </div>

                {/* Endereço */}
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl><Input placeholder="Rua, Número, Bairro" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                
                {/* Nome da Empresa (Opcional, mas obrigatório se CNPJ) */}
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome da Empresa 
                      {isCnpj ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-500 ml-1 font-normal">(Opcional)</span>}
                    </FormLabel>
                    <FormControl><Input placeholder="Nome Fantasia ou Razão Social" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            </CardContent>
            
            <CardFooter className="flex-col items-start gap-4 pt-6 border-t">
              <div className="flex w-full justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPrevStep} 
                  disabled={step === 1 || loading}
                >
                  Voltar (Etapa)
                </Button>
                
                {step === 1 && (
                  <Button type="button" onClick={goToNextStep} disabled={loading}>
                    Continuar
                  </Button>
                )}

                {step === 2 && (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {'Já tem uma conta? '}
                <Link to="/auth/login" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}