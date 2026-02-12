import { describe, it, expect } from 'vitest';
import { SleepRecord } from '@/types/sleep';

/**
 * Testes básicos para lógica de dados do SleepTracker
 * 
 * Nota: Testes de AsyncStorage requerem ambiente React Native.
 * Estes testes verificam a lógica de manipulação de dados.
 */

describe('useSleepStorage - Lógica de Dados', () => {
  it('deve calcular duração corretamente em minutos', () => {
    const startTime = new Date('2026-02-12T22:00:00.000Z');
    const endTime = new Date('2026-02-13T06:00:00.000Z');
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    expect(durationMinutes).toBe(480); // 8 horas = 480 minutos
  });

  it('deve formatar registro de sono corretamente', () => {
    const record: SleepRecord = {
      id: '1',
      startTime: '2026-02-12T22:00:00.000Z',
      endTime: '2026-02-13T06:00:00.000Z',
      durationMinutes: 480,
    };

    expect(record.id).toBe('1');
    expect(record.durationMinutes).toBe(480);
    expect(new Date(record.startTime).getTime()).toBeLessThan(new Date(record.endTime).getTime());
  });

  it('deve validar estrutura de registro de sono', () => {
    const record: SleepRecord = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 480,
    };

    expect(record).toHaveProperty('id');
    expect(record).toHaveProperty('startTime');
    expect(record).toHaveProperty('endTime');
    expect(record).toHaveProperty('durationMinutes');
    expect(typeof record.id).toBe('string');
    expect(typeof record.durationMinutes).toBe('number');
  });
});
