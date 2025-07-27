import React, { useEffect, useState } from 'react';
import { type Recommendation, type RecommendationsResponse, resourcesApi } from '@/services/resources';

interface RecommendationsPanelProps {
  onImplement?: () => void; // callback for parent to refresh summary
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ onImplement }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState<RecommendationsResponse['summary']>();
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState<number | null>(null); // resource_id being updated
  const [error, setError] = useState<string | undefined>();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await resourcesApi.getRecommendations();
      setRecommendations(data.recommendations);
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line
  }, []);

  const handleImplement = async (resId: number) => {
    setPosting(resId);
    try {
      await resourcesApi.implementRecommendation(resId);
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.resource_id === resId ? { ...rec, implemented: true } : rec
        )
      );
      setToast({ message: "Recommendation marked as implemented.", type: "success" });
      if (onImplement) onImplement();
      // Optionally, refetch summary
      fetchRecommendations();
    } catch (e: any) {
      setToast({ message: e.message || "Failed to update.", type: "error" });
    } finally {
      setPosting(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Optimization Recommendations</h2>
      {loading && <div className="p-4 text-gray-500">Loading recommendations...</div>}
      {error && (
        <div className="p-4 text-red-600 font-semibold">
          Error: {error}
        </div>
      )}
      {(!loading && recommendations.length === 0) && (
        <div className="p-4 text-gray-500">No optimization opportunities found 🎉</div>
      )}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.resource_id}
            className={`card relative border-l-4 ${rec.implemented ? 'border-gray-300 opacity-70' : 'border-blue-600'} transition-opacity`}
          >
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <div className="text-lg font-semibold">
                  {rec.current_config} → <span className="text-green-600">{rec.suggested_config}</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{rec.reason}</div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-blue-700">
                    Potential savings: <span className="font-bold text-green-700">${rec.potential_saving.toFixed(2)}</span>/mo
                  </span>
                  <span>
                    Confidence: <span className="font-semibold">{Math.round(rec.confidence * 100)}%</span>
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{rec.recommendation_type}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {!rec.implemented ? (
                  <button
                    className="btn-primary disabled:opacity-50 transition"
                    onClick={() => handleImplement(rec.resource_id)}
                    disabled={posting === rec.resource_id}
                  >
                    {posting === rec.resource_id ? "Updating..." : "Mark Implemented"}
                  </button>
                ) : (
                  <span className="text-green-500 font-medium">Implemented</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary (optional - could be shown above, or in summary tiles) */}
      {summary && (
        <div className="mt-8 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Open recommendations:</span> {summary.open_recommendations}
          </div>
          <div>
            <span className="font-semibold">Total potential monthly savings:</span> ${summary.total_potential_savings.toFixed(2)}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-8 right-8 py-2 px-4 rounded-lg shadow-lg
            text-white font-medium z-50
            ${toast.type === "success" ? 'bg-green-500' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
