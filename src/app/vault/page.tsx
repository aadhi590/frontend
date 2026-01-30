"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function VaultPage() {
  useEffect(() => {
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      const ctx = document.getElementById('vaultChart') as HTMLCanvasElement;
      new (window as any).Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Asset Value (₹)',
              data: [120000, 125000, 128000, 135000, 142000, 148000, 155000, 160000, 165000, 172000, 178000, 185000],
              borderColor: 'rgb(245, 158, 11)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Liquidity (₹)',
              data: [85000, 88000, 90000, 95000, 98000, 102000, 108000, 112000, 115000, 120000, 125000, 130000],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
              text: 'Vault Analytics - Asset Growth & Liquidity'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
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
              <h1 className="text-2xl font-bold text-gray-800">Vault Access</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-semibold text-amber-700">Secure Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Assets</div>
            <div className="text-2xl font-bold text-amber-600">₹18.5L</div>
            <div className="text-xs text-gray-400 mt-1">+15.8% YoY growth</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Available Liquidity</div>
            <div className="text-2xl font-bold text-blue-600">₹13.0L</div>
            <div className="text-xs text-gray-400 mt-1">70% of total assets</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Monthly Growth</div>
            <div className="text-2xl font-bold text-emerald-600">+3.9%</div>
            <div className="text-xs text-gray-400 mt-1">Above target rate</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Security Rating</div>
            <div className="text-2xl font-bold text-green-600">AAA</div>
            <div className="text-xs text-gray-400 mt-1">Highest security level</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div style={{ height: '400px' }}>
            <canvas id="vaultChart"></canvas>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-lg font-bold mb-4">Asset Breakdown</h2>
          <div className="space-y-3">
            {[
              { name: 'Fixed Deposits', value: 750000, percentage: 40.5, color: 'bg-amber-500' },
              { name: 'Liquid Cash', value: 555000, percentage: 30.0, color: 'bg-blue-500' },
              { name: 'Securities', value: 370000, percentage: 20.0, color: 'bg-emerald-500' },
              { name: 'Other Assets', value: 175500, percentage: 9.5, color: 'bg-purple-500' },
            ].map((asset, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{asset.name}</div>
                  <div className="text-right">
                    <div className="font-bold">₹{asset.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{asset.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${asset.color} h-2 rounded-full`} style={{ width: `${asset.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}