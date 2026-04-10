import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export type CellStatus = 'correct' | 'close' | 'wrong';

interface ResultGridProps {
  /** Each row is an array of cell statuses */
  rows: CellStatus[][];
  guesses: string[][];
}

const cellColor: Record<CellStatus, string> = {
  correct: Colors.accent,
  close: Colors.yellow,
  wrong: Colors.gray,
};

export const ResultGrid: React.FC<ResultGridProps> = ({ rows, guesses }) => (
  <View style={styles.container}>
    {rows.map((row, ri) => (
      <View key={ri} style={styles.row}>
        {row.map((status, ci) => (
          <View key={ci} style={[styles.cell, { backgroundColor: cellColor[status] }]}>
            <Text style={styles.cellText}>{guesses[ri]?.[ci] ?? ''}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
    alignItems: 'center',
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
