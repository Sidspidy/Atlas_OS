import { Injectable } from '@nestjs/common';
import { SystemToolsService } from './system-tools.service';

@Injectable()
export class ModelRouterService {
  constructor(private readonly systemTools: SystemToolsService) {}

  public async generateCompletion(prompt: string, context?: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase();

    // 1. Intercept Local System Directory Requests ("downloads folder", "my files", "documents", etc.)
    if (lowerPrompt.includes('download') || lowerPrompt.includes('downloads folder') || lowerPrompt.includes('list my folders') || lowerPrompt.includes('list out my folders')) {
      const downloadsPath = this.systemTools.getUserDownloadsPath();
      const items = this.systemTools.listFolderContents(downloadsPath);
      if (items.length > 0) {
        const rows = items.map((i) => `| ${i.isDirectory ? '📁 ' + i.name : '📄 ' + i.name} | ${i.sizeMb} | ${i.modified} |`).join('\n');
        return `### 📂 Real Downloads Folder Contents (${downloadsPath})\n\n| Item Name | Type / Size | Last Modified |\n| :--- | :--- | :--- |\n${rows}\n\n*Directly inspected from your local operating system.*`;
      }
    }

    // 2. Intercept System Telemetry Requests ("cpu", "ram", "system stats", "memory")
    if (lowerPrompt.includes('cpu') || lowerPrompt.includes('ram') || lowerPrompt.includes('system status') || lowerPrompt.includes('memory usage')) {
      const stats = await this.systemTools.getRealSystemStats();
      return `### 💻 Live System Hardware Telemetry\n\n- **CPU Utilization:** \`${stats.cpuPercent}%\`\n- **RAM Free / Total:** \`${stats.ramFreeGb} GB / ${stats.ramTotalGb} GB\` (${stats.ramPercent}% Used)\n- **Operating System:** \`${stats.osName}\` (${stats.platform} ${stats.arch})\n- **System Uptime:** \`${stats.uptimeHours} hours\`\n\n*Real OS metrics fetched from local system kernels.*`;
    }

    // 3. Intercept Antigravity IDE / Code Editor Requests
    if (lowerPrompt.includes('antigravity') || lowerPrompt.includes('open editor') || lowerPrompt.includes('open code')) {
      const res = await this.systemTools.openInEditor('antigravity', 'e:/my_projects');
      return `### 🚀 Antigravity IDE Integration\n\n${res.message}\n\n*Launched target workspace in Antigravity IDE.*`;
    }

    // 4. Google Gemini Pro Cloud Completion
    if (process.env.GEMINI_API_KEY) {
      const geminiKey = process.env.GEMINI_API_KEY;
      const systemInstruction = 'You are Atlas, a personal AI desktop assistant. Give direct, intelligent, and accurate responses.';
      const fullPrompt = context ? `${systemInstruction}\n\nLocal Workspace Context:\n${context}\n\nUser Question:\n${prompt}` : `${systemInstruction}\n\nUser Question:\n${prompt}`;

      const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-2.5-flash'
      ];

      for (const modelName of modelsToTry) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: fullPrompt }]
                }
              ],
              generationConfig: {
                temperature: 0.3
              }
            })
          });

          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            const textPart = parts.find((p: any) => p.text)?.text;
            if (textPart) {
              return textPart;
            }
          }
        } catch (e) {
          console.warn(`[ModelRouter] Gemini model ${modelName} call failed, trying next...`);
        }
      }
    }

    // 5. Real Local Fallback Output (Clean & Grounded)
    const items = this.systemTools.listFolderContents();
    const folderSummary = items.slice(0, 5).map((i) => i.name).join(', ');
    return `Atlas AI: Here are your active local workspace items: **${folderSummary}**. Ask me to open files, check hardware telemetry, or run code commands in Antigravity IDE!`;
  }
}
