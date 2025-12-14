import { useSnackbar } from "@/context/SnackbarContext";
import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";

const tipos = ["ADMIN", "USER"];

const UserScreen = () => {
  const { user } = useUser();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do Dialog de senha
  const [senhaGerada, setSenhaGerada] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const { showSnackbar } = useSnackbar();

  const handleCriarUsuario = async () => {
    if (!nome || !email || !tipo) {
      showSnackbar("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    const body = {
      nome,
      email,
      tipo,
    };

    try {
      const response = await api.post("/usuario", body);
      if (response.status === 201 || response.status === 200) {
        setSenhaGerada(response.data.senha);
        setShowSenha(false); // senha oculta por padrão
        setDialogVisible(true); // mostra o dialog
      }
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      showSnackbar("Não foi possível criar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Criar Usuário</Text>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <RNPickerSelect
        onValueChange={setTipo}
        value={tipo}
        placeholder={{ label: "Selecione o tipo de Usuário", value: null }}
        items={tipos.map((t) => ({ label: t, value: t }))}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      <Button
        mode="contained"
        onPress={handleCriarUsuario}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Criar
      </Button>

      <Button mode="outlined" style={{ marginTop: 20 }} onPress={handleBack}>
        Voltar
      </Button>

      {/* Dialog da senha */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Senha Gerada</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text style={styles.senhaText}>{showSenha ? senhaGerada : "••••••••"}</Text>
            <IconButton
              icon={showSenha ? "eye-off" : "eye"}
              onPress={() => setShowSenha(!showSenha)}
            />
            <IconButton
              icon="content-copy"
              onPress={async () => {
                await Clipboard.setStringAsync(senhaGerada);
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 12,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#000",
    paddingRight: 30,
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
    textAlign: "center",
  },
  dialogContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  senhaText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
});

export default UserScreen;
