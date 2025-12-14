export interface RoadmapItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Code Quality' | 'Documentation' | 'Testing' | 'DevOps' | 'Structure';
}

export interface AnalysisResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  breakdown: {
    codeQuality: number;
    documentation: number;
    structure: number;
    testing: number;
    relevance: number;
  };
  roadmap: RoadmapItem[];
  strengths: string[];
  weaknesses: string[];
  techStack: string[];
}

export interface RepoMetadata {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  language: string;
  fileCount?: number;
}
