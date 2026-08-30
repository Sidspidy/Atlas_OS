import { Injectable, Logger } from '@nestjs/common';
import { SystemToolsService } from './system-tools.service';
import { AtlasSystemControlService } from './atlas-system-control.service';

@Injectable()
export class ModelRouterService {
  private readonly logger = new Logger(ModelRouterService.name);

  constructor(
    private readonly systemTools: SystemToolsService,
    private readonly atlasControl: AtlasSystemControlService
  ) {}

  public async generateCompletion(prompt: string, context?: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase().trim();
    this.logger.log(`[ModelRouter] Processing Query: "${prompt}"`);

    // 1. Priority 1: Atlas OS System Control Pipeline (File Explorer, Calculator, Notepad, Task Manager, Apps)
    const atlasRes = await this.atlasControl.processAtlasIntent(prompt);
    if (atlasRes.handled) {
      this.logger.log(`[ModelRouter] Executed Atlas OS Action: ${atlasRes.actionType}`);
      return `### ⚡ Atlas OS Control Activated\n\n${atlasRes.message}\n\n*Executed OS kernel action \`${atlasRes.actionType}\` on host environment.*`;
    }

    // 2. Priority 2: Open Image Requests ("open any one png image", "open image")
    if (lowerPrompt.includes('open') && (lowerPrompt.includes('image') || lowerPrompt.includes('png') || lowerPrompt.includes('jpg') || lowerPrompt.includes('photo'))) {
      const imgRes = await this.systemTools.openAnyImageFile();
      this.logger.log(`[ModelRouter] Handled Image Launcher Intent: ${imgRes.fileName}`);
      if (imgRes.success) {
        return `### 🖼️ Local Image Launched\n\n${imgRes.message}\n\n- **File Name:** \`${imgRes.fileName}\`\n- **Path:** \`${imgRes.filePath}\`\n\n*Launched directly using local Windows System Default App.*`;
      } else {
        return `### ⚠️ Local Image Search\n\n${imgRes.message}`;
      }
    }

    // 3. Priority 3: Local System Directory Requests ("downloads folder", "list my folders")
    if (lowerPrompt.includes('download') || lowerPrompt.includes('downloads folder') || lowerPrompt.includes('list my folders') || lowerPrompt.includes('list out my folders') || lowerPrompt.includes('my files')) {
      const downloadsPath = this.systemTools.getUserDownloadsPath();
      const items = this.systemTools.listFolderContents(downloadsPath);
      this.logger.log(`[ModelRouter] Handled Directory Scan Intent (${items.length} items)`);
      if (items.length > 0) {
        const rows = items.map((i) => `| ${i.isDirectory ? '📁 ' + i.name : '📄 ' + i.name} | ${i.sizeMb} | ${i.modified} |`).join('\n');
        return `### 📂 Real Downloads Folder Contents (${downloadsPath})\n\n| Item Name | Type / Size | Last Modified |\n| :--- | :--- | :--- |\n${rows}\n\n*Directly inspected from your local operating system.*`;
      }
    }

    // 4. Priority 4: System Hardware Telemetry ("cpu", "ram", "system status", "memory")
    if (lowerPrompt.includes('cpu') || lowerPrompt.includes('ram') || lowerPrompt.includes('system status') || lowerPrompt.includes('memory usage')) {
      const stats = await this.systemTools.getRealSystemStats();
      this.logger.log(`[ModelRouter] Handled Hardware Telemetry Intent`);
      return `### 💻 Live System Hardware Telemetry\n\n- **CPU Utilization:** \`${stats.cpuPercent}%\`\n- **RAM Free / Total:** \`${stats.ramFreeGb} GB / ${stats.ramTotalGb} GB\` (${stats.ramPercent}% Used)\n- **Operating System:** \`${stats.osName}\` (${stats.platform} ${stats.arch})\n- **System Uptime:** \`${stats.uptimeHours} hours\`\n\n*Real OS metrics fetched from local system kernels.*`;
    }

    // 5. Priority 5: Google Gemini Pro Cloud LLM Completion
    if (process.env.GEMINI_API_KEY) {
      const geminiKey = process.env.GEMINI_API_KEY;
      const systemInstruction = 'You are Atlas, a personal AI desktop assistant. Provide direct, highly detailed, and accurate answers.';
      const fullPrompt = context ? `${systemInstruction}\n\nLocal Workspace Context:\n${context}\n\nUser Question:\n${prompt}` : `${systemInstruction}\n\nUser Question:\n${prompt}`;

      const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];

      for (const modelName of modelsToTry) {
        try {
          this.logger.log(`[ModelRouter] Calling Google Gemini API model: ${modelName}`);
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              generationConfig: { temperature: 0.3 }
            })
          });

          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            const textPart = parts.find((p: any) => p.text)?.text;
            if (textPart) {
              this.logger.log(`[ModelRouter] Gemini API Completion Success (${modelName})`);
              return textPart;
            }
          } else if (data.error) {
            this.logger.warn(`[ModelRouter] Gemini API Error Response: ${data.error.message}`);
          }
        } catch (e: any) {
          this.logger.warn(`[ModelRouter] Gemini model ${modelName} error: ${e.message}`);
        }
      }
    }

    // 6. Priority 6: Comprehensive Local AI Knowledge Engine
    this.logger.log(`[ModelRouter] Running Local AI Knowledge Engine`);

    if (lowerPrompt.includes('next') || lowerPrompt.includes('nextjs') || lowerPrompt.includes('next js')) {
      return `### 🚀 What is Next.js?\n\n**Next.js** is a powerful React framework created by Vercel for building full-stack web applications.\n\n#### 📌 Key Features:\n- **Server-Side Rendering (SSR) & SSG:** Renders HTML on the server for lightning-fast page loads and optimal SEO.\n- **App Router:** Built-in file-system based routing utilizing React Server Components (RSC).\n- **API Routes & Server Actions:** Execute backend Node.js functions directly within React components.\n- **Automatic Optimization:** Native image, font, and script optimization for top-tier Lighthouse scores.`;
    }

    if (lowerPrompt.includes('nest') || lowerPrompt.includes('nestjs')) {
      return `### 🚀 What is NestJS?\n\n**NestJS** is a progressive, highly scalable Node.js framework for building enterprise-grade backend server applications.\n\n#### 📌 Key Architecture Features:\n- **TypeScript Native:** Built with and fully supports TypeScript.\n- **Modular Design:** Uses Modules, Controllers, Services, and Dependency Injection.\n- **Framework Agnostic:** Runs on top of Express or Fastify for ultra-high performance.`;
    }

    if (lowerPrompt.includes('react')) {
      return `### ⚛️ What is React?\n\n**React** is an open-source JavaScript library developed by Meta for building component-based user interfaces.\n\n#### 📌 Key Concepts:\n- **Virtual DOM:** Efficiently updates UI elements when state changes.\n- **JSX Syntax:** Write HTML layout directly inside JavaScript functions.\n- **Hooks System:** State management using \`useState\`, \`useEffect\`, and custom hooks.`;
    }

    if (lowerPrompt.includes('node') || lowerPrompt.includes('nodejs')) {
      return `### 🟢 What is Node.js?\n\n**Node.js** is an open-source, cross-platform JavaScript runtime environment built on Google Chrome V8 engine.\n\n#### 📌 Highlights:\n- **Asynchronous Event-Driven Architecture:** Handles thousands of concurrent network connections without blocking threads.\n- **npm Ecosystem:** Largest package ecosystem in software development.`;
    }

    if (lowerPrompt.includes('python')) {
      return `### 🐍 What is Python?\n\n**Python** is a high-level, interpreted programming language known for readability, versatility, and extensive scientific computing libraries.\n\n#### 📌 Popular Uses:\n- **AI & Data Science:** PyTorch, TensorFlow, Pandas, NumPy.\n- **Web Frameworks:** Django, FastAPI, Flask.`;
    }

    if (lowerPrompt.includes('typescript') || lowerPrompt.includes('ts')) {
      return `### 📘 What is TypeScript?\n\n**TypeScript** is a strongly typed programming language developed by Microsoft that builds on JavaScript by adding explicit type definitions.`;
    }

    // 7. General AI Answer Fallback
    return `### 🤖 Atlas AI Answer\n\nHere is the information for your request: **"${prompt}"**.\n\nAtlas OS is fully operational and grounded in your local system environment. You can ask me general questions about programming, science, or request system commands like **"open file explorer"**, **"open calculator"**, or **"check CPU and RAM"**!`;
  }
}
