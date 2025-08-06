import { useQuery } from '@tanstack/react-query';
import { companyService } from '../api/services';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
