import * as Notifications from "expo-notifications";

const ALERTS_POOL = [
  {
    title: "Adventure Awaits 🌴",
    body: "Ready to explore? Open WanderLanka to find nearby destinations!"
  },
  {
    title: "Sigiriya, Ella, Galle? 🚗",
    body: "Your bookmarks are waiting. Plan your next stop now!"
  },
  {
    title: "Traveler Tip 💡",
    body: "The best travel days are sunny. Open the map to check out spots nearby."
  },
  {
    title: "Time for a Road Trip? 🎒",
    body: "Discover hidden gems in Sri Lanka. Where are you heading next?"
  },
  {
    title: "Missing the Outdoors? ⛰️",
    body: "Take a virtual tour of Sri Lankan waterfalls in WanderLanka."
  }
];

export const notificationService = {
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    return finalStatus === "granted";
  },

  async scheduleRandomEngagementAlerts() {
    // 1. Cancel previous scheduled alerts to avoid spamming the user
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 2. Shuffle alerts
    const shuffled = [...ALERTS_POOL].sort(() => 0.5 - Math.random());

    // 3. Schedule first alert after 24 hours
    await Notifications.scheduleNotificationAsync({
      content: {
        title: shuffled[0].title,
        body: shuffled[0].body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 24, //24 hours
      },
    });

    // 4. Schedule second alert after 48 hours
    await Notifications.scheduleNotificationAsync({
      content: {
        title: shuffled[1].title,
        body: shuffled[1].body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 48, //48 hours
      },
    });
  },

  // Helper method for testing notifications instantly
  async triggerInstantTestAlert() {
    const shuffled = [...ALERTS_POOL].sort(() => 0.5 - Math.random());
    await Notifications.scheduleNotificationAsync({
      content: {
        title: shuffled[0].title,
        body: shuffled[0].body,
      },
      trigger: null, // trigger immediately
    });
  }
};
