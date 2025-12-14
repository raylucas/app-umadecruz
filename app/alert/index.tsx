import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, Snackbar } from "react-native-paper";

export default function CreateAvisoScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const handleSubmit = async () => {
    if (!titulo || !corpo) {
      setSnackbarMsg("Preencha todos os campos");
      setSnackbarVisible(true);
      return;
    }

    const body = {
      titulo,
      corpo,
      dataCriacao: new Date(),
      idUsuario: user?.id,
    };

    try {
      setLoading(true);
      await api.post("/aviso", body);

      setSnackbarMsg("🔔 Aviso criado com sucesso");
      setSnackbarVisible(true);

      // volta após mostrar feedback
      setTimeout(() => {
        router.back();
      }, 800);

    } catch (error) {
      console.error(error);
      setSnackbarMsg("Erro ao criar aviso");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Criar
        </Button>

        <Button
          mode="outlined"
          style={{ marginTop: 12 }}
          onPress={() => router.back()}
        >
          Voltar
        </Button>
      </ScrollView>

      {/* 🔔 Banner in-app */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: "#6200ee" }}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
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
