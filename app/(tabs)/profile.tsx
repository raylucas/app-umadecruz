import { useUser } from "@/context/UserContext";
import { router } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";


export default function ProfileScreen() {
  const { user, logout } = useUser();

  if (!user) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Carregando...</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium">{user.nome}</Text>
      <Text variant="bodyLarge" style={{ marginBottom: 20 }}>
        {user.email}
      </Text>

      <View style={{ gap: 12, marginTop: 10 }}>
        <Button mode="contained" onPress={() => router.push("/people")}>
          Editar Dados
        </Button>

        <Button mode="contained-tonal" onPress={logout}>
          Logout
        </Button>
      </View>
    </View>
  );
}
