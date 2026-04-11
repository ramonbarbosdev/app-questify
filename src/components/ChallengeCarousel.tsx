import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export const ChallengeCarousel = ({
  desafios,
  selecionadoId,
  onSelect,
}: any) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {desafios.map((d: any) => {
        const isSelected = d.idDesafio === selecionadoId;

        return (
          <TouchableOpacity
            key={d.idDesafio}
            onPress={() => onSelect(d)}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
            ]}
          >
            <Text style={styles.title}>
              {d.dsPergunta || `Desafio ${d.idDesafio}`}
            </Text>

            {d.respondido && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 180,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#00ffcc',
  },
  title: {
    color: '#fff',
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00ffcc',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
  },
});