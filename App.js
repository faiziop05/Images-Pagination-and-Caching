import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./Screens/Home";
export default function App() {
  return (
    <View style={{flex:1}}>
      <Home />
      <StatusBar style="auto" />
    </View>
  );
}
