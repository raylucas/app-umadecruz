import { useUser } from "@/context/UserContext";
import api from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ],
  monthNamesShort: [
    "Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"
  ],
  dayNames: [
    "Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"
  ],
  dayNamesShort: [
    "Dom","Seg","Ter","Qua","Qui","Sex","Sáb"
  ],
  today: "Hoje"
};
LocaleConfig.defaultLocale = "pt-br";

type Evento = {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  inicio: string; // formato "HH:mm:ss"
  fim: string;    // formato "HH:mm:ss"
  usuario: { id: number; nome: string };
};

export default function CalendarScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { height, width } = Dimensions.get("window");

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  const numRows = 6;
  const cellHeight = height / (numRows + 3);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await api.get<Evento[]>("/evento");
      setEventos(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEventos();
    }, [])
  );

  const markedDates: Record<string, any> = {};
  eventos.forEach((evento) => {
    markedDates[evento.data] = { marked: true, dotColor: "#6200ee" };
  });

  const handleDayPress = (day: DateData) => {
    if (!user?.id) return;

    setHighlightedDate(day.dateString);

    const eventosDoDia = eventos.filter(e => e.data === day.dateString);

    if (eventosDoDia.length > 0) {
      // Existem eventos → abrir detalhes
      router.push({
        pathname: "../../eventDetail",
        params: { eventos: JSON.stringify(eventosDoDia) },
      });
    } else {
      // Nenhum evento → decidir pelo role
      if (user.tipo === "ADMIN") {
        router.push({
          pathname: "../../event",
          params: { data: day.dateString },
        });
      } else {
        router.push({
          pathname: "../../eventDetail",
          params: { eventos: JSON.stringify([]) }, // sem eventos
        });
      }
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos UMADECRUZ</Text>
      <Calendar
        hideExtraDays={false}
        showWeekNumbers={false}
        firstDay={1}
        enableSwipeMonths={true}
        markedDates={markedDates}
        theme={{
          todayTextColor: "#6200ee",
          selectedDayBackgroundColor: "#6200ee",
          monthTextColor: "#6200ee",
          arrowColor: "#6200ee",
          textDayFontSize: 18,
          textDayHeaderFontSize: 16,
          textMonthFontSize: 22,
          textDisabledColor: "#d9e1e8",
        }}
        dayComponent={({ date, state, marking }) => {
          if (!date) return null;
          const isHighlighted = date.dateString === highlightedDate;
          const hasEvento = marking?.marked;

          let backgroundColor = "transparent";
          let borderColor = "transparent";
          let textColor = "#000";

          if (hasEvento) {
            backgroundColor = "#6200ee";
            textColor = "#fff";
          } else if (isHighlighted) {
            borderColor = "#6200ee";
            textColor = "#000";
          } else if (state === "disabled") {
            textColor = "#d9e1e8";
          }

          return (
            <Pressable
              onPress={() => handleDayPress(date)}
              style={{
                height: cellHeight,
                width: width / 7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {(hasEvento || isHighlighted) && (
                <View
                  style={{
                    position: "absolute",
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: hasEvento ? backgroundColor : "transparent",
                    borderWidth: isHighlighted && !hasEvento ? 2 : 0,
                    borderColor: isHighlighted && !hasEvento ? borderColor : "transparent",
                  }}
                />
              )}
              <Text
                style={{
                  color: textColor,
                  fontSize: 16,
                  textAlign: "center",
                  zIndex: 1,
                }}
              >
                {date.day}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#6200ee",
  },
});
