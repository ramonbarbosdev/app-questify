import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';
import { StatusJogo } from '../types/StatusJogo';

interface IndicatorTentativaProps {

  tentativas: StatusJogo[];
  maxTentativas: number;
}

const statusColor: Record<StatusJogo, string> = {
  pendente: Colors.gray,
  correto: Colors.accent,
  perto: Colors.yellow,
  errado: Colors.error,
  fechado: Colors.gray,
};

const normalizarStatus = (status: any): StatusJogo => {
  if (status === 'correto') return 'correto';
  if (status === 'perto') return 'perto';
  if (status === 'errado') return 'errado';
  return 'pendente';
};

export const IndicatorTentativa: React.FC<IndicatorTentativaProps> = ({
  tentativas,
  maxTentativas,
}) => {

  const dots: StatusJogo[] = Array.from(
    { length: maxTentativas },
    (_, i) => normalizarStatus(tentativas[i])
  );

  return (
    <View style={styles.container}>
      {dots.map((status, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: statusColor[status] },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
});