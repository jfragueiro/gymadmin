import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import plansCatalogApi from '../api/plans.catalog.api.js';
import apiClient from '../api/axios.js';

const plansApi = {
  getAll: () => apiClient.get('/plans').then((r) => r.data),
  create: (data) => apiClient.post('/plans', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/plans/${id}`, data).then((r) => r.data),
  remove: (id) => apiClient.delete(`/plans/${id}`).then((r) => r.data),
};

export const usePlans = () =>
  useQuery({
    queryKey: ['plans'],
    queryFn: plansApi.getAll,
  });

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: plansApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans-catalog'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => plansApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans-catalog'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: plansApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans-catalog'] });
    },
  });
};
