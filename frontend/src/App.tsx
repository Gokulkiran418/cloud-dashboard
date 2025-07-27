import { useEffect, useState } from 'react';
import type { Resource} from '@/services/resources';
import { resourcesApi } from '@/services/resources';
import ResourcesTable from '@/components/ResourcesTable';

export default function App() {
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState<boolean>(true);
  const [errorResources, setErrorResources] = useState<string | undefined>(undefined);

  useEffect(() => {
    // API Health Check
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

    // Fetch Resource List
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

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  apiConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm text-gray-600">API Status: {healthStatus}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cloud Resources</h2>
          <ResourcesTable
            resources={resources}
            loading={loadingResources}
            error={errorResources}
          />
        </div>
      </div>
    </div>
  );
}
