import apiClient from './api';

export interface Resource {
  id: number;
  name: string;
  type: string;
  provider: string;
  instance_type?: string;
  size?: string;
  cpu_utilization?: number;
  memory_utilization?: number;
  storage_gb?: number;
  monthly_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  resource_id: number;
  recommendation_type: string;
  current_config: string;
  suggested_config: string;
  potential_saving: number;
  confidence: number;
  reason: string;
  implemented: boolean;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  summary: {
    total_resources: number;
    total_monthly_cost: number;
    total_potential_savings: number;
    open_recommendations: number;
    savings_percentage: number;
  };
}

export const resourcesApi = {
  // Get all resources with pagination
  getResources: async (limit = 20, offset = 0): Promise<Resource[]> => {
    const response = await apiClient.get(`/resources?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get optimization recommendations
  getRecommendations: async (): Promise<RecommendationsResponse> => {
    const response = await apiClient.get('/recommendations');
    return response.data;
  },

  // Mark recommendation as implemented
  implementRecommendation: async (resourceId: number): Promise<void> => {
    await apiClient.post(`/recommendations/${resourceId}/implement`);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/healthz');
    return response.data;
  },
};
