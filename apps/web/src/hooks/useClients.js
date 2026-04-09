import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clientsApi from '../api/clients.api.js';

export const useClients = (filters) =>
  useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsApi.getAll(filters),
  });

export const useClient = (id) =>
  useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });

export const useRegisterClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => clientsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useUpdateClient = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
