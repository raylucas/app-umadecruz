// app/login.tsx
import { useUser } from "@/context/UserContext"; // seu context (assumindo que exista)
import api from "@/services/api";
import { saveToken } from "@/services/auth";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

type JwtPayload = {
  sub: string; 
  id?: string;
  role?: string;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userContext = (() => {
    try {
      return useUser();
    } catch {
      return null as any;
    }
  })();

  async function login() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const resp = await api.post("/auth/login", {
        email,
        senha,
      });

      const token: string = resp.data?.token;
      if (!token) {
        console.log("Resposta do login sem token:", resp.data);
        setErrorMsg("Resposta inválida do servidor (token).");
        setLoading(false);
        return;
      }

      await saveToken(token);

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = Number(decoded.id);

      try {
        const userResp = await api.get(`/usuario/id/${userId}`);
        const userData = userResp.data;
        if (userContext?.setUser) {
          userContext.setUser(userData);
        }
      } catch (e: any) {
        console.log("Falha ao buscar usuário após login:", e.response?.data ?? e.message);
      }

      router.replace("/(tabs)");
    } catch (e: any) {
      console.log("ERRO NO LOGIN - response:", e.response?.data ?? null);
      console.log("ERRO NO LOGIN - message:", e.message);

      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.message ? String(e.message) : "Credenciais inválidas");

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || !email || !senha;

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 12 }}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((s) => !s)}
          />
        }
        style={{ marginBottom: 8 }}
      />

      {errorMsg ? (
        <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
          {errorMsg}
        </HelperText>
      ) : null}

      <Button mode="contained" onPress={login} disabled={isDisabled}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </View>
  );
}
