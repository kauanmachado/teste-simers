import { PaginationData } from '@/interfaces/User';

/**
 * Componente de paginação
 * 
 * Funcionalidades:
 * - Navegação entre páginas
 * - Exibe informações de paginação
 * - Botões anterior/próximo
 * 
 * Props:
 * - current_page: Página atual
 * - last_page: Última página
 * - total: Total de registros
 * - onPageChange: Função ao mudar página
 */


interface PaginationProps extends PaginationData {
    onPageChange: (page: number) => void;
}

export default function Pagination({ 
    current_page, 
    last_page, 
    total, 
    from, 
    to, 
    onPageChange 
}: PaginationProps) {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
                Mostrando <strong>{from}</strong> a <strong>{to}</strong> de <strong>{total}</strong> registros
            </div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => onPageChange(current_page - 1)}
                            disabled={current_page === 1}
                        >
                            Anterior
                        </button>
                    </li>
                    {[...Array(last_page)].map((_, index) => (
                        <li 
                            key={index + 1} 
                            className={`page-item ${current_page === index + 1 ? 'active' : ''}`}
                        >
                            <button 
                                className="page-link"
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${current_page === last_page ? 'disabled' : ''}`}>
                        <button 
                            className="page-link"
                            onClick={() => onPageChange(current_page + 1)}
                            disabled={current_page === last_page}
                        >
                            Próximo
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
} 