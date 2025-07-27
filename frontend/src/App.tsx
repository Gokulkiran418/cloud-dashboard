import { useEffect, useState } from 'react';
import type { Resource } from '@/services/resources';
import { resourcesApi } from '@/services/resources';
import type { RecommendationsResponse } from '@/services/resources';
import ResourcesTable from '@/components/ResourcesTable';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import SummaryHeader from '@/components/SummaryHeader';

export default function App() {

  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState<boolean>(true);
  const [errorResources, setErrorResources] = useState<string | undefined>(undefined);
  const [summary, setSummary] = useState<RecommendationsResponse['summary']>();
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | undefined>();

  const fetchSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(undefined);
    try {
      const data = await resourcesApi.getRecommendations();
      setSummary(data.summary);
    } catch (e: any) {
      setSummaryError(e.message || 'Failed to load summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch summary on mount and whenever a recommendation is implemented
  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await resourcesApi.healthCheck();
        setHealthStatus(health.status);
        setApiConnected(health.status === 'ok');
      } catch (e) {
        setHealthStatus('error');
        setApiConnected(false);
      }
    };

    const fetchResources = async () => {
      setLoadingResources(true);
      setErrorResources(undefined);
      try {
        const data = await resourcesApi.getResources();
        setResources(data);
      } catch (e: any) {
        setErrorResources(e.message || 'Failed to load resources');
      } finally {
        setLoadingResources(false);
      }
    };

    checkHealth();
    fetchResources();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cloud Optimization Dashboard
        </h1>
        <SummaryHeader
          data={summary}
          loading={loadingSummary}
          error={summaryError}
        />
        {/* System Status Card */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  apiConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                API Status: {healthStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Resources Table */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Cloud Resources</h2>
          <ResourcesTable
            resources={resources}
            loading={loadingResources}
            error={errorResources}
          />
        </div>

        {/* Recommendations Panel */}
        <div className="card">
          <RecommendationsPanel onImplement={() => {
            // TODO: Optionally refetch summary or resources after applying a recommendation
            // fetchResources(); // Uncomment if needed
          }} />
        </div>
      </div>
    </div>
  );
}
