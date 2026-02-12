import { describe, it, expect } from 'vitest';
import { SleepRecord } from '@/types/sleep';

/**
 * Testes para cálculos de estatísticas
 */

// Função auxiliar para calcular estatísticas (extraída da lógica do hook)
function calculateStats(records: SleepRecord[], periodDays: number) {
  const now = new Date();
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.startTime);
    return recordDate >= startDate && recordDate <= now;
  });

  if (filteredRecords.length === 0) {
    return {
      totalHours: 0,
      averageHours: 0,
      recordCount: 0,
      maxDuration: 0,
      minDuration: 0,
    };
  }

  const totalMinutes = filteredRecords.reduce(
    (sum, record) => sum + record.durationMinutes,
    0
  );
  const totalHours = totalMinutes / 60;
  const averageHours = totalHours / Math.max(periodDays, 1);

  const durations = filteredRecords.map((r) => r.durationMinutes);
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    averageHours: Math.round(averageHours * 10) / 10,
    recordCount: filteredRecords.length,
    maxDuration,
    minDuration,
  };
}

describe('useStats - Cálculos de Estatísticas', () => {
  it('deve calcular estatísticas corretamente para registros válidos', () => {
    const mockRecords: SleepRecord[] = [
      {
        id: '1',
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 480, // 8 horas
      },
      {
        id: '2',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 420, // 7 horas
      },
    ];

    const stats = calculateStats(mockRecords, 7);

    expect(stats.recordCount).toBe(2);
    expect(stats.totalHours).toBe(15); // 8 + 7 = 15 horas
    expect(stats.maxDuration).toBe(480);
    expect(stats.minDuration).toBe(420);
  });

  it('deve retornar zeros quando não há registros', () => {
    const stats = calculateStats([], 7);

    expect(stats.totalHours).toBe(0);
    expect(stats.averageHours).toBe(0);
    expect(stats.recordCount).toBe(0);
    expect(stats.maxDuration).toBe(0);
    expect(stats.minDuration).toBe(0);
  });

  it('deve filtrar registros fora do período', () => {
    const mockRecords: SleepRecord[] = [
      {
        id: '1',
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 480,
      },
      {
        id: '2',
        startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 420,
      },
    ];

    // Período de 7 dias deve incluir apenas o primeiro registro
    const stats = calculateStats(mockRecords, 7);

    expect(stats.recordCount).toBe(1);
    expect(stats.totalHours).toBe(8);
  });

  it('deve calcular média corretamente', () => {
    const mockRecords: SleepRecord[] = [
      {
        id: '1',
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 480, // 8 horas
      },
    ];

    const stats = calculateStats(mockRecords, 7);

    // 8 horas / 7 dias ≈ 1.1 horas/dia
    expect(stats.averageHours).toBeGreaterThan(1);
    expect(stats.averageHours).toBeLessThan(2);
  });
});
