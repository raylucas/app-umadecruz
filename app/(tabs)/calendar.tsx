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
LocaleConfig.defaultLocale = "pt-br"; // define PT-BR como padrão

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
        hideExtraDays={false} // mostra dias do mês anterior/próximo
        showWeekNumbers={false}
        firstDay={1} // semana começa na segunda
        enableSwipeMonths={true}
        theme={{
          todayTextColor: "#6200ee",
          selectedDayBackgroundColor: "#6200ee",
          monthTextColor: "#6200ee",
          arrowColor: "#6200ee",
          textDayFontSize: 22,       // aumenta tamanho dos números do dia
          textDayHeaderFontSize: 18, // aumenta tamanho do cabeçalho dias da semana
          textMonthFontSize: 24,     // aumenta tamanho do mês/ano no topo
          textDisabledColor: "#d9e1e8",
          textSectionTitleColor: "#6200ee",
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
