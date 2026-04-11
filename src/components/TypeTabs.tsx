import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TypeTabs = ({ tipos, selecionado, onSelect }: any) => {
  return (
    <View style={styles.container}>
      {tipos.map((tipo: string) => (
        <Text
          key={tipo}
          onPress={() => onSelect(tipo)}
          style={[
            styles.tab,
            selecionado === tipo && styles.active,
          ]}
        >
          {tipo}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  tab: {
    color: '#888',
    padding: 8,
  },
  active: {
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
});