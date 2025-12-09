import { useUser } from "@/context/UserContext";
import api, { fetchUserById } from "@/services/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";

export default function PeopleScreen() {
  const { user, setUser } = useUser();

  const formatarDataParaFrontend = (data: string) => {
    if (!data) return "";
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  };

  const formatarDataParaBackend = (data: string) => {
    const partes = data.split("/");
    if (partes.length === 3) return `${partes[2]}-${partes[1]}-${partes[0]}`;
    return data;
  };

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [dataBatismo, setDataBatismo] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [congregacao, setCongregacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");

  const [loadingBtn, setLoadingBtn] = useState(false); 
  const [loading, setLoading] = useState(false); 


  const cidades = ["Cruzeiro", "Lavrinhas"];
  const congregacoes = ["Sede", "Vila Batista", "Batedor", "Capela do Jacú", "KM 4"];

  // Máscaras
  const maskTelefone = (text: string) => {
    let v = text.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "($1) $2");
    if (v.length > 7) v = v.replace(/(\(\d{2}\) \d{5})(\d)/, "$1-$2");
    return v.substring(0, 15);
  };

  const maskDate = (text: string) => {
    let v = text.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1/$2");
    if (v.length > 5) v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    return v;
  };

  const maskCep = (text: string) => {
    let v = text.replace(/\D/g, "");
    v = v.replace(/(\d{2})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1-$2");
    return v.substring(0, 10);
  };

  // Carregar usuário do backend ao abrir a tela
  useEffect(() => {
    const loadUser = async () => {
      if (!user?.id) return;

      try {
        setLoading(true); // ✅ loader enquanto carrega
        const userData = await fetchUserById(user.id);
        setUser?.(userData);

        setNome(userData.nome || "");
        setEmail(userData.email || "");
        setTelefone(userData.telefone || "");
        setDataNasc(formatarDataParaFrontend(userData.dataNascimento));
        setDataBatismo(formatarDataParaFrontend(userData.dataBatismo));
        setEndereco(userData.endereco || "");
        setBairro(userData.bairro || "");
        setCidade(userData.cidade || "");
        setCep(userData.cep || "");
        setCongregacao(userData.congregacao || "");
      } catch (e) {
        console.log("Erro ao carregar dados do usuário:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [user?.id]);

    if (loading) return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );

  // Função salvar
  const salvar = async () => {
    if (!user?.id) {
      alert("Usuário não encontrado.");
      return;
    }

    const body = {
      id: user.id,
      nome,
      dataNascimento: formatarDataParaBackend(dataNasc),
      telefone,
      endereco,
      bairro,
      cidade,
      cep,
      congregacao,
      dataBatismo: formatarDataParaBackend(dataBatismo),
    };

    try {
      setLoadingBtn(true); 
      const response = await api.put("/usuario", body);

      if (response.status === 200) {
        alert("Dados salvos com sucesso!");
      } else {
        alert("Erro ao salvar os dados.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar os dados.");
    } finally {
      setLoadingBtn(false); 
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}> Editar Dados </Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 12 }} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 12 }} />
      <TextInput
        label="Data Nascimento"
        value={dataNasc}
        keyboardType="numeric"
        onChangeText={(v) => setDataNasc(maskDate(v))}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Telefone"
        value={telefone}
        keyboardType="numeric"
        onChangeText={(v) => setTelefone(maskTelefone(v))}
        style={{ marginBottom: 12 }}
      />
      <TextInput label="Endereço" value={endereco} onChangeText={setEndereco} style={{ marginBottom: 12 }} />
      <TextInput label="Bairro" value={bairro} onChangeText={setBairro} style={{ marginBottom: 12 }} />
      <TextInput
        label="CEP"
        value={cep}
        keyboardType="numeric"
        onChangeText={(v) => setCep(maskCep(v))}
        style={{ marginBottom: 12 }}
      />

      <RNPickerSelect
        onValueChange={setCidade}
        value={cidade}
        placeholder={{ label: "Selecione a Cidade", value: null }}
        items={cidades.map((c) => ({ label: c, value: c }))}
      />

      <RNPickerSelect
        onValueChange={setCongregacao}
        value={congregacao}
        placeholder={{ label: "Selecione a Congregação", value: null }}
        items={congregacoes.map((c) => ({ label: c, value: c }))}
      />

      <TextInput
        label="Data de Batismo"
        value={dataBatismo}
        keyboardType="numeric"
        onChangeText={(v) => setDataBatismo(maskDate(v))}
        style={{ marginBottom: 12 }}
      />

      {/* Botão com loader */}
      <Button mode="contained" onPress={salvar} loading={loadingBtn} disabled={loadingBtn}>
        Salvar
      </Button>

      <Button mode="outlined" style={{ marginTop: 20 }} onPress={() => router.back()} disabled={loadingBtn}>
        Voltar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
    textAlign: "center",
  },
});