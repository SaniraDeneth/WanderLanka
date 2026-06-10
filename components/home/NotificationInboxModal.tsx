import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useNotificationStore } from "../../store/useNotificationStore";

interface NotificationInboxModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationInboxModal({
  visible,
  onClose,
}: NotificationInboxModalProps) {
  const { notifications, markAllAsRead, clearAll } = useNotificationStore();

  useEffect(() => {
    if (visible) {
      // Mark notifications as read when the user opens the modal
      markAllAsRead();
    }
  }, [visible]);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "JUST NOW";
    if (mins < 60) return `${mins}M AGO`;
    if (hours < 24) return `${hours}H AGO`;
    return `${days}D AGO`;
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-[36px] px-6 pt-4 pb-8 w-full shadow-2xl h-[85%]"
          onPress={(e: any) => e.stopPropagation()}
        >
          {/* Drag Handle Indicator */}
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {/* Modal Title Bar */}
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="font-bebas text-3xl text-brand-black">INBOX</Text>
              <Text className="font-montserrat-bold text-[10px] text-brand-green tracking-wider uppercase mt-1">
                YOUR TRAVEL ALERTS
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={16} color="#4B5563" />
            </Pressable>
          </View>

          {/* Scrollable Notifications list */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-4">
            {notifications.length > 0 ? (
              notifications.map((item, idx) => (
                <View key={item.id}>
                  <View className="flex-row items-start py-2">
                    {/* Unread Dot indicator */}
                    {!item.read && (
                      <View className="w-2 h-2 rounded-full bg-red-500 mr-2.5 mt-2" />
                    )}
                    <View className="flex-1 pl-1">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-montserrat-bold text-[13px] text-brand-black leading-snug">
                          {item.title}
                        </Text>
                        <Text className="font-montserrat text-[9px] text-gray-400">
                          {formatTime(item.timestamp)}
                        </Text>
                      </View>
                      <Text className="font-montserrat text-xs text-gray-500 mt-1 leading-relaxed">
                        {item.body}
                      </Text>
                    </View>
                  </View>
                  {idx < notifications.length - 1 && (
                    <View className="h-[1px] bg-gray-150 my-3" />
                  )}
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-16">
                <Ionicons name="notifications-off-outline" size={40} color="#D1D5DB" />
                <Text className="font-montserrat-bold text-xs text-gray-400 uppercase tracking-widest mt-4">
                  Inbox is empty
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Clear All Footer */}
          {notifications.length > 0 && (
            <View className="border-t border-gray-100 pt-4">
              <Pressable
                onPress={clearAll}
                className="bg-red-50 border border-red-100 py-3.5 rounded-2xl items-center justify-center active:scale-[0.98]"
              >
                <Text className="font-bebas text-lg text-red-500 tracking-wider">CLEAR ALL ALERTS</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
