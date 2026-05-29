import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../theme/tokens";
import { LogWorkoutScreen } from "../screens/workout/LogWorkoutScreen";
import { ExerciseLibraryScreen } from "../screens/exercise/ExerciseLibraryScreen";
import { WorkoutHistoryScreen } from "../screens/history/WorkoutHistoryScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions= {({ route }) => ({
      tabBarStyle: { 
        backgroundColor: "#1C1C1E",
        borderTopColor: "#2C2C2E",
        borderTopWidth: 0.5,
        height: 68,
        paddingTop: 8,
        paddingBottom: 12, 
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: "500",
      },
      tabBarActiveTintColor: tokens.colors.accent,
      tabBarInactiveTintColor: tokens.colors.textSecondary,
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Dashboard: "home-outline",
          Log: "add-circle-outline",
          Exercises: "barbell-outline",
          History: "time-outline",
          Profile: "person-outline"
        }
        return (
          <Ionicons
            name={icons[route.name] as any}
            size={22}
            color={color}
          />
        )
      }
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Log" component={LogWorkoutScreen} />
    <Tab.Screen name="Exercises" component={ExerciseLibraryScreen} />
    <Tab.Screen name="History" component={WorkoutHistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);