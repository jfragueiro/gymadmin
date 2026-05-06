import { useQuery } from '@tanstack/react-query';
import financesApi from '../api/finances.api.js';

export const useFinancialSummary = (year) =>
  useQuery({
    queryKey: ['finances-summary', year],
    queryFn: () => financesApi.getSummary(year),
  });
