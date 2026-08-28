import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api/settings')
export class SettingsController {
  private customOpenAiKey: string = process.env.OPENAI_API_KEY || '';
  private customGeminiKey: string = process.env.GEMINI_API_KEY || '';
  private activeProvider: 'GEMINI' | 'OPENAI' = (process.env.GEMINI_API_KEY ? 'GEMINI' : 'OPENAI');

  @Get('keys')
  getKeys() {
    const openAiKey = this.customOpenAiKey || process.env.OPENAI_API_KEY || '';
    const geminiKey = this.customGeminiKey || process.env.GEMINI_API_KEY || '';

    return {
      success: true,
      activeProvider: this.activeProvider,
      hasOpenAiKey: !!openAiKey,
      hasGeminiKey: !!geminiKey,
      maskedOpenAiKey: openAiKey ? `${openAiKey.slice(0, 7)}...${openAiKey.slice(-4)}` : 'Unconfigured',
      maskedGeminiKey: geminiKey ? `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}` : 'Unconfigured',
      selectedModel: this.activeProvider === 'GEMINI' ? 'gemini-3.6-flash' : 'gpt-4o-mini',
      selectedEmbedding: this.activeProvider === 'GEMINI' ? 'gemini-embedding-001' : 'text-embedding-3-small'
    };
  }

  @Post('provider')
  setProvider(@Body() body: { provider: 'GEMINI' | 'OPENAI' }) {
    if (body.provider === 'GEMINI' || body.provider === 'OPENAI') {
      this.activeProvider = body.provider;
    }
    return { success: true, activeProvider: this.activeProvider };
  }

  @Post('verify-gemini-key')
  async verifyGeminiKey(@Body() body: { apiKey?: string }) {
    const targetKey = body.apiKey?.trim() || this.customGeminiKey || process.env.GEMINI_API_KEY;

    if (!targetKey) {
      return {
        success: false,
        error: 'No Gemini API Key provided. Enter your Gemini API key to test connection.'
      };
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${targetKey}`);

      if (res.ok) {
        process.env.GEMINI_API_KEY = targetKey;
        this.customGeminiKey = targetKey;
        this.activeProvider = 'GEMINI';
        return {
          success: true,
          message: 'Google Gemini Pro API Key verified successfully! Connected to gemini-3.6-flash, gemini-2.5-flash & gemini-embedding-001.'
        };
      } else {
        const errData = await res.json();
        return {
          success: false,
          error: errData.error?.message || 'Failed to authenticate with Google Gemini API.'
        };
      }
    } catch (e: any) {
      return {
        success: false,
        error: `Network request failed: ${e.message}`
      };
    }
  }

  @Post('verify-key')
  async verifyOpenAiKey(@Body() body: { apiKey?: string }) {
    const targetKey = body.apiKey?.trim() || this.customOpenAiKey || process.env.OPENAI_API_KEY;

    if (!targetKey) {
      return {
        success: false,
        error: 'No OpenAI API Key provided. Enter your sk-... key to test connection.'
      };
    }

    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${targetKey}` }
      });

      if (res.ok) {
        process.env.OPENAI_API_KEY = targetKey;
        this.customOpenAiKey = targetKey;
        this.activeProvider = 'OPENAI';
        return {
          success: true,
          message: 'OpenAI API Key verified successfully! Connected to gpt-4o, gpt-4o-mini & text-embedding-3-small.'
        };
      } else {
        const errData = await res.json();
        return {
          success: false,
          error: errData.error?.message || 'Failed to authenticate with OpenAI API.'
        };
      }
    } catch (e: any) {
      return {
        success: false,
        error: `Network request failed: ${e.message}`
      };
    }
  }
}
