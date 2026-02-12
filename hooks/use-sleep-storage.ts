import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepRecord, SleepState } from '@/types/sleep';

const STORAGE_KEY_RECORDS = '@sleeptracker:records';
const STORAGE_KEY_STATE = '@sleeptracker:state';

/**
 * Hook para gerenciar armazenamento local de registros de sono
 */
export function useSleepStorage() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [sleepState, setSleepState] = useState<SleepState>({
    isSleeping: false,
    currentSleepStart: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carrega registros e estado do AsyncStorage
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar registros
      const recordsJson = await AsyncStorage.getItem(STORAGE_KEY_RECORDS);
      if (recordsJson) {
        const loadedRecords = JSON.parse(recordsJson) as SleepRecord[];
        setRecords(loadedRecords);
      }

      // Carregar estado
      const stateJson = await AsyncStorage.getItem(STORAGE_KEY_STATE);
      if (stateJson) {
        const loadedState = JSON.parse(stateJson) as SleepState;
        setSleepState(loadedState);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Salva registros no AsyncStorage
   */
  const saveRecords = async (newRecords: SleepRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Erro ao salvar registros:', error);
      throw error;
    }
  };

  /**
   * Salva estado no AsyncStorage
   */
  const saveState = async (newState: SleepState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(newState));
      setSleepState(newState);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
      throw error;
    }
  };

  /**
   * Inicia um novo registro de sono
   */
  const startSleep = useCallback(async () => {
    const newState: SleepState = {
      isSleeping: true,
      currentSleepStart: new Date().toISOString(),
    };
    await saveState(newState);
  }, []);

  /**
   * Finaliza o registro de sono atual e salva
   */
  const endSleep = useCallback(async () => {
    if (!sleepState.isSleeping || !sleepState.currentSleepStart) {
      throw new Error('Não há sono em andamento');
    }

    const endTime = new Date();
    const startTime = new Date(sleepState.currentSleepStart);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    const newRecord: SleepRecord = {
      id: startTime.getTime().toString(),
      startTime: sleepState.currentSleepStart,
      endTime: endTime.toISOString(),
      durationMinutes,
    };

    // Adicionar novo registro ao início da lista (mais recente primeiro)
    const updatedRecords = [newRecord, ...records];
    await saveRecords(updatedRecords);

    // Resetar estado
    const newState: SleepState = {
      isSleeping: false,
      currentSleepStart: null,
    };
    await saveState(newState);

    return newRecord;
  }, [sleepState, records]);

  /**
   * Adiciona um novo registro manualmente
   */
  const addRecord = useCallback(async (record: SleepRecord) => {
    const updatedRecords = [record, ...records];
    await saveRecords(updatedRecords);
  }, [records]);

  /**
   * Atualiza um registro existente
   */
  const updateRecord = useCallback(async (id: string, updates: Partial<SleepRecord>) => {
    const updatedRecords = records.map(record => 
      record.id === id ? { ...record, ...updates } : record
    );
    await saveRecords(updatedRecords);
  }, [records]);

  /**
   * Remove um registro
   */
  const deleteRecord = useCallback(async (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    await saveRecords(updatedRecords);
  }, [records]);

  /**
   * Limpa todos os dados (para testes ou reset)
   */
  const clearAll = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY_RECORDS, STORAGE_KEY_STATE]);
      setRecords([]);
      setSleepState({
        isSleeping: false,
        currentSleepStart: null,
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }, []);

  return {
    records,
    sleepState,
    isLoading,
    startSleep,
    endSleep,
    addRecord,
    updateRecord,
    deleteRecord,
    clearAll,
  };
}
