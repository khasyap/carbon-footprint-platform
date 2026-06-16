'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import useCarbon from '../../hooks/useCarbon';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { FileText, Calendar, Car, Lightbulb, Utensils, Trash2, Droplet } from 'lucide-react';

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const { logs, loading: logsLoading, fetchLogs } = useCarbon();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchLogs();
    }
  }, [user, authLoading, router, fetchLogs]);

  if (authLoading || (user && logsLoading && logs.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" message="Loading Emissions Logs..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Historical Emissions Log</h2>
            <p className="text-xs text-slate-400 mt-1">Detailed view of all logged carbon-generating activities and computed CO₂ equivalents.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">All Activities</h3>
            </div>

            {logs.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/60 bg-slate-950/40 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="p-4">Date</th>
                      <th className="p-4">Transport</th>
                      <th className="p-4">Electricity</th>
                      <th className="p-4">Water</th>
                      <th className="p-4">Diet Habit</th>
                      <th className="p-4">Waste</th>
                      <th className="p-4 text-right">CO₂ Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {logs.map((record) => {
                      const act = record.activityId || {};
                      const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });

                      return (
                        <tr key={record._id} className="hover:bg-slate-900/20 text-slate-300 font-medium">
                          <td className="p-4 flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                          </td>
                          <td className="p-4">
                            {act.transportType !== 'None' ? (
                              <span className="flex items-center gap-1">
                                <Car className="w-3.5 h-3.5 text-amber-400" />
                                <span>{act.transportType} ({act.distance} km)</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {act.electricityUnits > 0 ? (
                              <span className="flex items-center gap-1">
                                <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                                <span>{act.electricityUnits} kWh</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {act.waterUsage > 0 ? (
                              <span className="flex items-center gap-1">
                                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{act.waterUsage} L</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {act.foodType !== 'None' ? (
                              <span className="flex items-center gap-1">
                                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{act.foodType}</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            {act.wasteGenerated > 0 ? (
                              <span className="flex items-center gap-1">
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>{act.wasteGenerated} kg</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4 text-right font-bold text-slate-100">
                            {record.totalEmission.toFixed(1)} kg
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-sm">
                No reports found. Go to the Calculator to log your first activity!
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
