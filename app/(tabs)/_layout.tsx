import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from "react";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabsLayout() {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        lazy: true,
        swipeEnabled: true,
        tabBarActiveTintColor: "#228B22",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowIcon: true,
        tabBarIndicatorStyle: {
          height: 0,
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: "#F0FAF0",
          borderTopColor: "#F3F4F6",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "BebasNeue_400Regular",
          fontSize: 14,
          textTransform: "uppercase",
          margin: 0,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={22} color={color} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={22} color={color} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} style={{ marginTop: -4 }} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={22} color={color} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}
