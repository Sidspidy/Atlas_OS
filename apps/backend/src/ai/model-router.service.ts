import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelRouterService {
  public async generateCompletion(prompt: string, context?: string): Promise<string> {
    // 1. Google Gemini Pro API Priority
    if (process.env.GEMINI_API_KEY) {
      const geminiKey = process.env.GEMINI_API_KEY;
      const systemInstruction = 'You are Atlas, a personal AI desktop companion. Be helpful, direct, intelligent, grounded, and concise.';
      const fullPrompt = context ? `${systemInstruction}\n\nLocal Workspace Context:\n${context}\n\nUser Question:\n${prompt}` : `${systemInstruction}\n\nUser Question:\n${prompt}`;

      const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-latest',
        'gemini-2.5-pro',
        'gemini-1.5-flash'
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
          console.warn(`[ModelRouter] Gemini model ${modelName} failed, trying next model...`, e);
        }
      }
    }

    // 2. OpenAI API Priority
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are Atlas, a personal AI desktop companion. Be helpful, direct, intelligent, and grounded in the local computer context.'
              },
              {
                role: 'user',
                content: context ? `Local Workspace Context:\n${context}\n\nUser Question:\n${prompt}` : prompt
              }
            ],
            temperature: 0.3
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } catch (e) {
        console.warn('[ModelRouter] OpenAI completion call failed, using local assistant fallback:', e);
      }
    }

    // 3. Fallback
    return this.generateLocalAssistantResponse(prompt, context);
  }

  private generateLocalAssistantResponse(prompt: string, context?: string): string {
    return `Atlas Assistant: I received your request "${prompt}". I am inspecting your local workspace files and ready for your development commands. ${context ? `\n\nGrounded Context:\n${context}` : ''}`;
  }
}
