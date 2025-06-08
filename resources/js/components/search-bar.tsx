/**
 * Barra de pesquisa para filtrar usuários
 * 
 * Funcionalidades:
 * - Campo de busca com ícone
 * - Filtragem em tempo real
 * 
 * Props:
 * - searchTerm: Termo de busca
 * - onSearchChange: Função ao digitar
 */

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
                <div className="row g-3">
                    <div className="col">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-0 shadow"
                                placeholder="Buscar por nome, email ou CPF..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 