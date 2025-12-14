import React from 'react';

interface RadialScoreProps {
  score: number;
  label: string;
  size?: 'sm' | 'lg';
}

const RadialScore: React.FC<RadialScoreProps> = ({ score, label, size = 'lg' }) => {
  const radius = size === 'lg' ? 60 : 30;
  const stroke = size === 'lg' ? 10 : 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'text-red-500';
  if (score >= 50) color = 'text-yellow-500';
  if (score >= 80) color = 'text-green-500';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${size === 'lg' ? 'w-40 h-40' : 'w-20 h-20'} flex items-center justify-center`}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-800"
          />
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={color}
          />
        </svg>
        <span className={`absolute font-bold ${color} ${size === 'lg' ? 'text-4xl' : 'text-xl'}`}>
          {score}
        </span>
      </div>
      <span className="mt-2 text-slate-400 font-medium uppercase tracking-wider text-sm">
        {label}
      </span>
    </div>
  );
};

export default RadialScore;
