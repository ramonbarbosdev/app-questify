import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusJogo } from '../types/StatusJogo';
import { Colors } from '@/src/theme/colors';

interface Props {
  rows: StatusJogo[][];
  guesses: string[][];
  correctIndex?: number;
}

const statusColor: Record<StatusJogo, string> = {
  pendente: Colors.gray,
  correto: Colors.accent,
  perto: Colors.yellow,
  errado: Colors.error,
  fechado: Colors.gray,
  alto: Colors.gray,
  baixo: Colors.gray,
};

export const ResultGrid: React.FC<Props> = ({
  rows,
  guesses,
  correctIndex,
}) => {
  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((cell, j) => (
            <View
              key={j}
              style={[
                styles.cell,
                { backgroundColor: statusColor[cell] },
                i === correctIndex && styles.correctRow,
              ]}
            >
              <Text style={styles.letter}>
                {guesses[i]?.[j] || ''}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 8,
    marginTop: 16,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },

  cell: {
    width: 52,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  correctRow: {
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },

  letter: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
});