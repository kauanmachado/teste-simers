import AppLayout from '@/layouts/app';

export default function Index() {
    return (
        <AppLayout>
            {/* Hero Section */}
            <div className="row align-items-center py-5">
                <div className="col-lg-6">
                    <h1 className="display-4 fw-bold mb-4">
                        Sistema de Gerenciamento de Usuários
                    </h1>
                    <p className="lead text-muted mb-4 fw-normal">
                        Uma solução completa para gerenciar seus usuários de forma eficiente e segura.
                        Cadastre, atualize e gerencie seus usuários com facilidade.
                    </p>
                    <div className="d-grid gap-2 d-md-flex">
                        <a href="/users" className="btn btn-primary btn-lg px-4 me-md-2 fw-normal rounded-pill ">
                            Gerenciar Usuários
                        </a>
                    </div>
                </div>
                <div className="col-lg-6 d-none d-lg-block">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                        alt="User Management" 
                        className="img-fluid"
                    />
                </div>
            </div>
        </AppLayout>
    );
} 