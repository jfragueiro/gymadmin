import { useQuery } from '@tanstack/react-query';
import metricsApi from '../api/metrics.api.js';

export const useGymMetrics = (startDate, endDate) =>
  useQuery({
    queryKey: ['gym-metrics', startDate, endDate],
    queryFn: () => metricsApi.getGymMetrics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
