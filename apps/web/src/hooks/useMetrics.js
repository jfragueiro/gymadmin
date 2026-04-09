import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import metricsApi from '../api/metrics.api.js';

export const useMetrics = (clientId) =>
  useQuery({
    queryKey: ['metrics', clientId],
    queryFn: () => metricsApi.getByClient(clientId),
    enabled: !!clientId,
  });

export const useRecordMetric = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => metricsApi.create(clientId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['metrics', clientId] }),
  });
};
