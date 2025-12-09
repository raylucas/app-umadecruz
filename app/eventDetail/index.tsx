import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-paper";

type Usuario = {
  id: number;
  nome: string;
};

type Hora = {
  hour?: number;
  minute?: number;
};

type Evento = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  inicio?: string;
  fim?: string;
  usuario: Usuario;
};

const formatarDataParaFrontend = (data: string) => {
  if (!data) return "";
  const partes = data.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return data;
};

const formatHora = (hora?: string) => {
  if (!hora) return "--:--";
  const partes = hora.split(":");
  if (partes.length >= 2) return `${partes[0].padStart(2,"0")}:${partes[1].padStart(2,"0")}`;
  return hora;
};

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventos: Evento[] = params.eventos
    ? JSON.parse(params.eventos as string)
    : [];

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {eventos.length > 0
          ? `Eventos em ${formatarDataParaFrontend(eventos[0].data)}`
          : "Nenhum evento encontrado"}
      </Text>

      {eventos.map((evento) => (
        <Card key={evento.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{evento.titulo}</Text>
            <Text style={styles.description}>{evento.descricao}</Text>
            <Text style={styles.info}>
              Data: {formatarDataParaFrontend(evento.data)}
            </Text>
            <Text style={styles.info}>
              Início: {formatHora(evento.inicio)} | Fim: {formatHora(evento.fim)}
            </Text>
            <Text style={styles.info}>Criado por: {evento.usuario.nome}</Text>
          </Card.Content>
        </Card>
      ))}

      <Button mode="contained" style={{ marginTop: 20 }} onPress={handleBack}>
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
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});
