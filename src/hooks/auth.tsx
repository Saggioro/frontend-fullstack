import React, { createContext, useCallback, useContext, useState } from "react";

import { api } from "../services/api";

interface SignInCredentials {
  login: string;
  senha: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  data: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<string>(() => {
    const token = localStorage.getItem("@Stefanini:token");

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return token;
    }

    return "";
  });

  const signIn = useCallback(async ({ login, senha }) => {
    const response = await api.post("/sessionsUsuario", {
      login,
      senha,
    });

    const { token } = response.data;

    localStorage.setItem("@Stefanini:token", token);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData(token);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@Stefanini:token");

    setData("");
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, data }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado com o AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
