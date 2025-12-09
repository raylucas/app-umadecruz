import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function EventFormScreen() {
    const { user } = useUser();
    const params = useLocalSearchParams<{ data?: string }>();
    const selectedDateRaw = params.data || "";
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(false);


    const formatarDataParaFrontend = (data: string) => {
        if (!data) return "";
        const partes = data.split("-");
        if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return data;
    };

    const maskHora = (text: string) => {
        let v = text.replace(/\D/g, "");
        if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1:$2");
        return v.substring(0, 5);
    };

    const horaEmMinutos = (hora: string) => {
        const [h, m] = hora.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return -1;
        return h * 60 + m;
    };

    const selectedDate = formatarDataParaFrontend(selectedDateRaw);

    const salvarEvento = async () => {
        if (!user?.id) {
        alert("Usuário não encontrado");
        return;
        }

        if (!inicio || !fim) {
            alert("Preencha os horários de início e fim.");
            return;
        }

        const inicioMin = horaEmMinutos(inicio);
        const fimMin = horaEmMinutos(fim);

        if (inicioMin === -1 || fimMin === -1) {
            alert("Horários inválidos. Use o formato HH:MM.");
            return;
        }

        if (fimMin <= inicioMin) {
            alert("O horário de fim deve ser maior que o horário de início.");
            return;
         }

        const body = {
            titulo,
            descricao,
            data: selectedDateRaw,
            inicio,
            fim,
            idUsuario: user.id,
        };

        try {
            setLoading(true);
            const response = await api.post("/evento", body);
            if (response.status === 201 || response.status === 200) {
                alert("Evento cadastrado com sucesso!");
                router.back();
            } else {
                alert("Erro ao cadastrar evento.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao cadastrar o evento.");
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateText}>Data selecionada: {selectedDate}</Text>
        <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
        <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={[styles.input, styles.textarea]} // aplica estilo maior
            multiline
            numberOfLines={6} // altura inicial, pode ajustar
            textAlignVertical="top" // faz o texto começar do topo
            />
        <TextInput
            label="Início (HH:MM)"
            value={inicio}
            keyboardType="numeric"
            onChangeText={(v) => setInicio(maskHora(v))}
            style={styles.input}
        />

        <TextInput
            label="Fim (HH:MM)"
            value={fim}
            keyboardType="numeric"
            onChangeText={(v) => setFim(maskHora(v))}
            style={styles.input}
        />
        <Button mode="contained" onPress={salvarEvento} loading={loading} style={{ marginTop: 20 }}>
            Salvar Evento
        </Button>

        <Button
            mode="outlined"
            onPress={() => router.push("/(tabs)/calendar")}
            style={{ marginTop: 12 }}
        >
            Voltar
        </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    input: {
        marginBottom: 12,
    },
    dateText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6200ee",
        marginBottom: 16,
        textAlign: "center",
    },
    textarea: {
        minHeight: 120, 
        paddingTop: 10,
    },
});