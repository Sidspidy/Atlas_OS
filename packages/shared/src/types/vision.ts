export interface ScreenshotPayload {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: string;
}

export interface VisualElement {
  id: string;
  type: 'button' | 'text' | 'input' | 'code' | 'error_dialog';
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface ErrorDiagnosticReport {
  detectedError: string;
  filePath?: string;
  lineNumber?: number;
  summary: string;
  suggestedFix: string;
}

export interface VisionAnalysisResult {
  summary: string;
  ocrText: string[];
  elements: VisualElement[];
  errorDiagnostic?: ErrorDiagnosticReport;
  processedLatencyMs: number;
}
