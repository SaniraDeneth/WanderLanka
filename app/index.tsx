import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-mint p-6">
      <Text className="text-7xl font-bebas text-brand-black tracking-wider">
        Wander<Text className="text-brand-green">Lanka</Text>
      </Text>
      <Text className="text-lg font-montserrat text-brand-evergreen mt-2 text-center">
        Explore Sri Lanka's beautiful destinations
      </Text>
    </View>
  );
}

