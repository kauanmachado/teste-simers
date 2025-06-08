<?php

namespace App\Services;

use PDO;
use PDOException;

/**
 * Serviço para operações com usuários
 * 
 * Funcionalidades:
 * - Operações no banco de dados
 * - Paginação de resultados
 * - Busca de usuários
 * - Formatação de dados
 * 
 * Métodos:
 * - getUsers: Lista usuários paginados
 * - createUser: Insere novo usuário
 * - updateUser: Atualiza dados do usuário
 * - deleteUser: Remove usuário
 * - getUserById: Busca usuário específico
 * - searchUsers: Busca usuários por termo
 * 
 * Dependências:
 * - PDO: Conexão com banco de dados
 */

class UserService
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = new PDO(
            "mysql:host=" . config('database.connections.mysql.host') . 
            ";dbname=" . config('database.connections.mysql.database'),
            config('database.connections.mysql.username'),
            config('database.connections.mysql.password'),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]
        );
    }

    public function getUsers(int $page = 1, int $perPage = 5): array
    {
        try {
            // Calcula o offset
            $offset = ($page - 1) * $perPage;

            // Obtém o total de registros
            $stmt = $this->pdo->query("SELECT COUNT(*) as total FROM users");
            $total = $stmt->fetch()['total'];

            // Obtém os usuários da página atual
            $stmt = $this->pdo->prepare("
                SELECT id, name, email, cpf, phone, birth_date, created_at 
                FROM users 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset
            ");

            $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $users = $stmt->fetchAll();

            return [
                'data' => $users,
                'pagination' => [
                    'total' => (int) $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'from' => $offset + 1,
                    'to' => min($offset + $perPage, $total)
                ]
            ];
        } catch (PDOException $e) {
            throw new \Exception("Erro ao buscar usuários: " . $e->getMessage());
        }
    }

    public function createUser(array $data): array
    {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO users (name, email, password, cpf, phone, birth_date, created_at, updated_at)
                VALUES (:name, :email, :password, :cpf, :phone, :birth_date, NOW(), NOW())
            ");

            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':password' => password_hash($data['password'], PASSWORD_DEFAULT),
                ':cpf' => $data['cpf'],
                ':phone' => $data['phone'],
                ':birth_date' => $data['birth_date']
            ]);

            return [
                'id' => $this->pdo->lastInsertId(),
                'name' => $data['name'],
                'email' => $data['email'],
                'cpf' => $data['cpf'],
                'phone' => $data['phone'],
                'birth_date' => $data['birth_date']
            ];
        } catch (PDOException $e) {
            throw new \Exception("Erro ao criar usuário: " . $e->getMessage());
        }
    }

    public function updateUser(int $id, array $data): array
    {
        try {
            $updates = [];
            $params = [':id' => $id];

            foreach ($data as $key => $value) {
                if ($key !== 'id' && $key !== 'password') {
                    $updates[] = "$key = :$key";
                    $params[":$key"] = $value;
                }
            }

            if (isset($data['password']) && !empty($data['password'])) {
                $updates[] = "password = :password";
                $params[':password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }

            $updates[] = "updated_at = NOW()";

            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            return $this->getUserById($id);
        } catch (PDOException $e) {
            throw new \Exception("Erro ao atualizar usuário: " . $e->getMessage());
        }
    }

    public function deleteUser(int $id): bool
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            throw new \Exception("Erro ao excluir usuário: " . $e->getMessage());
        }
    }

    public function getUserById(int $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare("
                SELECT id, name, email, cpf, phone, birth_date, created_at 
                FROM users 
                WHERE id = :id
            ");
            $stmt->execute([':id' => $id]);
            return $stmt->fetch() ?: null;
        } catch (PDOException $e) {
            throw new \Exception("Erro ao buscar usuário: " . $e->getMessage());
        }
    }

    public function searchUsers(string $term, int $page = 1, int $perPage = 5): array
    {
        try {
            $offset = ($page - 1) * $perPage;
            $term = "%$term%";

            // Conta total de registros que correspondem à busca
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as total 
                FROM users 
                WHERE name LIKE :term 
                OR email LIKE :term 
                OR cpf LIKE :term
            ");
            $stmt->execute([':term' => $term]);
            $total = $stmt->fetch()['total'];

            // Busca os registros da página atual
            $stmt = $this->pdo->prepare("
                SELECT id, name, email, cpf, phone, birth_date, created_at 
                FROM users 
                WHERE name LIKE :term 
                OR email LIKE :term 
                OR cpf LIKE :term
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset
            ");

            $stmt->bindValue(':term', $term, PDO::PARAM_STR);
            $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $users = $stmt->fetchAll();

            return [
                'data' => $users,
                'pagination' => [
                    'total' => (int) $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'from' => $offset + 1,
                    'to' => min($offset + $perPage, $total)
                ]
            ];
        } catch (PDOException $e) {
            throw new \Exception("Erro ao buscar usuários: " . $e->getMessage());
        }
    }
} 