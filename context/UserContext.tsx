import api from "@/services/api";
import { getToken, removeToken } from "@/services/auth";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  congregacao: string;
  dataBatismo: string
};

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

type UserContextType = {
  user: Usuario | null;
  setUser: (u: Usuario | null) => void;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
};

type Props = {
  children: ReactNode;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loadUser: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<Usuario | null>(null);

  async function loadUser() {
    try {
      const token = await getToken();
      if (!token) return;

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = Number(decoded.sub);

      const resp = await api.get(`/usuario/id/${userId}`);
      setUser(resp.data);
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    await removeToken();
    setUser(null);
    router.replace("/login");
  }

  return (
    <UserContext.Provider value={{ user, setUser, loadUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
