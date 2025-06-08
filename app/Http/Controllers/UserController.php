<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

/**
 * Controlador para gerenciamento de usuários
 * 
 * Funcionalidades:
 * - CRUD completo de usuários
 * - Validação de dados
 * - Tratamento de erros
 * - Respostas JSON padronizadas
 * 
 * Métodos:
 * - index: Lista usuários com paginação e busca
 * - store: Cria novo usuário
 * - update: Atualiza usuário existente
 * - destroy: Remove usuário
 * 
 * Dependências:
 * - UserService: Lógica de negócio
 */

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $page = $request->input('page', 1);
            $searchTerm = $request->input('search');

            if ($searchTerm) {
                $result = $this->userService->searchUsers($searchTerm, $page);
            } else {
                $result = $this->userService->getUsers($page);
            }

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6',
                'cpf' => 'required|string|unique:users',
                'phone' => 'required|string',
                'birth_date' => ['required', 'date', 'before_or_equal:today']
            ], [
                'email.unique' => 'Este email já está cadastrado',
                'cpf.unique' => 'Este CPF já está cadastrado',
                'birth_date.before_or_equal' => 'A data de nascimento não pode ser futura'
            ]);

            $user = $this->userService->createUser($validated);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Usuário criado com sucesso'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:6',
                'cpf' => 'sometimes|required|string|unique:users,cpf,' . $id,
                'phone' => 'sometimes|required|string',
                'birth_date' => ['sometimes', 'required', 'date', 'before_or_equal:today']
            ], [
                'email.unique' => 'Este email já está cadastrado',
                'cpf.unique' => 'Este CPF já está cadastrado',
                'birth_date.before_or_equal' => 'A data de nascimento não pode ser futura'
            ]);

            $user = $this->userService->updateUser($id, $validated);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Usuário atualizado com sucesso'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuário excluído com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
