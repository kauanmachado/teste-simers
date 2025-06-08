import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

/**
 * Layout principal da aplicação
 * 
 * Funcionalidades:
 * - Estrutura base (navbar, conteúdo, footer)
 * - Container responsivo
 * - Gerenciamento de layout
 * 
 * Props:
 * - children: Conteúdo a ser renderizado
 */

interface Props {
    children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1 py-4">
                <div className="container">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
} 