import { useEffect } from 'react';
import { UserFormData } from '@/interfaces/User';
import CreateUserForm from './forms/create-user-form';
import UpdateUserForm from './forms/update-user-form';

/**
 * Modal para criação/edição de usuários
 * 
 * Funcionalidades:
 * - Renderiza formulário apropriado (criar/editar)
 * - Gerencia estado do modal
 * - Callbacks de sucesso/erro
 * 
 * Props:
 * - isOpen: Controla visibilidade
 * - onClose: Função para fechar modal
 * - initialData: Dados do usuário (se edição)
 * - onSuccess: Callback após operação
 */

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<UserFormData>;
    onSuccess?: () => void;
}

export default function UserModal({ isOpen, onClose, initialData, onSuccess }: UserModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div 
                className="modal-backdrop fade show" 
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1040
                }}
                onClick={handleBackdropClick}
            />
            <div 
                className="modal fade show" 
                style={{ 
                    display: 'block',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1050,
                    overflow: 'auto'
                }}
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {initialData ? 'Editar Usuário' : 'Novo Usuário'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {initialData ? (
                                <UpdateUserForm
                                    user={initialData as UserFormData}
                                    onSuccess={onSuccess}
                                />
                            ) : (
                                <CreateUserForm
                                    onSuccess={onSuccess}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 