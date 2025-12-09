import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingBottom: Math.max(insets.bottom, 10),
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <MaterialIcons name="home" size={24} />,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Eventos",
          tabBarIcon: () => <MaterialIcons name="calendar-today" size={24} />,
        }}
      />

      <Tabs.Screen
        name="alert"
        options={{
          title: "Avisos",
          tabBarIcon: () => <MaterialIcons name="notification-important" size={24} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      

    </Tabs>
  );
}
