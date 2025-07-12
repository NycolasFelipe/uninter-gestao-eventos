import type { ILoginCredentials } from "src/interfaces/ILogin";

class AuthController {
  static async login(credentials: ILoginCredentials) {
    const { email, password } = credentials;

    // Configuração da requisição
    const url = "http://localhost:3000/api/v0/auth/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }

    // Requisição
    const response = await fetch(url, options);

    // Acesso negado
    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    // Retorna token do usuário
    return await response.json();
  }
}

export default AuthController;