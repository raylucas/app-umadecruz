import { useUser } from "@/context/UserContext";
import api, { fetchUserById } from "@/services/api";
import { saveToken } from "@/services/auth";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Platform, View } from "react-native";
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

  async function registrarTokenFCM(userId: number) {
    try {
      // 🔹 Garantir permissão
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== "granted") {
          console.log("Permissão de notificação negada.");
          return;
        }
      }

      // 🔹 Token FCM (Android) ou APNS (iOS)
      const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();

      if (!fcmToken) {
        console.log("Token FCM ainda não disponível.");
        return;
      }

      // 🔹 Salvar no backend
      await api.post("/token", {
        idUsuario: userId,
        token: fcmToken,
        plataforma: Platform.OS.toUpperCase(),
      });

    } catch (e) {
      console.log("Erro ao registrar FCM:", e);
    }
  }

  async function login() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const resp = await api.post("/auth/login", { email, senha });

      const token: string = resp.data?.token;
      if (!token) {
        setErrorMsg("Resposta inválida do servidor.");
        setLoading(false);
        return;
      }

      await saveToken(token);

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = Number(decoded.id);

      // 🔥 Registrar token FCM
      await registrarTokenFCM(userId);

      try {
        const userData = await fetchUserById(userId);
        userContext?.setUser?.(userData);
      } catch (e) {
        console.log("Falha ao buscar usuário após login:", e);
      }

      router.replace("/(tabs)");
    } catch (e: any) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        "Credenciais inválidas";

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

      {errorMsg && (
        <HelperText type="error" visible style={{ marginBottom: 8 }}>
          {errorMsg}
        </HelperText>
      )}

      <Button mode="contained" onPress={login} disabled={isDisabled}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </View>
  );
}
