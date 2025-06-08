import { User } from '@/interfaces/User';

/**
 * Componente de tabela para exibição de usuários
 * 
 * Funcionalidades:
 * - Exibe lista de usuários em formato tabular
 * - Permite ordenação por colunas
 * - Mostra avatar com inicial do nome
 * - Botões de ação para editar e excluir
 * 
 * Props:
 * - users: Lista de usuários
 * - onDelete: Função para excluir usuário
 * - onSort: Função para ordenar tabela
 * - sortField: Campo atual de ordenação
 * - sortDirection: Direção da ordenação
 * - onEdit: Função para editar usuário
 */

// Interface que define as props do componente UserTable
interface UserTableProps {
    users: User[];              // Lista de usuários a serem exibidos
    onDelete: (id: number) => void;  // Função chamada ao excluir um usuário
    onSort: (field: string) => void; // Função chamada ao ordenar a tabela
    sortField: string;          // Campo atual de ordenação
    sortDirection: 'asc' | 'desc'; // Direção da ordenação
    onEdit: (user: User) => void;   // Função chamada ao editar um usuário
}

export default function UserTable({ 
    users, 
    onDelete, 
    onSort,
    sortField,
    sortDirection,
    onEdit
}: UserTableProps) {
    // Função para lidar com a ordenação da tabela
    const handleSort = (field: string) => {
        onSort(field);
    };

    // Retorna o ícone de ordenação baseado no campo e direção
    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                {/* Cabeçalho da tabela com colunas ordenáveis */}
                <thead className="bg-light">
                    <tr>
                        <th 
                            className="border-0 cursor-pointer" 
                            onClick={() => handleSort('name')}
                            style={{ cursor: 'pointer' }}
                        >
                            Nome {getSortIcon('name')}
                        </th>
                        <th 
                            className="border-0 cursor-pointer" 
                            onClick={() => handleSort('email')}
                            style={{ cursor: 'pointer' }}
                        >
                            Email {getSortIcon('email')}
                        </th>
                        <th 
                            className="border-0 cursor-pointer" 
                            onClick={() => handleSort('cpf')}
                            style={{ cursor: 'pointer' }}
                        >
                            CPF {getSortIcon('cpf')}
                        </th>
                        <th 
                            className="border-0 cursor-pointer" 
                            onClick={() => handleSort('phone')}
                            style={{ cursor: 'pointer' }}
                        >
                            Telefone {getSortIcon('phone')}
                        </th>
                        <th 
                            className="border-0 cursor-pointer" 
                            onClick={() => handleSort('birth_date')}
                            style={{ cursor: 'pointer' }}
                        >
                            Data de Nascimento {getSortIcon('birth_date')}
                        </th>
                        <th className="border-0 text-end">Ações</th>
                    </tr>
                </thead>
                {/* Corpo da tabela com os dados dos usuários */}
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            {/* Coluna do nome com avatar */}
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle me-2">
                                        <span className="avatar-text text-primary">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h6 className="mb-0">{user.name}</h6>
                                    </div>
                                </div>
                            </td>
                            {/* Dados básicos do usuário */}
                            <td>{user.email}</td>
                            <td>{user.cpf}</td>
                            <td>{user.phone}</td>
                            <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                            {/* Botões de ação */}
                            <td>
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" 
                                        title="Editar"
                                        onClick={() => onEdit(user)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                        <span>Atualizar</span>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" 
                                        title="Excluir"
                                        onClick={() => onDelete(user.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                        <span>Remover</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 