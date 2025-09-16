import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import type { Profile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    // Campos comuns de autenticação
    userType: z.enum(['contratante', 'prestador']),
    fullName: z.string().min(3, 'O nome completo é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    
    // Campos específicos para Prestador
    phone: z.string().optional(),
    document: z.string().optional(),
    bio: z.string().optional(),
    hourlyRate: z.coerce.number().optional(), // `coerce` converte a string para number
    experienceYears: z.coerce.number().optional(),
    specialties: z.array(z.string()).optional(),
    meiNumber: z.string().optional(),
    
    // Campos específicos para Contratante
    companyName: z.string().optional(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.userType === 'prestador' && data.document) {
        return cpfValidator.isValid(data.document.replace(/\D/g, ''));
      }
      return true;
    },
    {
      message: 'CPF inválido',
      path: ['document'],
    },
  )
  .refine(
    (data) => {
      if (data.userType === 'contratante' && data.cnpj) {
        return cnpjValidator.isValid(data.cnpj.replace(/\D/g, ''));
      }
      return true;
    },
    {
      message: 'CNPJ inválido',
      path: ['cnpj'],
    },
  );


export function Register() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const { categories } = useCategories();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'userType' | 'form'>('userType');
  const [userType, setUserType] = useState<'contratante' | 'prestador'>('contratante');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: 'contratante',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      specialties: [],
      hourlyRate: undefined,
      experienceYears: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {
        email,
        password,
        userType,
        fullName,
        phone,
        document,
        bio,
        hourlyRate,
        experienceYears,
        specialties,
        meiNumber,
        companyName,
        cnpj,
      } = values;

      const profileData: Partial<Profile> = {
        role: userType,
        full_name: fullName,
        phone,
        bio,
        specialties,
        hourly_rate: hourlyRate,
        experience_years: experienceYears,
        mei_number: meiNumber,
      };

      if (userType === 'prestador') {
        profileData.document = document;
        profileData.document_type = 'cpf';
      } else if (userType === 'contratante') {
        profileData.full_name = companyName || fullName;
        profileData.document = cnpj;
        profileData.document_type = 'cnpj';
        // Address is a string in form, but object in type. Ignoring for now.
        // if (address) profileData.address = address;
      }

      const { error } = await signUp(email, password, profileData);

      if (error) {
        setError(error.message);
      } else {
        navigate('/auth/login', {
          state: { message: 'Conta criada com sucesso! Verifique seu email para confirmar.' },
        });
      }
    } catch (err) {
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
    }
  }

  const handleUserTypeSelect = (type: 'contratante' | 'prestador') => {
    setUserType(type);
    form.setValue('userType', type);
    setStep('form');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => (step === 'form' ? setStep('userType') : navigate('/'))}
            className="self-start"
          >
            &larr; Voltar
          </Button>
          <CardTitle className="text-2xl">
            {step === 'userType' ? 'Criar Conta' : `Registro de ${userType}`}
          </CardTitle>
          <CardDescription>
            {step === 'userType'
              ? 'Escolha o tipo de conta que deseja criar.'
              : 'Preencha os campos abaixo para criar sua conta.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'userType' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-auto p-6 text-left"
                onClick={() => handleUserTypeSelect('contratante')}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">Contratante</h3>
                  <p className="text-sm text-muted-foreground">
                    Contrate os melhores profissionais para seus eventos.
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 text-left"
                onClick={() => handleUserTypeSelect('prestador')}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">Prestador de Serviço</h3>
                  <p className="text-sm text-muted-foreground">
                    Ofereça seus serviços e encontre novas oportunidades.
                  </p>
                </div>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações de Login</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Sua senha"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirme sua senha"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {userType === 'prestador' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados do Prestador</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(99) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="___.___.___-__" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input placeholder="Fale um pouco sobre você e sua experiência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor por Hora (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="50,00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experienceYears"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Anos de Experiência</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="meiNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do MEI (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu número de MEI" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidades</FormLabel>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={category.id}
                                    checked={field.value?.includes(category.name)}
                                    onCheckedChange={(checked: boolean) => {
                                      const currentValue = field.value || [];
                                      if (checked) {
                                        field.onChange([...currentValue, category.name]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter(
                                            (value) => value !== category.name
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={category.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {category.name}
                                  </label>
                                </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {userType === 'contratante' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados do Contratante</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(99) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input placeholder="__.___.___/____-__" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço da empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}