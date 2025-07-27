import React from 'react';

interface SummaryData {
  total_resources: number;
  total_monthly_cost: number;
  total_potential_savings: number;
  open_recommendations: number;
  savings_percentage: number;
}

interface SummaryHeaderProps {
  data: SummaryData | undefined;
  loading: boolean;
  error?: string;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="flex gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-gray-800 h-24 w-56"></div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-400 font-semibold mb-8">
        Could not load summary: {error}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-6 mb-8">
      <div className="card flex-1 min-w-[12rem] text-center">
        <div className="text-sm text-gray-400">Total Resources</div>
        <div className="font-bold text-3xl text-white">{data?.total_resources ?? '--'}</div>
      </div>
      <div className="card flex-1 min-w-[12rem] text-center">
        <div className="text-sm text-gray-400">Monthly Cost</div>
        <div className="font-bold text-3xl text-red-400">
          ${data?.total_monthly_cost?.toFixed(2) ?? '--'}
        </div>
      </div>
      <div className="card flex-1 min-w-[12rem] text-center">
        <div className="text-sm text-gray-400">Potential Savings</div>
        <div className="font-bold text-3xl text-green-400">
          ${data?.total_potential_savings?.toFixed(2) ?? '--'}
        </div>
      </div>
      <div className="card flex-1 min-w-[12rem] text-center">
        <div className="text-sm text-gray-400">Opportunities</div>
        <div className="font-bold text-3xl text-purple-400">
          {data?.open_recommendations ?? '--'}
        </div>
      </div>
    </div>
  );
};

export default SummaryHeader;
