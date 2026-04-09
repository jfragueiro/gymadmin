import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import qrApi from '../api/qr.api.js';

export const useClientQR = (clientId) =>
  useQuery({
    queryKey: ['qr', clientId],
    queryFn: () => qrApi.getClientQR(clientId),
    enabled: !!clientId,
  });

export const useRegenerateQR = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => qrApi.regenerate(clientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['qr', clientId] }),
  });
};
