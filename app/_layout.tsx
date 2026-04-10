import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./(app)/(stack)/HomeScreen";
import { AttemptStatus } from "@/src/components/AttemptIndicator";
type Screen = 'home' | 'result';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ResultScreen } from "./(app)/(stack)/ResultScreen";

export default function RootLayout() {

  const [screen, setScreen] = useState<Screen>('home');
  const [attempts, setAttempts] = useState<AttemptStatus[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);


  const handleFinish = useCallback((a: AttemptStatus[], g: string[]) => {
    setAttempts(a);
    setGuesses(g);
    setScreen('result');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setAttempts([]);
    setGuesses([]);
    setScreen('home');
  }, []);

  return (

      <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />

      {screen === 'home' ? (
        <HomeScreen onFinish={handleFinish} />
      ) : (
        <ResultScreen
          attempts={attempts}
          guesses={guesses}
          onPlayAgain={handlePlayAgain}
        />

      )}
    </GestureHandlerRootView>
  );
}
