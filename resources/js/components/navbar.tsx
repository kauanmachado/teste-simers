import { Link } from "@inertiajs/react";

/**
 * Barra de navegação principal
 * 
 * Funcionalidades:
 * - Links de navegação
 * - Logo/título do sistema
 * - Responsivo
 */

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand fw-semibold" href="/">
                        <i className="bi bi-people-fill me-2"></i>
                        Sistema de Usuários
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link fw-medium" href="/">
                                    <i className="bi bi-house-door me-1"></i>
                                    Início
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-medium" href="/users">
                                    <i className="bi bi-person-plus me-1"></i>
                                    Usuários
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    );
}