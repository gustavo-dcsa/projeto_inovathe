import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { components } from '../types/api-types';

// Using the generated types for consistency
type Idea = components['schemas']['Idea'];

// The API wrapper normalizes responses, but let's define the expected structure for clarity.
type PaginatedIdeaList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Idea[];
};

interface UseIdeasParams {
  status?: 'approved' | 'in_analysis' | 'pending' | 're_evaluation' | 'rejected';
  ordering?: string;
  is_featured?: boolean;
  search?: string;
}

const useIdeas = (params: UseIdeasParams = {}) => {
  const [data, setData] = useState<PaginatedIdeaList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const fetchIdeas = useCallback(async (p: UseIdeasParams) => {
    setIsLoading(true);
    setError(null);
    try {
      // The params object is directly passed to Axios, which will serialize it into query parameters.
      const response = await api.get<PaginatedIdeaList>('/ideas/', { params: p });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // We stringify the params object to use it as a stable dependency for the effect.
    // This ensures we only re-fetch when the filter criteria actually change.
    fetchIdeas(params);
  }, [JSON.stringify(params), fetchIdeas]);

  return { data, isLoading, error, refetch: () => fetchIdeas(params) };
};

export default useIdeas;
