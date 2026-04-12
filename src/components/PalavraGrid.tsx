import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

/* =========================
   LETRA CELL
========================= */

function LetraCell({ char, status, revealed, index }: any) {
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    if (revealed) {
      rotate.value = withDelay(
        index * 120,
        withTiming(180, { duration: 400 })
      );
    } else {
      rotate.value = 0;
    }
  }, [revealed]);

  const frontStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotate.value}deg` },
      ],
      opacity: rotate.value < 90 ? 1 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotate.value + 180}deg` },
      ],
      opacity: rotate.value >= 90 ? 1 : 0,
    };
  });

  const backgroundColor = revealed
    ? getColor(status)
    : '#1a1a1a';

  return (
    <View style={styles.cellWrapper}>
      {/* Frente */}
      <Animated.View style={[styles.cell, frontStyle]}>
        <Text style={styles.cellText}>{char}</Text>
      </Animated.View>

      {/* Verso */}
      <Animated.View
        style={[
          styles.cell,
          styles.cellBack,
          { backgroundColor },
          backStyle,
        ]}
      >
        <Text style={styles.cellText}>{char}</Text>
      </Animated.View>
    </View>
  );
}

/* =========================
   ROW
========================= */

function PalavraRow({
  palavra,
  feedback,
  palavraLength,
  currentInput,
  isActive,
}: any) {
  const isFilled = !!palavra;

  return (
    <View style={styles.row}>
      {Array.from({ length: palavraLength }).map((_, index) => {
        const char = isActive
          ? currentInput[index] || ''
          : palavra?.[index] || '';

        const status = isFilled ? feedback?.[index] : undefined;

        return (
          <LetraCell
            key={index}
            char={char}
            status={status}
            revealed={isFilled}
            index={index}
          />
        );
      })}
    </View>
  );
}

/* =========================
   GRID
========================= */

export function PalavraGrid({
  respostas,
  tentativas,
  feedbacks,
  palavraLength,
  maxTentativas,
  currentInput,
}: any) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: maxTentativas }).map((_, rowIndex) => {
        const palavra = respostas[rowIndex];
        const feedback = feedbacks?.[rowIndex];

        const isCurrent = rowIndex === respostas.length;

        return (
          <PalavraRow
            key={rowIndex}
            palavra={palavra}
            feedback={feedback}
            palavraLength={palavraLength}
            currentInput={isCurrent ? currentInput : ''}
            isActive={isCurrent}
          />
        );
      })}
    </View>
  );
}

/* =========================
   COLORS
========================= */

function getColor(status?: string) {
  switch (status) {
    case 'correto':
      return '#22c55e'; // verde
    case 'perto':
      return '#eab308'; // amarelo
    case 'errado':
      return '#3f3f46'; // cinza
    default:
      return 'transparent';
  }
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  grid: {
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  activeRow: {
    opacity: 1,
  },

  inactiveRow: {
    opacity: 0.6,
  },

  cellWrapper: {
    width: 56,
    height: 56,
  },

  cell: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },

  cellBack: {
    borderColor: 'transparent',
  },

  cellText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});