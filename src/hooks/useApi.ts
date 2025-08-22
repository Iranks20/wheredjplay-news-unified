import { useState, useCallback } from 'react';
import { ApiError } from '../lib/api';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiStateWithPagination<T> extends ApiState<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiWithPagination<T = any>() {
  const [state, setState] = useState<ApiStateWithPagination<T>>({
    data: null,
    loading: false,
    error: null,
    pagination: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      setState({
        data: response.data,
        loading: false,
        error: null,
        pagination: response.pagination || null,
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        pagination: null,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      pagination: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
