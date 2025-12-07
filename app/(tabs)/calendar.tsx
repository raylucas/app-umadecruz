import { View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Calendar
        onDayPress={(day) => alert(day.dateString)}
        theme={{
          todayTextColor: "#6200ee",
          selectedDayBackgroundColor: "#6200ee",
        }}
      />
    </View>
  );
}
