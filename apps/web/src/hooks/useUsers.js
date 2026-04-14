import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usersApi from '../api/users.api.js';

export const useUsers = (filters = {}) =>
  useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getAll(filters),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => usersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => usersApi.toggleStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMe(),
  });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
};
