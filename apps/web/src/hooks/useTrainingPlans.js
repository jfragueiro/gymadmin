import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import plansApi from '../api/plans.api.js';

export const useTrainingPlans = (clientId) =>
  useQuery({
    queryKey: ['training-plans', clientId],
    queryFn: () => plansApi.getByClient(clientId),
    enabled: !!clientId,
  });

export const useCreateTrainingPlan = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => plansApi.create({ ...data, clientId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training-plans', clientId] }),
  });
};

export const useUpdateTrainingPlan = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => plansApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training-plans', clientId] }),
  });
};

export const useDeleteTrainingPlan = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => plansApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training-plans', clientId] }),
  });
};

export const useAddExercise = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, ...data }) => plansApi.addExercise(planId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training-plans', clientId] }),
  });
};

export const useRemoveExercise = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, exerciseId }) => plansApi.removeExercise(planId, exerciseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training-plans', clientId] }),
  });
};
