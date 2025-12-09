import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

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
LocaleConfig.defaultLocale = "pt-br"; // define o padrão PT-BR

export default function CalendarScreen() {
  const router = useRouter();
  const { user } = useUser();

  const handleDayPress = (day: { dateString: string }) => {
    if (!user?.id) {
      alert("Usuário não encontrado");
      return;
    }

    router.push({
      pathname: "../event",
      params: { data: day.dateString },
    });
  };

  const { height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        style={{ height }}
        hideExtraDays={true} // mostra os dias do mês anterior/próximo
        showWeekNumbers={false} // opcional, pode ativar se quiser números da semana
        firstDay={1} // semana começa na segunda
        enableSwipeMonths={true}
        theme={{
          todayTextColor: "#6200ee",
          selectedDayBackgroundColor: "#6200ee",
          monthTextColor: "#6200ee",
          arrowColor: "#6200ee",
          textDayFontSize: 16,
          textMonthFontSize: 22,
          textDayHeaderFontSize: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
