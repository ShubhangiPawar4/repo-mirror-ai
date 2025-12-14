import React, { useState } from 'react';
import { extractRepoDetails, fetchRepoData } from './services/githubService';
import { analyzeRepositoryWithGemini } from './services/geminiService';
import { AnalysisResult, RepoMetadata } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [metadata, setMetadata] = useState<RepoMetadata | null>(null);
  const [step, setStep] = useState<string>(''); // For loading feedback

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setMetadata(null);

    try {
      setStep('Connecting to GitHub...');
      const details = extractRepoDetails(url);
      
      if (!details) {
        throw new Error("Invalid GitHub URL. Format: https://github.com/owner/repo");
      }

      setStep('Fetching repository files...');
      const repoData = await fetchRepoData(details.owner, details.repo);
      setMetadata(repoData.metadata);

      setStep('Consulting AI Mentor (Gemini)...');
      const analysis = await analyzeRepositoryWithGemini(
        repoData.metadata,
        repoData.fileStructure,
        repoData.readmeContent,
        repoData.dependencyFileContent,
        repoData.dependencyFileName
      );

      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const loadExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">RM</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              RepoMirror AI
            </span>
          </div>
          <div className="text-sm text-slate-400">Powered by Gemini 2.0</div>
        </div>
      </nav>

      {/* Hero / Input Section */}
      <div className={`transition-all duration-700 ease-in-out ${result ? 'py-8' : 'py-20 flex flex-col items-center justify-center min-h-[80vh]'}`}>
        <div className="w-full max-w-3xl px-4 text-center">
          {!result && (
            <>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                How good is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">code really?</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Get an instant AI-powered review of your GitHub repository. 
                Receive a score, brutally honest feedback, and a personalized roadmap to level up.
              </p>
            </>
          )}

          <form onSubmit={handleAnalyze} className="relative w-full max-w-xl mx-auto mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex">
              <input
                type="text"
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-l-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-mono"
              />
              <button
                type="submit"
                disabled={loading || !url}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 rounded-r-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Running</span>
                  </>
                ) : (
                  <span>Analyze</span>
                )}
              </button>
            </div>
          </form>

          {loading && (
             <div className="text-blue-400 font-mono text-sm animate-pulse">
               {step}
             </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg max-w-xl mx-auto mb-6 text-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {!result && !loading && (
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
              <span>Try:</span>
              <button onClick={() => loadExample('https://github.com/facebook/react')} className="hover:text-blue-400 underline decoration-slate-700 underline-offset-2">React</button>
              <button onClick={() => loadExample('https://github.com/axios/axios')} className="hover:text-blue-400 underline decoration-slate-700 underline-offset-2">Axios</button>
              <button onClick={() => loadExample('https://github.com/shadcn-ui/ui')} className="hover:text-blue-400 underline decoration-slate-700 underline-offset-2">Shadcn UI</button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && metadata && (
        <main className="px-4 pb-20">
          <AnalysisDashboard data={result} metadata={metadata} />
        </main>
      )}

      {/* Footer */}
       <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-600 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} RepoMirror AI. Designed for Developers.</p>
      </footer>
    </div>
  );
};

export default App;