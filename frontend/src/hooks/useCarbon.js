'use client';

import { useState, useCallback } from 'react';
import * as carbonService from '../services/carbonService';

export default function useCarbon() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await carbonService.getLogs();
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching carbon logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await carbonService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching carbon stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const logNewActivity = async (activityData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await carbonService.logActivity(activityData);
      if (res.success) {
        await fetchLogs();
        await fetchStats();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging activity');
      return { success: false, message: err.response?.data?.message || 'Error logging activity' };
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    stats,
    loading,
    error,
    fetchLogs,
    fetchStats,
    logNewActivity
  };
}
