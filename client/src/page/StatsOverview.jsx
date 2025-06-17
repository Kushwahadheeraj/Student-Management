import React from 'react';
import { Users, Globe, Clock } from 'lucide-react';

const StatsOverview = () => {
  const stats = [
    {
      icon: <Users className="text-white w-6 h-6" />,
      label: 'Total Students',
      value: '256',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Globe className="text-white w-6 h-6" />,
      label: 'Website Traffic',
      value: '13.2k / month',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: <Clock className="text-white w-6 h-6" />,
      label: 'Available',
      value: '24×7',
      gradient: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="backdrop-blur-sm bg-white/30 shadow-lg rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-300`} />
          <div className="relative z-10">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
              {stat.icon}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
