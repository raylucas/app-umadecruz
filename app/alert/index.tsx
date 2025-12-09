import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Button } from "react-native-paper";

export default function CreateAvisoScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!titulo || !corpo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const hoje = new Date();

    const body = {
        titulo,
        corpo,
        dataCriacao: hoje,
        idUsuario: user?.id,
    };

    try {
        setLoading(true);
        await api.post("/aviso", body);
        Alert.alert("Sucesso", "Aviso criado com sucesso!");
        router.back(); 
    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível criar o aviso");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Criar Aviso</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Corpo do aviso"
        value={corpo}
        onChangeText={setCorpo}
        multiline
      />

      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}>
        Criar
      </Button>

      <Button mode="outlined" style={{ marginTop: 12 }} onPress={() => router.back()}>
        Voltar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
