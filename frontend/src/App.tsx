
import { useState, useEffect } from 'react';
import { resourcesApi } from './services/resources';

function App() {
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [apiConnected, setApiConnected] = useState<boolean>(false);

  useEffect(() => {
    // Test API connection on startup
    const checkHealth = async () => {
      try {
        const health = await resourcesApi.healthCheck();
        setHealthStatus(health.status);
        setApiConnected(health.status === 'ok');
      } catch (error) {
        setHealthStatus('error');
        setApiConnected(false);
        console.error('API health check failed:', error);
      }
    };

    checkHealth();
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
              <div className={`w-3 h-3 rounded-full ${
                apiConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                API Status: {healthStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium mb-2">Next Steps</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Frontend bootstrapped with Vite + React + TypeScript</li>
              <li>✅ Tailwind CSS configured</li>
              <li>✅ API service layer created</li>
              <li>✅ Environment configuration ready</li>
              <li>⏳ Build resource table component</li>
              <li>⏳ Build recommendations panel</li>
              <li>⏳ Add summary dashboard</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium mb-2">Tech Stack</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>⚛️ React 18 with TypeScript</div>
              <div>🎨 Tailwind CSS</div>
              <div>📡 Axios for API calls</div>
              <div>⚡ Vite for fast development</div>
              <div>🔧 ESLint + Prettier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
