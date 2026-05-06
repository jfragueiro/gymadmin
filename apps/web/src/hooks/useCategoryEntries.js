import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import financesApi from '../api/finances.api.js';

export const useCategoryEntries = (categoryId, month) =>
  useQuery({
    queryKey: ['finances-entries', categoryId, month],
    queryFn: () => financesApi.getCategoryEntries(categoryId, month),
    enabled: !!categoryId && !!month,
  });

export const useAddEntry = (categoryId, month) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => financesApi.addEntry(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances-entries', categoryId, month] });
      queryClient.invalidateQueries({ queryKey: ['finances-summary'] });
    },
  });
};

export const useDeleteEntry = (categoryId, month) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId) => financesApi.deleteEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances-entries', categoryId, month] });
      queryClient.invalidateQueries({ queryKey: ['finances-summary'] });
    },
  });
};
