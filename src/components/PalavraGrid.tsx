import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

/* =========================
   RESPONSIVO
========================= */

const screenWidth = Dimensions.get('window').width;

function getCellSize(palavraLength: number) {
  const paddingHorizontal = 32;

  const gap = palavraLength > 8 ? 4 : 8;

  const totalGap = (palavraLength - 1) * gap;
  const availableWidth = screenWidth - paddingHorizontal - totalGap;

  const size = Math.floor(availableWidth / palavraLength);

  // limites pra não ficar ridículo
  return Math.min(64, Math.max(32, size));
}

function getGap(palavraLength: number) {
  return palavraLength > 8 ? 4 : 8;
}

/* =========================
   LETRA CELL
========================= */

function LetraCell({ char, status, revealed, index, size }: any) {
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
    <View style={{ width: size, height: size }}>
      {/* Frente */}
      <Animated.View style={[styles.cell, frontStyle]}>
        <Text style={[styles.cellText, { fontSize: size * 0.45 }]}>
          {char}
        </Text>
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
        <Text style={[styles.cellText, { fontSize: size * 0.45 }]}>
          {char}
        </Text>
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

  const cellSize = getCellSize(palavraLength);
  const gap = getGap(palavraLength);

  return (
    <View style={[styles.row, { gap }]}>
      {Array.from({ length: palavraLength }).map((_, index) => {
        const char = isFilled
          ? palavra[index]
          : isActive
            ? currentInput[index] || ''
            : '';

        const status = isFilled ? feedback?.[index] : undefined;

        return (
          <LetraCell
            key={index}
            char={char}
            status={status}
            revealed={isFilled}
            index={index}
            size={cellSize}
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
      return '#22c55e';
    case 'perto':
      return '#eab308';
    case 'errado':
      return '#3f3f46';
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
    fontWeight: '700',
  },
});