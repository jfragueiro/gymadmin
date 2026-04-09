import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import membershipsApi from '../api/memberships.api.js';
import plansCatalogApi from '../api/plans.catalog.api.js';

export const useMembershipsOverview = () =>
  useQuery({
    queryKey: ['memberships-overview'],
    queryFn: () => membershipsApi.getOverview(),
  });

export const usePlansCatalog = () =>
  useQuery({
    queryKey: ['plans-catalog'],
    queryFn: () => plansCatalogApi.getAll(),
  });

export const useClientMemberships = (clientId) =>
  useQuery({
    queryKey: ['memberships', clientId],
    queryFn: () => membershipsApi.getByClient(clientId),
    enabled: !!clientId,
  });

export const useAssignMembership = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => membershipsApi.assign(data),
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({ queryKey: ['memberships', vars.clientId] }),
  });
};

export const useClientPayments = (clientId) =>
  useQuery({
    queryKey: ['payments', clientId],
    queryFn: () => membershipsApi.getPaymentsByClient(clientId),
    enabled: !!clientId,
  });

export const useRegisterPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => membershipsApi.registerPayment(data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['payments', vars.clientId] });
      queryClient.invalidateQueries({ queryKey: ['memberships', vars.clientId] });
    },
  });
};
