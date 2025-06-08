<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migração para criação da tabela de usuários
 * 
 * Estrutura:
 * - id: Chave primária
 * - name: Nome do usuário
 * - email: Email único
 * - password: Senha
 * - cpf: CPF único (11 dígitos)
 * - phone: Telefone (11 dígitos)
 * - birth_date: Data de nascimento
 * - timestamps: created_at e updated_at
 */

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('cpf', 11)->unique();
            $table->string('phone', 11);
            $table->date('birth_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}; 