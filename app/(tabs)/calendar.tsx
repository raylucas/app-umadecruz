import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

// Configuração PT-BR
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ],
  monthNamesShort: [
    "Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"
  ],
  dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  today: "Hoje"
};
LocaleConfig.defaultLocale = "pt-br";

export default function CalendarScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { height, width } = Dimensions.get("window");
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  const numRows = 6; // 6 semanas por mês
  const cellHeight = height / (numRows + 3);

  const handleDayPress = (day: DateData) => {
    if (!user?.id) {
      alert("Usuário não encontrado");
      return;
    }

    // Atualiza destaque imediato
    setHighlightedDate(day.dateString);

    // Vai para a tela de evento
    router.push({
      pathname: "../event",
      params: { data: day.dateString },
    });
  };

  return (
    <View style={styles.container}>
      <Calendar
        hideExtraDays={false}
        showWeekNumbers={false}
        firstDay={1}
        enableSwipeMonths={true}
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

          const isSelected = marking?.selected;
          const isHighlighted = date.dateString === highlightedDate;

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
              {/* Círculo de destaque do dia selecionado */}
              {isSelected && (
                <View
                  style={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#6200ee",
                  }}
                />
              )}

              {/* Círculo rápido de feedback visual */}
              {!isSelected && isHighlighted && (
                <View
                  style={{
                    position: "absolute",
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    borderWidth: 2,
                    borderColor: "#6200ee",
                  }}
                />
              )}

              <Text
                style={{
                  color: state === "disabled" ? "#d9e1e8" : isSelected || isHighlighted ? "#6200ee" : "#000",
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
  container: {
    flex: 1,
  },
});
