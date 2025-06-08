import { useForm } from 'react-hook-form';
import { UserFormData } from '@/interfaces/User';
import axios from 'axios';
import { useState } from 'react';

/**
 * Formulário para criação de novos usuários
 * 
 * Funcionalidades:
 * - Validação de campos com react-hook-form
 * - Formatação de CPF e telefone
 * - Feedback visual com alertas
 * - Campos: nome, email, senha, CPF, telefone, data de nascimento
 * 
 * Props:
 * - onSuccess: Callback após criar usuário
 * - onError: Callback em caso de erro
 */

// Interface que define as props do componente CreateUserForm
interface CreateUserFormProps {
    onSuccess?: () => void;     // Callback chamado após criar usuário com sucesso
    onError?: (error: string) => void;  // Callback chamado em caso de erro
}

export default function CreateUserForm({ onSuccess, onError }: CreateUserFormProps) {
    // Estado para controlar o alerta de feedback
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
    
    // Configuração do formulário com react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            cpf: '',
            phone: '',
            birth_date: ''
        }
    });

    // Função para formatar os dados antes de enviar ao backend
    const formatData = (data: UserFormData): UserFormData => {
        // Remove caracteres não numéricos do CPF e telefone
        const cpf = data.cpf.replace(/\D/g, '');
        const phone = data.phone.replace(/\D/g, '');
        
        // Garante que a data está no formato YYYY-MM-DD
        const birthDate = data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '';

        return {
            ...data,
            cpf,
            phone,
            birth_date: birthDate
        };
    };

    // Função para criar um novo usuário
    const handleCreateUser = async (userData: UserFormData) => {
        try {
            const formattedData = formatData(userData);
            await axios.post('/api/users', formattedData);
            onSuccess?.();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                const validationErrors = err.response.data.message as Record<string, string[]>;
                const errorMessage = Object.values(validationErrors)[0][0];
                setAlert({
                    message: errorMessage,
                    type: 'danger'
                });
                onError?.(errorMessage);
            } else {
                const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
                setAlert({
                    message: errorMessage,
                    type: 'danger'
                });
                onError?.(errorMessage);
            }
        }
    };

    return (
        <>
            {/* Alerta de feedback */}
            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="alert" 
                        aria-label="Close"
                        onClick={() => setAlert(null)}
                    ></button>
                </div>
            )}

            {/* Formulário de criação de usuário */}
            <form onSubmit={handleSubmit(handleCreateUser)} className="needs-validation">
                {/* Campo Nome */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome</label>
                    <input
                        {...register('name', { required: 'Nome é obrigatório' })}
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        placeholder="Digite o nome completo"
                    />
                    {errors.name && (
                        <div className="invalid-feedback">
                            {errors.name.message}
                        </div>
                    )}
                </div>

                {/* Campo Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email é obrigatório',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                            }
                        })}
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="Digite o email"
                    />
                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email.message}
                        </div>
                    )}
                </div>

                {/* Campo Senha */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                        {...register('password', {
                            required: 'Senha é obrigatória',
                            minLength: {
                                value: 6,
                                message: 'A senha deve ter no mínimo 6 caracteres'
                            }
                        })}
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Digite a senha"
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                {/* Campo CPF */}
                <div className="mb-3">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input
                        {...register('cpf', {
                            required: 'CPF é obrigatório',
                            minLength: {
                                value: 11,
                                message: 'CPF deve ter 11 dígitos'
                            },
                            maxLength: {
                                value: 11,
                                message: 'CPF deve ter 11 dígitos'
                            },
                            pattern: {
                                value: /^\d+$/,
                                message: 'Digite apenas números'
                            }
                        })}
                        type="text"
                        className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                        id="cpf"
                        placeholder="Digite o CPF (apenas números)"
                    />
                    {errors.cpf && (
                        <div className="invalid-feedback">
                            {errors.cpf.message}
                        </div>
                    )}
                </div>

                {/* Campo Telefone */}
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Telefone</label>
                    <input
                        {...register('phone', {
                            required: 'Telefone é obrigatório',
                            minLength: {
                                value: 10,
                                message: 'Telefone deve ter no mínimo 10 dígitos'
                            },
                            maxLength: {
                                value: 11,
                                message: 'Telefone deve ter no máximo 11 dígitos'
                            },
                            pattern: {
                                value: /^\d+$/,
                                message: 'Digite apenas números'
                            }
                        })}
                        type="text"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        placeholder="Digite o telefone (apenas números)"
                    />
                    {errors.phone && (
                        <div className="invalid-feedback">
                            {errors.phone.message}
                        </div>
                    )}
                </div>

                {/* Campo Data de Nascimento */}
                <div className="mb-3">
                    <label htmlFor="birth_date" className="form-label">Data de Nascimento</label>
                    <input
                        {...register('birth_date', { required: 'Data de nascimento é obrigatória' })}
                        type="date"
                        className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`}
                        id="birth_date"
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.birth_date && (
                        <div className="invalid-feedback">
                            {errors.birth_date.message}
                        </div>
                    )}
                </div>

                {/* Botão de Submit */}
                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Criar Usuário
                    </button>
                </div>
            </form>
        </>
    );
} 