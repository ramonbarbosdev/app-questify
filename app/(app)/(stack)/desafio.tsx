import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/src/theme/colors';
import { useJogoStore } from '@/src/store/jogoStore';
import DesafioRenderer from '@/src/components/desafio/DesafioRenderer';
import HeaderHome from '@/src/components/HeaderHome';

export default function DesafioScreen() {
  const desafioAtual = useJogoStore((s) => s.desafioAtual);

  useEffect(() => {
    if (!desafioAtual) {
      router.replace('/start');
    }
  }, [desafioAtual]);


  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 20;

    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
  }, [desafioAtual]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!desafioAtual) return null;

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.topBar}>
        <HeaderHome />

        <Pressable
          style={styles.menuButton}
          onPress={() => router.replace('/menu')}
        >
          <Text style={styles.menuText}>Sair</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.content, animatedStyle]}>
        <DesafioRenderer
          tipo={desafioAtual.tpDesafio}
          pergunta={desafioAtual.dsPergunta}
        />
      </Animated.View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  topBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

menuButton: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 10,
},

menuText: {
  color: Colors.secondary,
  fontSize: 13,
},
});