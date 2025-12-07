import api from "@/services/api";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function FormScreen() {
  const [nome, setNome] = useState("");

  async function enviar() {
    await api.post("/usuarios", { nome });
    alert("Enviado!");
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 20 }}
      />

      <Button mode="contained" onPress={enviar}>
        Enviar
      </Button>
    </View>
  );
}
