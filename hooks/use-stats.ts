import { useMemo } from 'react';
import { SleepRecord, SleepStats, StatsPeriod, CustomPeriod } from '@/types/sleep';

/**
 * Hook para calcular estatísticas de sono
 */
export function useStats(
  records: SleepRecord[],
  period: StatsPeriod,
  customPeriod?: CustomPeriod
): SleepStats {
  return useMemo(() => {
    // Determinar data de início do período
    const now = new Date();
    let startDate: Date;

    if (period === 'custom' && customPeriod) {
      startDate = customPeriod.startDate;
    } else {
      switch (period) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '3d':
          startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    // Filtrar registros no período
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.startTime);
      const endDate = period === 'custom' && customPeriod ? customPeriod.endDate : now;
      return recordDate >= startDate && recordDate <= endDate;
    });

    // Calcular estatísticas
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

    // Calcular número de dias no período
    const daysDiff = Math.ceil(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const averageHours = totalHours / Math.max(daysDiff, 1);

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
  }, [records, period, customPeriod]);
}
