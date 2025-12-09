import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

type Evento = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  inicio: string;
  fim: string;
};

type Aviso = {
  id: number;
  titulo: string;
  corpo: string;
  dataCriacao: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventosRes, avisosRes] = await Promise.all([
          api.get<Evento[]>("/evento/eventos/semana"),
          api.get<Aviso[]>("/aviso/avisos/hoje"),
        ]);

        setEventos(eventosRes.data);
        setAvisos(avisosRes.data);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatarData = (data: string) => {
    const [year, month, day] = data.split("-").map(Number);
    const d = new Date(year, month - 1, day); // month é 0-index
    return d.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Saudação */}
      <View style={styles.saudacaoContainer}>
        <Text style={styles.saudacao}>Olá,</Text>
        <Text style={styles.saudacaoNome}>{user?.nome}</Text>
      </View>

      <View style={styles.separator} />

      {/* Eventos da semana */}
      <Text style={styles.sectionTitle}>Eventos da Semana</Text>
      {eventos.length > 0 ? (
        eventos.map((evento) => (
          <Card
            key={evento.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "../../eventDetail",
                params: { eventos: JSON.stringify([evento]) },
              })
            }
            elevation={3}
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{evento.titulo}</Text>
              <Text style={styles.cardDate}>
                {formatarData(evento.data)} | {evento.inicio} - {evento.fim}
              </Text>
              <Text>{evento.descricao}</Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noDataText}>Nenhum evento esta semana</Text>
      )}

      <View style={styles.separator} />

      {/* Avisos do dia */}
      <Text style={styles.sectionTitle}>Aviso do Dia</Text>
      {avisos.length > 0 ? (
        avisos.map((aviso) => (
          <Card
            key={aviso.id}
            style={[styles.card, { backgroundColor: "#ffe5e5" }]}
            onPress={() =>
              router.push({
                pathname: "(tabs)/alert",
              })
            }
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{aviso.titulo}</Text>
              <Text>{aviso.corpo}</Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noDataText}>Nenhum aviso hoje</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saudacaoContainer: {
    marginBottom: 20,
  },
  saudacao: {
    fontSize: 28,
    fontWeight: "600",
    color: "#6200ee",
  },
  saudacaoNome: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff6f61",
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
    color: "#333",
  },
  card: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  noDataText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
    marginBottom: 12,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    borderRadius: 1,
    marginVertical: 16, 
  },
});
