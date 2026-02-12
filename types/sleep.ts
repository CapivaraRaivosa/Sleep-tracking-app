/**
 * Tipos TypeScript para o SleepTracker
 */

/**
 * Representa um único registro de sono
 */
export interface SleepRecord {
  /** ID único do registro (timestamp de criação) */
  id: string;
  /** Data e hora de início do sono (ISO 8601) */
  startTime: string;
  /** Data e hora de fim do sono (ISO 8601) */
  endTime: string;
  /** Duração do sono em minutos */
  durationMinutes: number;
}

/**
 * Estado atual do rastreamento de sono
 */
export interface SleepState {
  /** Se está atualmente dormindo */
  isSleeping: boolean;
  /** Horário de início do sono atual (se isSleeping = true) */
  currentSleepStart: string | null;
}

/**
 * Período de filtro para estatísticas
 */
export type StatsPeriod = '24h' | '3d' | '7d' | '30d' | 'custom';

/**
 * Estatísticas calculadas para um período
 */
export interface SleepStats {
  /** Total de horas dormidas no período */
  totalHours: number;
  /** Média de horas por dia */
  averageHours: number;
  /** Número de registros no período */
  recordCount: number;
  /** Maior duração de sono em minutos */
  maxDuration: number;
  /** Menor duração de sono em minutos */
  minDuration: number;
}

/**
 * Filtro de período personalizado
 */
export interface CustomPeriod {
  startDate: Date;
  endDate: Date;
}
