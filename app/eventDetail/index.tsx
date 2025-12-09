import api from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

type Evento = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  inicio: { hour: number; minute: number };
  fim: { hour: number; minute: number };
  usuario: { nome: string };
};

export default function EventDetailScreen() {
    const params = useLocalSearchParams<{ data?: string }>();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const resp = await api.get<Evento>(`/evento/${id}`);
        setEvento(resp.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvento();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!evento) return <Text style={styles.center}>Evento não encontrado</Text>;

  const formatTime = (t: { hour: number; minute: number }) =>
    `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;

  const formatDate = (d: string) => {
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <Text style={styles.value}>{evento.titulo}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{evento.descricao}</Text>

      <Text style={styles.label}>Data:</Text>
      <Text style={styles.value}>{formatDate(evento.data)}</Text>

      <Text style={styles.label}>Início:</Text>
      <Text style={styles.value}>{formatTime(evento.inicio)}</Text>

      <Text style={styles.label}>Fim:</Text>
      <Text style={styles.value}>{formatTime(evento.fim)}</Text>

      <Text style={styles.label}>Usuário:</Text>
      <Text style={styles.value}>{evento.usuario.nome}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", fontSize: 16, marginTop: 12 },
  value: { fontSize: 16, marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
