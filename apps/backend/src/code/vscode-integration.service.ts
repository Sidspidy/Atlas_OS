import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { VSCodeOpenPayload } from '@atlas-os/shared';

@Injectable()
export class VSCodeIntegrationService {
  public openInEditor(payload: VSCodeOpenPayload & { editor?: 'antigravity' | 'vscode' }): Promise<{ success: boolean; editor: string; command: string; error?: string }> {
    return new Promise((resolve) => {
      const editorCmd = payload.editor === 'antigravity' ? 'antigravity' : 'code';
      let command = `${editorCmd} .`;

      if (payload.filePath) {
        if (payload.line) {
          command = `${editorCmd} -g "${payload.filePath}:${payload.line}"`;
        } else {
          command = `${editorCmd} "${payload.filePath}"`;
        }
      } else if (payload.projectRoot) {
        command = `${editorCmd} "${payload.projectRoot}"`;
      }

      exec(command, (error) => {
        if (error && payload.editor === 'antigravity') {
          // Fallback to agy CLI or VS Code if antigravity CLI binary name differs
          const fallbackCmd = payload.filePath ? `agy "${payload.filePath}"` : 'agy .';
          exec(fallbackCmd, (err2) => {
            if (err2) {
              const codeCmd = payload.filePath ? `code "${payload.filePath}"` : 'code .';
              exec(codeCmd, (err3) => {
                resolve({ success: !err3, editor: 'VS Code Fallback', command: codeCmd, error: err3?.message });
              });
            } else {
              resolve({ success: true, editor: 'Antigravity IDE (agy)', command: fallbackCmd });
            }
          });
        } else if (error) {
          resolve({ success: false, editor: editorCmd, command, error: error.message });
        } else {
          resolve({ success: true, editor: payload.editor === 'antigravity' ? 'Antigravity IDE' : 'VS Code', command });
        }
      });
    });
  }

  public openInVSCode(payload: VSCodeOpenPayload): Promise<{ success: boolean; command: string; error?: string }> {
    return this.openInEditor({ ...payload, editor: 'vscode' });
  }
}
