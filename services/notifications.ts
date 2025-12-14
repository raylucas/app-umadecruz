import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permissão negada para notificações");
    return null;
  }

  const tokenResponse = await Notifications.getDevicePushTokenAsync();
  console.log("🔥 FCM TOKEN:", tokenResponse.data);

  return tokenResponse.data;
}