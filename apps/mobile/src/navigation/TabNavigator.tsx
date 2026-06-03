import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../theme/tokens";
import { ExerciseLibraryScreen } from "../screens/exercise/ExerciseLibraryScreen";
import { WorkoutHistoryScreen } from "../screens/history/WorkoutHistoryScreen";
import ProgressScreen  from "../screens/progress/ProgressScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export const TabNavigator = (): React.JSX.Element => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: "#1C1C1E",
        borderTopColor: "#2C2C2E" as const,
        borderTopWidth: 1,
        height: 80,
        paddingTop: 8,
        paddingBottom: 16,
      } as const,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "500",
      },
      tabBarActiveTintColor: (tokens?.colors?.accent as string) || "#7C5CFC",
      tabBarInactiveTintColor: (tokens?.colors?.textSecondary as string) || "#636366",
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => {
        const icons: Record<string, string> = { 
          Dashboard: focused ? "home" : "home-outline",
          Workout: focused ? "fitness" : "fitness-outline",
          Exercises: focused ? "barbell" : "barbell-outline",
          Progress: focused ? "stats-chart" : "stats-chart-outline",
          Profile: focused ? "person" : "person-outline",
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
        title: "Workouts",
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
