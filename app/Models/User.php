<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;


/**
 * Modelo de usuário
 * 
 * Funcionalidades:
 * - Representa tabela users
 * - Define relacionamentos
 * - Validações e regras
 * 
 * Atributos:
 * - name: Nome do usuário
 * - email: Email único
 * - password: Senha criptografada
 * - cpf: CPF único
 * - phone: Telefone
 * - birth_date: Data de nascimento
 * 
 * Relacionamentos:
 * - sessions: Sessões do usuário
 */

 
class User 
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'cpf',
        'phone',
        'birth_date',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];



}
