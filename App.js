import "react-native-gesture-handler";
import * as React from 'react';
import { UtilsProvider } from "./context/UtilsContext";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <UtilsProvider>
      <StackNavigator />
    </UtilsProvider>
  );
}

