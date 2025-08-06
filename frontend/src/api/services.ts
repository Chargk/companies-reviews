import api from './client';

export const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompany: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
};