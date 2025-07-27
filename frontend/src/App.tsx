import { useEffect, useState } from 'react';
import { resourcesApi, type Resource, type RecommendationsResponse } from '@/services/resources';
import ResourcesTable from '@/components/ResourcesTable';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import SummaryHeader from '@/components/SummaryHeader';
import NavBar from '@/components/NavBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState<boolean>(true);
  const [errorResources, setErrorResources] = useState<string | undefined>(undefined);
  const [summary, setSummary] = useState<RecommendationsResponse['summary']>();
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState<string | undefined>();

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
    checkHealth();
    fetchResources();
    fetchSummary();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black transition-all relative">
        {/* DotGrid Background */}
    
        
        {/* Content Layer */}
        <div className="relative z-10">
          <NavBar />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Cloud Optimization Dashboard</h1>
            {/* Summary header */}
            <SummaryHeader
              data={summary}
              loading={loadingSummary}
              error={summaryError}
            />
            {/* System status */}
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    apiConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-300">API Status: {healthStatus}</span>
                </div>
              </div>
            </div>
            {/* Resources Table */}
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Cloud Resources</h2>
              <ResourcesTable
                resources={resources}
                loading={loadingResources}
                error={errorResources}
              />
            </div>
            {/* Recommendations panel */}
            <div className="card">
              <RecommendationsPanel onImplement={fetchSummary} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}