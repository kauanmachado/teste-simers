/**
 * Rodapé da aplicação
 * 
 * Funcionalidades:
 * - Informações de copyright
 * - Links úteis
 * - Versão do sistema
 */

export default function Footer() {
    return (
        <footer className="bg-light py-4 mt-auto">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0 fw-medium">
                                &copy; {new Date().getFullYear()} Sistema de Usuários. Kauan da Silva Machado.
                            </p>
                        </div>
                    </div>
                </div>
        </footer>
    );
}