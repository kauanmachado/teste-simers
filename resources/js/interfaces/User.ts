/**
 * Interface TypeScript para usuário
 * 
 * Propriedades:
 * - id: Identificador único
 * - name: Nome completo
 * - email: Email do usuário
 * - cpf: CPF (apenas números)
 * - phone: Telefone (apenas números)
 * - birth_date: Data de nascimento
 * - created_at: Data de criação
 * - updated_at: Data de atualização
 * 
 * Usada em:
 * - Formulários
 * - Tabelas
 * - Requisições API
 */

export interface User {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birth_date: string;
    created_at: string;
}

export interface UserFormData {
    id?: number;
    name: string;
    email: string;
    password: string;
    cpf: string;
    phone: string;
    birth_date: string;
}

export interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
} 