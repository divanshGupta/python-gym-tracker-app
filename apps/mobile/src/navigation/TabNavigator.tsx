import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../theme/tokens";
import { ExerciseLibraryScreen } from "../screens/exercise/ExerciseLibraryScreen";
import { WorkoutHistoryScreen } from "../screens/history/WorkoutHistoryScreen";
import { ProgressScreen } from "../screens/progress/ProgressScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export const TabNavigator = (): JSX.Element => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: "#1C1C1E",
        borderTopColor: "#2C2C2E" as const,
        borderTopWidth: 0.5,
        height: 68,
        paddingTop: 8,
        paddingBottom: 12,
      } as const,
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: "500",
      },
      tabBarActiveTintColor: (tokens?.colors?.accent as string) || "#7C5CFC",
      tabBarInactiveTintColor: (tokens?.colors?.textSecondary as string) || "#636366",
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          Dashboard: "home-outline",
          Workout: "dumbbell-outline",
          Exercises: "barbell-outline",
          Progress: "stats-chart-outline",
          Profile: "person-outline",
        };
        return (
          <Ionicons
            name={icons[route.name] as any}
            size={22}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        title: "Dashboard",
      }}
    />
    <Tab.Screen
      name="Workout"
      component={WorkoutHistoryScreen}
      options={{
        title: "Workout",
      }}
    />
    <Tab.Screen
      name="Exercises"
      component={ExerciseLibraryScreen}
      options={{
        title: "Exercises",
      }}
    />
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{
        title: "Progress",
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: "Profile",
      }}
    />
  </Tab.Navigator>
);
