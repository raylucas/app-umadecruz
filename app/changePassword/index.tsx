import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const ChangePasswordScreen = () => {
  const { user } = useUser();

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [senhaValida, setSenhaValida] = useState(true);
  const [senhaConfere, setSenhaConfere] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showSenhaAntiga, setShowSenhaAntiga] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(senha);
  };

  const handleNovaSenhaChange = (text: string) => {
    setNovaSenha(text);
    setSenhaValida(validarSenha(text));
    setSenhaConfere(text === confirmarSenha);
  };

  const handleConfirmarSenhaChange = (text: string) => {
    setConfirmarSenha(text);
    setSenhaConfere(text === novaSenha);
  };

  const handleAlterarSenha = async () => {
    if (!senhaValida) {
      Alert.alert("Erro", "A nova senha não atende aos critérios mínimos.");
      return;
    }
    if (!senhaConfere) {
      Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await api.put("/usuario/alterarSenha", {
        email: user?.email,
        senhaAntiga,
        novaSenha,
      });
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

    const handleBack = useCallback(() => {
        router.back();
    }, []);

  return (
    <View style={styles.container}>

        <Text style={styles.header}>
            Alterar Senha
        </Text>
        
      <TextInput
        label="Senha Antiga"
        value={senhaAntiga}
        onChangeText={setSenhaAntiga}
        secureTextEntry={!showSenhaAntiga}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showSenhaAntiga ? "eye-off" : "eye"}
            onPress={() => setShowSenhaAntiga(!showSenhaAntiga)}
          />
        }
      />

      <TextInput
        label="Nova Senha"
        value={novaSenha}
        onChangeText={handleNovaSenhaChange}
        secureTextEntry={!showNovaSenha}
        style={styles.input}
        error={!senhaValida}
        right={
          <TextInput.Icon
            icon={showNovaSenha ? "eye-off" : "eye"}
            onPress={() => setShowNovaSenha(!showNovaSenha)}
          />
        }
      />
      {!senhaValida && (
        <Text style={styles.errorText}>
          A senha deve ter no mínimo 6 caracteres, incluindo letras e números.
        </Text>
      )}

      <TextInput
        label="Confirmar Nova Senha"
        value={confirmarSenha}
        onChangeText={handleConfirmarSenhaChange}
        secureTextEntry={!showConfirmarSenha}
        style={styles.input}
        error={!senhaConfere}
        right={
          <TextInput.Icon
            icon={showConfirmarSenha ? "eye-off" : "eye"}
            onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
          />
        }
      />
      {!senhaConfere && (
        <Text style={styles.errorText}>As senhas não coincidem.</Text>
      )}

      <Button
        mode="contained"
        onPress={handleAlterarSenha}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Alterar Senha
      </Button>

        <Button mode="outlined"  style={{ marginTop: 20 }} onPress={handleBack}>
            Voltar
        </Button>
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
  button: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default ChangePasswordScreen;
