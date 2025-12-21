'use client';

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'blue' 
}) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-500 bg-blue-50',
    green: 'bg-green-500 text-green-500 bg-green-50',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50',
    orange: 'bg-orange-500 text-orange-500 bg-orange-50',
    red: 'bg-red-500 text-red-500 bg-red-50',
    gray: 'bg-gray-500 text-gray-500 bg-gray-50',
  };

  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-500 ml-2">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${lightBg} p-4 rounded-full`}>
            <Icon className={`text-2xl ${textColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}

