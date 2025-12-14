import React from 'react';
import { AnalysisResult, RepoMetadata } from '../types';
import RadialScore from './RadialScore';
import RoadmapCard from './RoadmapCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: AnalysisResult;
  metadata: RepoMetadata;
}

const AnalysisDashboard: React.FC<Props> = ({ data, metadata }) => {
  const chartData = [
    { subject: 'Code Quality', A: data.breakdown.codeQuality, fullMark: 100 },
    { subject: 'Docs', A: data.breakdown.documentation, fullMark: 100 },
    { subject: 'Structure', A: data.breakdown.structure, fullMark: 100 },
    { subject: 'Testing', A: data.breakdown.testing, fullMark: 100 },
    { subject: 'Relevance', A: data.breakdown.relevance, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-xl font-semibold text-slate-300 mb-4">{metadata.name}</h2>
          <RadialScore score={data.score} label="Overall Score" />
          <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-sm font-mono text-blue-300 border border-blue-900">
            Level: {data.level}
          </div>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-purple-400">AI Summary</span>
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg mb-4">
            {data.summary}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
               <h4 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Strengths</h4>
               <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                 {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
            </div>
            <div>
               <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Weaknesses</h4>
               <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                 {data.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg lg:col-span-1 min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-4">Metric Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#c4b5fd' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end mb-2">
             <h3 className="text-2xl font-bold text-white">
                Personalized Roadmap
                <span className="block text-sm font-normal text-slate-400 mt-1">Actionable steps to improve this repository</span>
             </h3>
          </div>
          
          <div className="space-y-3">
            {data.roadmap.map((item, idx) => (
              <RoadmapCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Footer */}
      <div className="border-t border-slate-800 pt-6">
        <h4 className="text-sm text-slate-500 mb-3">Detected Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono border border-slate-700">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
