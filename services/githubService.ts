import { RepoMetadata } from '../types';

interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string; // Base64 content for files
  encoding?: string;
  url: string;
}

export const extractRepoDetails = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;

    let repo = parts[1];
    // Remove .git extension if present to prevent 404s
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    return { owner: parts[0], repo };
  } catch (e) {
    return null;
  }
};

export const fetchRepoData = async (owner: string, repo: string) => {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Fetch basic metadata
  const metaResponse = await fetch(baseUrl, { headers });
  
  if (!metaResponse.ok) {
    if (metaResponse.status === 404) {
      throw new Error('Repository not found. Please check the URL and ensure it is public.');
    }
    if (metaResponse.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch repository metadata. Status: ${metaResponse.status}`);
  }
  const metaJson = await metaResponse.json();

  const metadata: RepoMetadata = {
    name: metaJson.name,
    owner: metaJson.owner.login,
    description: metaJson.description || 'No description provided.',
    stars: metaJson.stargazers_count,
    forks: metaJson.forks_count,
    openIssues: metaJson.open_issues_count,
    lastUpdate: metaJson.updated_at,
    language: metaJson.language || 'Unknown',
  };

  // Fetch root contents (file structure)
  let fileStructure: string[] = [];
  let readmeContent = '';
  let dependencyFileContent = '';
  let dependencyFileName: string | undefined = undefined;

  try {
    const contentsResponse = await fetch(`${baseUrl}/contents`, { headers });
    
    if (contentsResponse.ok) {
      const contentsJson: GitHubContent[] = await contentsResponse.json();
      
      if (Array.isArray(contentsJson)) {
        // Extract file names for structure analysis
        fileStructure = contentsJson.map(f => `${f.type}: ${f.name}`);

        // Try to find key files
        const readmeFile = contentsJson.find(f => f.name.toLowerCase() === 'readme.md');
        const packageFile = contentsJson.find(f => f.name === 'package.json' || f.name === 'requirements.txt' || f.name === 'go.mod' || f.name === 'Cargo.toml' || f.name === 'pom.xml' || f.name === 'Gemfile');

        if (readmeFile && readmeFile.url) {
          const rRes = await fetch(readmeFile.url, { headers }); 
          if (rRes.ok) {
            const rJson = await rRes.json();
            if (rJson.content && rJson.encoding === 'base64') {
                try {
                    // Normalize base64 string
                    readmeContent = atob(rJson.content.replace(/\s/g, ''));
                } catch (e) {
                    console.warn("Failed to decode README", e);
                }
            }
          }
        }

        if (packageFile && packageFile.url) {
          dependencyFileName = packageFile.name;
          const pRes = await fetch(packageFile.url, { headers });
          if (pRes.ok) {
            const pJson = await pRes.json();
            if (pJson.content && pJson.encoding === 'base64') {
                try {
                    dependencyFileContent = atob(pJson.content.replace(/\s/g, ''));
                } catch (e) {
                    console.warn("Failed to decode dependency file", e);
                }
            }
          }
        }
      }
    } else if (contentsResponse.status === 404) {
        // Handle empty repositories gracefully
        fileStructure = ["(Empty Repository)"];
    }
  } catch (error) {
    console.warn("Non-critical error fetching contents:", error);
  }

  return {
    metadata,
    fileStructure,
    readmeContent,
    dependencyFileContent,
    dependencyFileName
  };
};