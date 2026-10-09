import React from 'react';

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendPositive = true,
  badgeText,
  color = 'indigo'
}) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400 border-violet-100 dark:border-violet-900/50',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
  };

  const iconClass = colorMap[color] || colorMap.indigo;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl border p-3.5 ${iconClass}`}>
          {icon}
        </div>
        {badgeText && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
      </div>

      {(description || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium">
          {trend && (
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-bold ${
              trendPositive 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
            }`}>
              {trendPositive ? '↑' : '↓'} {trend}
            </span>
          )}
          {description && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
