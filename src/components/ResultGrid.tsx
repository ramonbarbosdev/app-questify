import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusJogo } from '../types/StatusJogo';


interface Props {
  rows: StatusJogo[][];
  guesses: string[][];
}

const statusColor: Record<StatusJogo, string> = {
  pendente: Colors.gray,
  correto: Colors.accent,
  perto: Colors.yellow,
  errado: Colors.error,
  fechado: Colors.gray,
};

export const ResultGrid: React.FC<Props> = ({ rows, guesses }) => {
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
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});