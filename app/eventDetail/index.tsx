import { useSnackbar } from "@/context/SnackbarContext";
import api from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  const [presencas, setPresencas] = useState<{ [idEvento: number]: boolean }>({});
  const [loadingBtn, setLoadingBtn] = useState<{ [idEvento: number]: boolean }>({});
  const [carregandoPresenca, setCarregandoPresenca] = useState<{ [idEvento: number]: boolean }>({});

  const { showSnackbar } = useSnackbar();

  const eventos: Evento[] = params.eventos
    ? JSON.parse(params.eventos as string)
    : [];

  const usuarioLogadoId = eventos.length > 0 ? eventos[0].usuario.id : 0;

  // -------- VERIFICAR PRESENÇA --------
  const verificarPresenca = async (idEvento: number) => {
    setCarregandoPresenca(prev => ({ ...prev, [idEvento]: true }));

    try {
      await api.get(`/evento/${idEvento}/usuario/${usuarioLogadoId}`);
      setPresencas(prev => ({ ...prev, [idEvento]: true }));
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPresencas(prev => ({ ...prev, [idEvento]: false }));
      }
    } finally {
      setCarregandoPresenca(prev => ({ ...prev, [idEvento]: false }));
    }
  };

  useEffect(() => {
    eventos.forEach((e) => verificarPresenca(e.id));
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const marcarPresenca = async (idEvento: number) => {

    const body = {
      idEvento,
      idUsuario: usuarioLogadoId,
    };

    try {

      setLoadingBtn((prev) => ({ ...prev, [idEvento]: true }));
      const response = await api.post("/evento/usuario/presenca", body);

      if (response.status === 200) {
        showSnackbar("Presença registrada com sucesso!");
        setPresencas((prev) => ({ ...prev, [idEvento]: true }));
      }
      else{
        showSnackbar("Falha ao marcar presença");
      }
    } catch (error) {
      showSnackbar("Falha ao marcar presença");
    } finally {
      setLoadingBtn((prev) => ({ ...prev, [idEvento]: false }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {eventos.length > 0
          ? `Eventos em ${formatarDataParaFrontend(eventos[0].data)}`
          : "Nenhum evento encontrado"}
      </Text>

      {eventos.map((evento) => {
        const jaFui = presencas[evento.id] === true;
        return (
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

              {carregandoPresenca[evento.id] ? (
                <Button mode="contained" loading style={{ marginTop: 10, backgroundColor: "#bdc3c7" }}>
                  Carregando...
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={{
                    marginTop: 10,
                    backgroundColor: presencas[evento.id] ? "#3498db" : "#2ecc71",
                    opacity: jaFui ? 1 : 1,
                  }}
                  labelStyle={{ color: "#fff" }}
                  disabled={presencas[evento.id]}
                  onPress={() => marcarPresenca(evento.id)}
                >
                  {presencas[evento.id] ? "🎉 Eu fui" : "Marcar Presença"}
                </Button>
              )}
                          </Card.Content>
          </Card>
        );
      })}

      <Button mode="outlined"  style={{ marginTop: 20 }} onPress={handleBack}>
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
