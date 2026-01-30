"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SecurityPage() {
  useEffect(() => {
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      const ctx = document.getElementById('securityChart') as HTMLCanvasElement;
      new (window as any).Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Cash Inflow (₹)',
              data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 75000, 82000, 79000, 88000],
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Cash Outflow (₹)',
              data: [38000, 42000, 39000, 48000, 51000, 53000, 58000, 62000, 59000, 65000, 68000, 71000],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Security Analytics - Cash Flow Trends'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '₹' + value.toLocaleString();
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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Security Analytics</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-700">Live Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Inflow</div>
            <div className="text-2xl font-bold text-emerald-600">₹7.86L</div>
            <div className="text-xs text-gray-400 mt-1">+12.5% from last year</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Outflow</div>
            <div className="text-2xl font-bold text-red-600">₹6.53L</div>
            <div className="text-xs text-gray-400 mt-1">+8.2% from last year</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Net Cash Flow</div>
            <div className="text-2xl font-bold text-blue-600">₹1.33L</div>
            <div className="text-xs text-gray-400 mt-1">+24.8% from last year</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Risk Score</div>
            <div className="text-2xl font-bold text-amber-600">0.02%</div>
            <div className="text-xs text-gray-400 mt-1">Low risk exposure</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div style={{ height: '400px' }}>
            <canvas id="securityChart"></canvas>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-lg font-bold mb-4">Recent Security Transactions</h2>
          <div className="space-y-3">
            {[
              { type: 'Inflow', amount: 88000, date: 'Dec 15, 2024', status: 'Verified' },
              { type: 'Outflow', amount: -71000, date: 'Dec 10, 2024', status: 'Completed' },
              { type: 'Inflow', amount: 79000, date: 'Nov 22, 2024', status: 'Verified' },
            ].map((txn, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {txn.amount > 0 ? '↑' : '↓'}
                  </div>
                  <div>
                    <div className="font-semibold">{txn.type}</div>
                    <div className="text-sm text-gray-500">{txn.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${txn.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{Math.abs(txn.amount).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{txn.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}