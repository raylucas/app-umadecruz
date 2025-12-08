import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function PeopleScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Editar Dados</Text>

      <TextInput label="Nome" style={{ marginBottom: 12 }} />
      <TextInput label="Email" style={{ marginBottom: 12 }} />

      <Button mode="contained" onPress={() => alert("Salvo!")}>
        Salvar
      </Button>

      <Button
        style={{ marginTop: 20 }}
        onPress={() => router.back()}
      >
        Voltar
      </Button>
    </View>
  );
}
