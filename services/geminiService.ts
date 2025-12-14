import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RepoMetadata } from "../types";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY not found in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeRepositoryWithGemini = async (
  metadata: RepoMetadata,
  structure: string[],
  readme: string,
  dependencyContent: string,
  dependencyFileName?: string
): Promise<AnalysisResult> => {
  
  const prompt = `
    You are a world-class Senior Software Engineer and Mentor.
    Your task is to analyze a student's GitHub repository based on the provided metadata, file structure, and key files.
    
    **Repository Context:**
    - Name: ${metadata.name}
    - Description: ${metadata.description}
    - Language: ${metadata.language}
    - Last Updated: ${metadata.lastUpdate}
    - Root Files: ${JSON.stringify(structure)}
    
    **README Content (Snippet):**
    ${readme.slice(0, 3000)} ${readme.length > 3000 ? '...(truncated)' : ''}

    **Dependency File (${dependencyFileName || 'None'}):**
    ${dependencyContent.slice(0, 2000)}

    **Evaluation Criteria:**
    1. **Code Quality & Structure:** Based on file organization, standard conventions for the language.
    2. **Documentation:** Quality of README (installation, usage, features).
    3. **Testing:** Presence of test files (e.g., *.test.js, *_test.py, tests/ folder).
    4. **Maintenance:** Commit consistency (infer from last update), .gitignore usage, CI/CD config presence (e.g., .github/workflows).
    5. **Relevance:** Is this a modern, useful project?

    **Goal:**
    Provide a score (0-100), a level, a brutally honest but constructive summary, a breakdown of scores, and a highly specific roadmap.
  `;

  try {
    if (!apiKey) {
      throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Overall score out of 100" },
            level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] },
            summary: { type: Type.STRING, description: "A 2-3 sentence executive summary of the repo quality." },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                codeQuality: { type: Type.INTEGER },
                documentation: { type: Type.INTEGER },
                structure: { type: Type.INTEGER },
                testing: { type: Type.INTEGER },
                relevance: { type: Type.INTEGER }
              },
              required: ["codeQuality", "documentation", "structure", "testing", "relevance"]
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Specific actionable advice" },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  category: { type: Type.STRING, enum: ["Code Quality", "Documentation", "Testing", "DevOps", "Structure"] }
                },
                required: ["title", "description", "priority", "category"]
              }
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detected technologies/libraries" }
          },
          required: ["score", "level", "summary", "breakdown", "roadmap", "strengths", "weaknesses", "techStack"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze repository with AI.");
  }
};
