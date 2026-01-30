"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      const ctx = document.getElementById('analyticsChart') as HTMLCanvasElement;
      new (window as any).Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'System Health Index',
              data: [78, 82, 85, 83, 88, 90, 92, 89, 94, 96, 93, 98],
              borderColor: 'rgb(26, 95, 63)',
              backgroundColor: 'rgba(26, 95, 63, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3
            },
            {
              label: 'Neural Confidence',
              data: [70, 75, 78, 80, 82, 85, 88, 86, 90, 92, 89, 95],
              borderColor: 'rgb(212, 175, 55)',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3
            },
            {
              label: 'Risk Score',
              data: [25, 22, 20, 18, 15, 12, 10, 8, 5, 4, 3, 2],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            title: {
              display: true,
              text: 'Neural Analytics - Heuristic Matrix Performance',
              font: {
                size: 18,
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Neural Analytics</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
              </div>
              <span className="text-sm font-semibold text-emerald-700">Neural Sync Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 font-semibold">System Health</div>
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-emerald-600">98%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Optimal Range</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 font-semibold">Neural Confidence</div>
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-amber-600">95%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">High Trust Level</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 font-semibold">Risk Exposure</div>
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-red-600">2%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Minimal Risk</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 font-semibold">Heuristic Scans</div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-blue-600">247</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Last 30 Days</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div style={{ height: '450px' }}>
            <canvas id="analyticsChart"></canvas>
          </div>
        </div>

        {/* Neural Intelligence Briefing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-black mb-4 uppercase tracking-wider">Intelligence Briefing</h2>
          <div className="space-y-4">
            {[
              { 
                type: 'success', 
                title: 'Pattern Recognition Enhanced', 
                message: 'Neural matrix successfully identified and authenticated 47 recurring payment patterns this month.',
                icon: '✓',
                color: 'bg-emerald-100 text-emerald-700'
              },
              { 
                type: 'warning', 
                title: 'Anomalous Activity Detected', 
                message: 'Late-night transaction variance flagged for review. Confidence delta: 72%.',
                icon: '⚠',
                color: 'bg-amber-100 text-amber-700'
              },
              { 
                type: 'info', 
                title: 'System Optimization Complete', 
                message: 'Heuristic algorithms updated with latest behavioral telemetry. Performance improved by 3.2%.',
                icon: 'ⓘ',
                color: 'bg-blue-100 text-blue-700'
              }
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold ${alert.color} shrink-0`}>
                  {alert.icon}
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-wider mb-1">{alert.title}</div>
                  <div className="text-sm text-gray-600 font-medium">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}