import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Home from "./Screens/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider
      style={{
        // height:'100%',
        // marginVertical:20

      }}
    >
      <Home />
      <StatusBar style="inverted" />
    </SafeAreaProvider>
  );
}
