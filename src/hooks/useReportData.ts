import { useState, useEffect } from 'react';
import { getUserAggregates, PressureAggregate } from '../services/api';

interface ReportData {
  avgPressure: number;
  maxPressure: number;
  minPressure: number;
  totalSamples: number;
  aggregates: PressureAggregate[];
  byPatch: {
    [patchId: string]: {
      avg: number;
      max: number;
      min: number;
      count: number;
    };
  };
}

interface UseReportDataResult {
  data: ReportData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and process report data from backend
 * 
 * @param userId - User ID to fetch data for
 * @param startDate - Optional start date filter (ISO 8601 format)
 * @param endDate - Optional end date filter (ISO 8601 format)
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * 
 * @example
 * const { data, loading, error, refetch } = useReportData('user123');
 */
export const useReportData = (
  userId: string,
  startDate?: string,
  endDate?: string,
  autoFetch: boolean = true
): UseReportDataResult => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!userId) {
      console.warn('⚠️ No userId provided to useReportData');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`📊 Fetching report data for user: ${userId}`);

      const response = await getUserAggregates(userId, startDate, endDate);
      const aggregates = response.aggregates;

      if (!aggregates || aggregates.length === 0) {
        console.log('ℹ️ No aggregates found for user');
        setData({
          avgPressure: 0,
          maxPressure: 0,
          minPressure: 0,
          totalSamples: 0,
          aggregates: [],
          byPatch: {},
        });
        return;
      }

      // Process aggregates to calculate overall statistics
      const processedData = processAggregates(aggregates);
      setData(processedData);

      console.log(`✅ Processed ${aggregates.length} aggregates`);
    } catch (err) {
      const error = err as Error;
      console.error('❌ Error fetching report data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [userId, startDate, endDate, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Process raw aggregates into useful statistics
 */
function processAggregates(aggregates: PressureAggregate[]): ReportData {
  // Calculate overall statistics across all patches
  let totalSamples = 0;
  let weightedSum = 0;
  let overallMax = -Infinity;
  let overallMin = Infinity;

  // Group by patch
  const byPatch: ReportData['byPatch'] = {};

  aggregates.forEach((agg) => {
    // Update overall stats
    totalSamples += agg.sample_count;
    weightedSum += agg.avg_pressure * agg.sample_count;
    overallMax = Math.max(overallMax, agg.max_pressure);
    overallMin = Math.min(overallMin, agg.min_pressure);

    // Update patch-specific stats
    if (!byPatch[agg.patch_id]) {
      byPatch[agg.patch_id] = {
        avg: 0,
        max: -Infinity,
        min: Infinity,
        count: 0,
      };
    }

    const patch = byPatch[agg.patch_id];
    patch.count += agg.sample_count;
    patch.max = Math.max(patch.max, agg.max_pressure);
    patch.min = Math.min(patch.min, agg.min_pressure);
  });

  // Calculate weighted average for each patch
  Object.keys(byPatch).forEach((patchId) => {
    const patchAggregates = aggregates.filter((a) => a.patch_id === patchId);
    const patchWeightedSum = patchAggregates.reduce(
      (sum, a) => sum + a.avg_pressure * a.sample_count,
      0
    );
    byPatch[patchId].avg = patchWeightedSum / byPatch[patchId].count;
  });

  // Calculate overall weighted average
  const avgPressure = totalSamples > 0 ? weightedSum / totalSamples : 0;

  return {
    avgPressure,
    maxPressure: overallMax === -Infinity ? 0 : overallMax,
    minPressure: overallMin === Infinity ? 0 : overallMin,
    totalSamples,
    aggregates,
    byPatch,
  };
}

export default useReportData;
