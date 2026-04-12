import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';

import { useDesafio } from '@/src/hooks/useDesafio';
import { Colors } from '@/src/theme/colors';
import { useJogoStore } from '@/src/store/jogoStore';
import { desafioService } from '@/src/services/desafioService';

export default function Menu() {
  const [desafios, setDesafios] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const setDesafioAtual = useJogoStore((s) => s.setDesafioAtual);
  const setResultado = useJogoStore((s) => s.setResultado);

  const carregar = async () => {
    const lista = await desafioService.buscarDesafio('');
    setDesafios(lista);
  };

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => carregar(), 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  const handleSelecionar = (d: any) => {
    setDesafioAtual(d);

    const tentativas = d?.resultado?.tentativas || [];
    const respostas = d?.resultado?.respostas || [];

    setResultado(tentativas, respostas);

    if (d.respondido) {
      router.push('/result');
      return;
    }

    router.push('/desafio');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Desafios do dia</Text>

      {desafios.map((d) => (
        <Pressable
          key={d.idDesafio}
          style={styles.card}
          onPress={() => handleSelecionar(d)}
        >
          <Text style={styles.pergunta}>{d.dsPergunta}</Text>

          {d.respondido && (
            <Text style={styles.badge}>✔ Respondido</Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  pergunta: {
    color: '#fff',
    fontSize: 16,
  },
  badge: {
    color: '#4caf50',
    marginTop: 8,
  },
});