import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusJogo } from '../types/StatusJogo';
import { statusColorMap } from '../utils/statusColorMap';

interface Props {
  tentativas: StatusJogo[];
  maxTentativas: number;
}

export const IndicatorTentativa: React.FC<Props> = ({
  tentativas,
  maxTentativas,
}) => {

  // 🔥 padding automático com pendente
  const dots: StatusJogo[] = Array.from(
    { length: maxTentativas },
    (_, i) => tentativas[i] ?? 'pendente'
  );

  return (
    <View style={styles.container}>
      {dots.map((status, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: statusColorMap[status] },
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