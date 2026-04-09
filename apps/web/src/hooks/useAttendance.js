import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import attendanceApi from '../api/attendance.api.js';

export const useClientAttendance = (clientId) =>
  useQuery({
    queryKey: ['attendance', clientId],
    queryFn: () => attendanceApi.getByClient(clientId),
    enabled: !!clientId,
  });

export const useDailyAttendance = () =>
  useQuery({
    queryKey: ['attendance', 'daily'],
    queryFn: () => attendanceApi.getDaily(),
  });

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => attendanceApi.checkIn(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  });
};
