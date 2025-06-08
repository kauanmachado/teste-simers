import axios from 'axios';
import { User, UserFormData, PaginationData } from '@/interfaces/User';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: PaginationData;
}

class UserService {
    private baseUrl = '/api/users';

    async getUsers(page: number = 1): Promise<{ users: User[], pagination: PaginationData }> {
        try {
            const response = await axios.get<ApiResponse<User[]>>(`${this.baseUrl}?page=${page}`);
            if (response.data.success) {
                return {
                    users: response.data.data,
                    pagination: response.data.pagination!
                };
            }
            throw new Error(response.data.message || 'Erro ao carregar usuários');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createUser(userData: UserFormData): Promise<User> {
        try {
            const response = await axios.post<ApiResponse<User>>(this.baseUrl, userData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Erro ao criar usuário');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateUser(id: number, userData: UserFormData): Promise<User> {
        try {
            const response = await axios.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, userData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Erro ao atualizar usuário');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            const response = await axios.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Erro ao excluir usuário');
            }
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || 'Erro na operação');
        }
        return error instanceof Error ? error : new Error('Erro desconhecido');
    }
}

export const userService = new UserService(); 