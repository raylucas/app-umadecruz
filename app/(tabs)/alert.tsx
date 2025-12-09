import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";



type Aviso = {
  id: number;
  titulo: string;
  corpo: string;
  dataCriacao: string;
  usuario: { id: number; nome: string };
};

const formatarDataParaFrontend = (data: string) => {
  if (!data) return "";
  const partes = data.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return data;
};


export default function AlertScreen () {
    const router = useRouter();
    const { user } = useUser();

    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [loading, setLoading] = useState(true);

    const fecthAvisos = async () => {
        try {
            setLoading(true);
            const response = await api.get<Aviso[]>("/aviso/avisos/hoje");
            setAvisos(response.data);
        } catch (error) {
            console.error("Erro ao carregar avisos:", error);
        } finally {
         setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
          fecthAvisos();
        }, [])
    );

    
    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleCreate = useCallback(() => {
        router.push("../alert"); 
    }, []);

    if (loading) return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#6200ee" />
        </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {avisos.length > 0
          ? `Avisos UMADECRUZ`
          : "Nenhum aviso encontrado"}
      </Text>

      {avisos.map((aviso) => (
        <Card key={aviso.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{aviso.titulo}</Text>
            <Text style={styles.description}>{aviso.corpo}</Text>
            <Text style={styles.info}>
              Data Aviso: {formatarDataParaFrontend(aviso.dataCriacao)}
            </Text>
            <Text style={styles.info}>Criado por: {aviso.usuario.nome}</Text>
          </Card.Content>
        </Card>
      ))}

      
      {user?.tipo === "ADMIN" && (
        <Button mode="contained" style={{ marginBottom: 12 }} onPress={handleCreate}>
          Criar
        </Button>
      )}

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

