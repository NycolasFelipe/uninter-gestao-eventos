import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NavigateFunction } from "react-router-dom";

// Interfaces
import type { ILoginMutationVariables } from "src/interfaces/ILogin";
import type { IUser } from "src/interfaces/IUser";

// Controllers
import AuthController from "src/controllers/AuthController";

/** Hook para gerenciar autenticação JWT */
const useAuth = () => {
  // React Query
  const query = useQueryClient();

  // Estado para armazenar dados do usuário
  const [user, setUser] = useState<IUser | null>(null);

  // Estado que indica se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado de carregamento durante a verificação inicial do token
  const [loading, setLoading] = useState(true);

  // Função para verificar e atualizar o estado de autenticação
  const updateUser = () => {
    const token = sessionStorage.getItem("authToken");

    // Se não há token, limpa os estados
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Decodifica o token JWT e atualiza os estados
      const decodedToken = jwtDecode(token) as IUser;
      setUser(decodedToken);
      setIsAuthenticated(true);
    } catch (error) {
      // Em caso de token inválido, limpa a autenticação
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }

  // Função para gerenciar o logout
  const logout = () => {
    sessionStorage.removeItem("authToken");
    updateUser();
    query.clear();
  }

  // Função para gerenciar o login
  const login = (email: string, password: string, navigate: NavigateFunction) => {
    mutationLogin.mutate({ credentials: { email, password }, navigate });
  }

  const mutationLogin = useMutation({
    mutationFn: async ({ credentials, navigate }: ILoginMutationVariables) => {
      const { token } = await AuthController.login(credentials);
      return { token, navigate }
    },
    onSuccess: ({ token, navigate }) => {
      const decodedToken = jwtDecode(token) as IUser;
      if (decodedToken) {
        sessionStorage.setItem('authToken', token);
        query.invalidateQueries({ queryKey: ['login'] });
        updateUser();
        navigate("/home");
      }
    },
  });

  // Efeito para verificar autenticação ao montar o componente
  // e sincronizar entre abas/janelas
  useEffect(() => {
    updateUser();

    // Listener para mudanças no armazenamento (sync entre abas)
    const handleStorageChange = () => updateUser();
    window.addEventListener('storage', handleStorageChange);

    // Cleanup do listener
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,               // Dados do usuário decodificados
    updateUser,         // Função para forçar atualização do estado
    isAuthenticated,    // Status atual da autenticação
    setIsAuthenticated, // Modificador manual do status
    login,              // Função para gerenciar o login
    mutationLogin,      // Mutation para acessar estados do login
    logout,             // Função para gerenciar o logout
    loading             // Status de carregamento inicial
  }
}

export default useAuth;