import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "@gymtracker/stores";
import { TabNavigator } from "./TabNavigator";
// ==================== Screens ========================
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { LogWorkoutScreen } from "../screens/workout/LogWorkoutScreen";
import { WorkoutDetailScreen } from "../screens/workout/WorkoutDetailScreen";

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {/* Main tabs */}
            <Stack.Screen name="Main" component={TabNavigator} 
              options={{
                animation: "slide_from_right",
              }}/>

            {/* Screens that push over the tab bar */}
            <Stack.Screen 
              name="Log" 
              component={LogWorkoutScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="WorkoutDetail"
              component={WorkoutDetailScreen}
              options={{
                animation: "slide_from_right",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};