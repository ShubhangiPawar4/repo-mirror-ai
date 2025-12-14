# RepoMirror AI 🚀

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5-8e44ad?logo=google-gemini)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind-38bdf8?logo=tailwindcss)

**RepoMirror AI** is an intelligent developer tool that acts as a virtual mentor. It evaluates GitHub repositories and converts raw code into a meaningful **Score**, **Executive Summary**, and a **Personalized Roadmap**.

By leveraging the power of **Google Gemini 2.5**, this application helps students and developers understand how recruiters and senior engineers perceive their code, providing actionable feedback to improve code quality, documentation, and maintainability.

---

## 🌟 Key Features

- **🔍 Automatic Repository Scanning**: Fetches file structure, languages, and key files (README, package.json, etc.) via the GitHub API.
- **🤖 AI-Powered Analysis**: Uses **Gemini 2.0 Flash** to analyze code quality, structure, testing, and relevance.
- **📊 Visual Metrics**:
  - **Radial Score**: A quick 0-100 rating of the repository.
  - **Radar Chart**: Visual breakdown of 5 key dimensions (Code Quality, Docs, Structure, Testing, Relevance).
- **🗺️ Personalized Roadmap**: Generates specific, actionable steps (e.g., "Add Unit Tests," "Setup CI/CD") to improve the project.
- **⚡ Tech Stack Detection**: Automatically identifies and lists the technologies used in the project.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Data Visualization**: Recharts
- **API**: GitHub REST API

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A **Google Gemini API Key** (Get it [here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/repo-mirror-ai.git
   cd repo-mirror-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API Key.
   *Note: Since this is a client-side demo, the key is accessed via `process.env`. In a production app, you should proxy requests through a backend.*

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal).

---

## 🧠 How It Works

1. **Input**: The user provides a public GitHub Repository URL.
2. **Fetch**: The app queries the GitHub API to retrieve:
   - Repository Metadata (Stars, Forks, Description).
   - File Tree (to analyze structure).
   - Content of `README.md` (to analyze documentation).
   - Content of Dependency files (e.g., `package.json`) to understand the tech stack.
3. **Analyze**: This context is compiled into a structured prompt and sent to **Gemini 2.0 Flash**.
4. **Output**: The AI returns a JSON response containing the score, summary, and roadmap, which is rendered instantly on the dashboard.

---

## 📸 Usage

1. Enter a GitHub URL (e.g., `https://github.com/facebook/react`).
2. Click **Analyze**.
3. Wait for the "Connecting to GitHub", "Fetching Files", and "Consulting AI Mentor" steps to complete.
4. Review your personalized dashboard!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
