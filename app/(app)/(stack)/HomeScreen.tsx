import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderHome from '@/src/components/HeaderHome';
import { ChallengeCard } from '@/src/components/ChallengeCard';
import { AnswerInput } from '@/src/components/AnswerInput';
import {
  AttemptIndicator,
  AttemptStatus,
} from '@/src/components/AttemptIndicator';
import { TypeTabs } from '@/src/components/TypeTabs';
import { ChallengeCarousel } from '@/src/components/ChallengeCarousel';

import { api } from '@/src/api/api';
import { mapearFeedback } from '@/src/utils/mapearFeedback';
import { getApiErrorMessage } from '@/src/types/ApiErrorMessage';
import { Colors } from '@/src/theme/colors';

import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const MAX_ATTEMPTS = 5;

type ViewMode = 'LIST' | 'DETAIL';

export const HomeScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');

  const [desafios, setDesafios] = useState<any[]>([]);
  const [desafiosPorTipo, setDesafiosPorTipo] = useState<Record<string, any[]>>(
    {}
  );

  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [desafioAtual, setDesafioAtual] = useState<any>(null);

  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState<AttemptStatus[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    carregarDesafios();
  }, []);

  const agruparPorTipo = (lista: any[]) => {
    return lista.reduce((acc, d) => {
      const tipo = d.tpDesafio;
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(d);
      return acc;
    }, {} as Record<string, any[]>);
  };

  const carregarDesafios = async () => {
    try {
      const res = await api.get('/desafio/ativos');
      const data = res.data;

      const desafiosComStatus = await Promise.all(
        data.map(async (d: any) => {
          try {
            const status = await api.get(`/resultado/status/${d.idDesafio}`);
            return {
              ...d,
              respondido: status.data.respondido,
            };
          } catch {
            return { ...d, respondido: false };
          }
        })
      );

      setDesafios(desafiosComStatus);

      const agrupado = agruparPorTipo(desafiosComStatus);
      setDesafiosPorTipo(agrupado);

      // 🔥 auto open se só tiver 1
      if (desafiosComStatus.length === 1) {
        setDesafioAtual(desafiosComStatus[0]);
        setViewMode('DETAIL');
        return;
      }

      const primeiroTipo = Object.keys(agrupado)[0];
      setTipoSelecionado(primeiroTipo);
    } catch (e) {
      setErrorMessage(getApiErrorMessage(e));
    }
  };

  const handleCheck = async () => {
    const trimmed = input.trim();
    if (!trimmed || !desafioAtual) return;

    try {
      const res = await api.post('/resultado/resposta', {
        idDesafio: desafioAtual.idDesafio,
        dsResposta: trimmed,
        idDispositivo: 'device-123',
      });

      const data = res.data;

      const status: AttemptStatus = data.sucesso
        ? 'correct'
        : mapearFeedback(data.feedback);

      const newAttempts = [...attempts, status];
      const newGuesses = [...guesses, trimmed];

      setAttempts(newAttempts);
      setGuesses(newGuesses);
      setInput('');

      if (data.sucesso || newAttempts.length >= MAX_ATTEMPTS) {
        setTimeout(() => {
          setAttempts([]);
          setGuesses([]);
        }, 600);
      }
    } catch (e: any) {
      setErrorMessage(getApiErrorMessage(e));
    }
  };

  const isFinished =
    attempts.includes('correct') || attempts.length >= MAX_ATTEMPTS;

  // ======================
  // 🟣 LIST VIEW
  // ======================
  const renderList = () => (
    <View style={styles.center}>
      <TypeTabs
        tipos={Object.keys(desafiosPorTipo)}
        selecionado={tipoSelecionado}
        onSelect={(tipo: string) => setTipoSelecionado(tipo)}
      />

      <ChallengeCarousel
        desafios={desafiosPorTipo[tipoSelecionado || ''] || []}
        selecionadoId={null}
        onSelect={(d: any) => {
          setDesafioAtual(d);
          setAttempts([]);
          setGuesses([]);
          setViewMode('DETAIL');
        }}
      />
    </View>
  );

  // ======================
  // 🔵 DETAIL VIEW
  // ======================
  const renderDetail = () => (
    <View style={styles.center}>

      <Animated.View
        key={desafioAtual.idDesafio}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        <ChallengeCard
          challenge={desafioAtual.dsPergunta || '...'}
          subtitle="Resolva o desafio"
        />
      </Animated.View>

      <AttemptIndicator attempts={attempts} maxAttempts={MAX_ATTEMPTS} />

      {errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      <AnswerInput
        value={input}
        onChangeText={setInput}
        onSubmit={handleCheck}
        disabled={isFinished}
      />

      <Pressable
        onPress={() => setViewMode('LIST')}
        style={[
          styles.button,
        ]}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>
    </View>
  );

  if (!desafios.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderHome />

        {viewMode === 'LIST' ? renderList() : renderDetail()}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  loading: {
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 40,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  back: {
    color: Colors.button,
    fontSize: 14,
  },
    button: {
    backgroundColor: Colors.transparent,
    alignItems: 'center',
  },
    buttonText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});