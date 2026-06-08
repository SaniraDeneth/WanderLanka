import React from "react";
import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export default function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="font-bebas text-2xl text-brand-black">
        {title}
      </Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} className="active:opacity-60 py-1">
          <Text className="font-montserrat-bold text-[10px] text-gray-400 uppercase tracking-widest">
            SEE ALL
          </Text>
        </Pressable>
      )}
    </View>
  );
}
