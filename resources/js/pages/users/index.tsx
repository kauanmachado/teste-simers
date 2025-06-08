import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app';
import UserModal from '@/components/user-modal';
import UserTable from '@/components/user-table';
import Pagination from '@/components/pagination';
import SearchBar from '@/components/search-bar';
import { User, PaginationData } from '@/interfaces/User';
import { userService } from '@/services/user-service';
import axios from 'axios';

export default function Users() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        per_page: 5,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0
    });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const { users, pagination } = await userService.getUsers(page);
            setUsers(users);
            setPagination(pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
            console.error('Erro ao carregar usuários:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (page: number) => {
        fetchUsers(page);
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                setError(null);
                const response = await axios.delete(`/api/users/${id}`);
                if (response.data.success) {
                    await fetchUsers(pagination.current_page);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
                console.error('Erro ao excluir usuário:', err);
            }
        }
    };

    const handleSort = (field: string) => {
        const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        const sortedUsers = [...users].sort((a, b) => {
            const aValue = a[field as keyof User];
            const bValue = b[field as keyof User];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return newDirection === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (field === 'birth_date') {
                const aDate = new Date(aValue as string);
                const bDate = new Date(bValue as string);
                return newDirection === 'asc'
                    ? aDate.getTime() - bDate.getTime()
                    : bDate.getTime() - aDate.getTime();
            }

            return 0;
        });

        setUsers(sortedUsers);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setError(null);
    };

    const handleSuccess = async () => {
        await fetchUsers(pagination.current_page);
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(searchTerm)
    );

    if (loading) {
        return (
            <AppLayout>
                <div className="container py-4">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className="container py-4">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-0">Gerenciamento de Usuários</h1>
                        <p className="text-muted">Gerencie os usuários do sistema</p>
                    </div>
                    <button
                        className="btn btn-primary rounded-pill px-4 shadow"
                        onClick={() => setIsModalOpen(true)}
                    >
                        
                        Adicionar Usuário
                    </button>
                </div>

                <SearchBar 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <UserTable 
                    users={filteredUsers}
                    onDelete={handleDeleteUser}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onEdit={handleEditUser}
                />

                <div className="card-footer bg-white border-0 py-3">
                    <Pagination 
                        current_page={pagination.current_page}
                        last_page={pagination.last_page}
                        total={pagination.total}
                        from={pagination.from}
                        to={pagination.to}
                        per_page={pagination.per_page}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={selectedUser || undefined}
                onSuccess={handleSuccess}
            />
        </AppLayout>
    );
} 