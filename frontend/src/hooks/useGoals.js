'use client';

import { useState, useCallback } from 'react';
import * as goalService from '../services/goalService';

export default function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await goalService.getGoals();
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching goals');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewGoal = async (targetEmission) => {
    setLoading(true);
    setError(null);
    try {
      const res = await goalService.createGoal(targetEmission);
      if (res.success) {
        await fetchGoals();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating goal');
      return { success: false, message: err.response?.data?.message || 'Error creating goal' };
    } finally {
      setLoading(false);
    }
  };

  const removeGoal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await goalService.deleteGoal(id);
      if (res.success) {
        await fetchGoals();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing goal');
      return { success: false, message: err.response?.data?.message || 'Error removing goal' };
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addNewGoal,
    removeGoal
  };
}
