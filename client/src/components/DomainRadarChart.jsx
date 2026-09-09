import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

export default function DomainRadarChart({ domainBreakdown }) {
  if (!domainBreakdown || Object.keys(domainBreakdown).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
        <p>No domain mastery data recorded yet.</p>
        <p className="text-xs text-slate-500 mt-1">Complete practice exams to unlock your Scrum domain strengths chart.</p>
      </div>
    );
  }

  const chartData = Object.entries(domainBreakdown).map(([domain, stats]) => ({
    domain: domain.length > 18 ? domain.substring(0, 16) + '...' : domain,
    fullDomain: domain,
    percentage: stats.percentage || 0,
    total: stats.total || 0,
    correct: stats.correct || 0
  }));

  const getColor = (pct) => {
    if (pct >= 80) return '#10b981'; // emerald
    if (pct >= 70) return '#06b6d4'; // cyan
    if (pct >= 50) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Radar Chart */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col items-center">
        <h4 className="text-sm font-bold text-slate-200 mb-2 self-start flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Scrum Competency Radar</span>
        </h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="domain" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar
                name="Score %"
                dataKey="percentage"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Breakdown */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          <span>Domain Performance Score (%)</span>
        </h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="domain" type="category" stroke="#475569" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={110} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                formatter={(value) => [`${value}% Correct`, 'Score']}
              />
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
