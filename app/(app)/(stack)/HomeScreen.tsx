import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '@/src/theme/colors';
import { ChallengeCard } from '@/src/components/ChallengeCard';
import { AnswerInput } from '@/src/components/AnswerInput';
import { AttemptIndicator, AttemptStatus } from '@/src/components/AttemptIndicator';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderHome from '@/src/components/HeaderHome';
const MAX_ATTEMPTS = 5;

// Example challenge — replace with real logic / API
const DAILY_CHALLENGE = {
  text: '2 → 6 → 7 → 21 → ?',
  answer: '22',
};

interface HomeScreenProps {
  onFinish: (attempts: AttemptStatus[], guesses: string[]) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onFinish }) => {
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState<AttemptStatus[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);

  const handleCheck = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const isCorrect = trimmed === DAILY_CHALLENGE.answer;
    const isClose =
      !isCorrect &&
      Math.abs(Number(trimmed) - Number(DAILY_CHALLENGE.answer)) <= 2;

    const status: AttemptStatus = isCorrect
      ? 'correct'
      : isClose
      ? 'close'
      : 'wrong';

    const newAttempts = [...attempts, status];
    const newGuesses = [...guesses, trimmed];

    setAttempts(newAttempts);
    setGuesses(newGuesses);
    setInput('');

    if (isCorrect || newAttempts.length >= MAX_ATTEMPTS) {
      setTimeout(() => onFinish(newAttempts, newGuesses), 600);
    }
  };

  const isFinished = attempts.includes('correct') || attempts.length >= MAX_ATTEMPTS;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderHome></HeaderHome>

        <View style={styles.center}>
          <ChallengeCard
            challenge={DAILY_CHALLENGE.text}
            subtitle="Encontre o próximo número"
          />
          <AttemptIndicator attempts={attempts} maxAttempts={MAX_ATTEMPTS} />
        </View>

        <View style={styles.bottom}>
          <AnswerInput
            value={input}
            onChangeText={setInput}
            onSubmit={handleCheck}
            disabled={isFinished}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
 
 

  center: {
    flex: 1,
    justifyContent: 'center',
  },
  bottom: {
    paddingTop: 8,
  },
});
