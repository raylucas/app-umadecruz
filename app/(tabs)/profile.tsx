import { useUser } from "@/context/UserContext";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

export default function ProfileScreen() {
  const { user, logout } = useUser();

  if (!user)
    return (
      <View style={styles.loader}>
        <Text>Carregando...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Card style={styles.userCard} elevation={4}>
        <Card.Title
          title={user.nome}
          titleStyle={styles.userName}
          subtitle={user.email}
          subtitleStyle={styles.userEmail}
          left={(props) => <Avatar.Text {...props} label={user.nome[0]} size={50} />}
        />
      </Card>

      <View style={styles.separator} />

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => router.push("/people")}>
          Editar Dados
        </Button>

        <Button mode="contained-tonal" onPress={logout}>
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userCard: {
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 12, 
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
  },
  userEmail: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    borderRadius: 1,
    marginVertical: 16, 
  },
  buttonContainer: {
    rowGap: 16, 
  },
});
