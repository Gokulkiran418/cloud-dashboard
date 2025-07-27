import React from 'react';
import type { Resource } from '@/services/resources';

interface ResourcesTableProps {
  resources: Resource[];
  loading: boolean;
  error?: string;
}

const getUtilizationColor = (value?: number): string => {
  if (value === undefined || value === null) return 'text-gray-500';
  if (value < 70) return 'text-green-600';
  if (value < 90) return 'text-yellow-600';
  return 'text-red-600 font-bold';
};

const ResourcesTable: React.FC<ResourcesTableProps> = ({ resources, loading, error }) => {
  if (loading)
    return (
      <div className="p-4 text-center text-gray-400">Loading resources...</div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-400 font-semibold">
        Error fetching resources: {error}
      </div>
    );

  if (resources.length === 0)
    return (
      <div className="p-4 text-center text-gray-400">No cloud resources found.</div>
    );

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700 bg-black">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 tracking-wider uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 tracking-wider uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 tracking-wider uppercase">Provider</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 tracking-wider uppercase">CPU %</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 tracking-wider uppercase">Memory %</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 tracking-wider uppercase">Storage (GB)</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 tracking-wider uppercase">Monthly Cost ($)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {resources.map((res) => (
            <tr key={res.id} className="hover:bg-gray-800 transition-colors">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">{res.name}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">{res.type}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">{res.provider}</td>
              <td className={`whitespace-nowrap px-4 py-3 text-sm text-center ${getUtilizationColor(res.cpu_utilization)}`}>
                {res.cpu_utilization !== undefined && res.cpu_utilization !== null
                  ? `${res.cpu_utilization}%`
                  : '-'}
              </td>
              <td className={`whitespace-nowrap px-4 py-3 text-sm text-center ${getUtilizationColor(res.memory_utilization)}`}>
                {res.memory_utilization !== undefined && res.memory_utilization !== null
                  ? `${res.memory_utilization}%`
                  : '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-center text-gray-300">
                {res.storage_gb !== undefined && res.storage_gb !== null ? res.storage_gb : '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-right text-white">
                ${res.monthly_cost.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
