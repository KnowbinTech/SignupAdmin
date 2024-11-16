import { writable } from 'svelte/store';
import type { ApiResponse,
    DashboardData, 
    CustomerGrowth, 
    CustomerOrderAnalysis,
    CustomerRetention,
    MonthlyCustomerCount } from '$lib/types/dashboard';
import { AxiosError } from 'axios';
import api from './api';

// Create stores for each data type
export const dashboardStore = writable<DashboardData | null>(null);
export const customerGrowthStore = writable<CustomerGrowth | null>(null);
export const customerOrderStore = writable<CustomerOrderAnalysis | null>(null);
export const customerRetentionStore = writable<CustomerRetention | null>(null);
export const monthlyCustomerStore = writable<MonthlyCustomerCount | null>(null);

// Loading states
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);

// API service
export const dashboardService = {
  async fetchDashboardData(fromDate: string, toDate: string) {
    try {
      isLoading.set(true);
      error.set(null);
      
      const response = await api.post<ApiResponse<DashboardData>>('/home/dashboard/', {
        from_date: fromDate,
        to_date: toDate
      });
      
      dashboardStore.set(response.data.data);
      return response.data.data;
    } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        console.error('Error fetching dashboard data:', err);
        error.set(axiosError.response?.data?.message || 'Failed to fetch dashboard data');
        throw err;
    } finally {
      isLoading.set(false);
    }
  },

  async fetchCustomerGrowth() {
    try {
      isLoading.set(true);
      error.set(null);
      
      const response = await api.get<ApiResponse<CustomerGrowth>>('/home/customer-growth/');
      customerGrowthStore.set(response.data.data);
      return response.data.data;
    } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        console.error('Error fetching customer growth:', err);
        error.set(axiosError.response?.data?.message || 'Failed to fetch customer growth');
        throw err;
    } finally {
      isLoading.set(false);
    }
  },

  async fetchCustomerOrderAnalysis() {
    try {
      isLoading.set(true);
      error.set(null);
      
      const response = await api.get<ApiResponse<CustomerOrderAnalysis>>('/home/customer-order-analysis/');
      customerOrderStore.set(response.data.data);
      return response.data.data;
    } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        console.error('Error fetching customer order analysis:', err);
        error.set(axiosError.response?.data?.message || 'Failed to fetch customer order analysis');
        throw err;
    } finally {
      isLoading.set(false);
    }
  },

  async fetchCustomerRetention() {
    try {
      isLoading.set(true);
      error.set(null);
      
      const response = await api.get<ApiResponse<CustomerRetention>>('/home/customer-retention/');
      customerRetentionStore.set(response.data.data);
      return response.data.data;
    } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        console.error('Error fetching customer retention:', err);
        error.set(axiosError.response?.data?.message || 'Failed to fetch customer retention');
        throw err;
    } finally {
      isLoading.set(false);
    }
  },

  async fetchMonthlyCustomerCount() {
    try {
      isLoading.set(true);
      error.set(null);
      
      const response = await api.get<ApiResponse<MonthlyCustomerCount>>('/home/monthly-customer-count/');
      monthlyCustomerStore.set(response.data.data);
      return response.data.data;
    } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        console.error('Error fetching monthly customer count:', err);
        error.set(axiosError.response?.data?.message || 'Failed to fetch monthly customer count');
        throw err;
    } finally {
      isLoading.set(false);
    }
  }
};