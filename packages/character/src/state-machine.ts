import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP, EyeExpressionConfig } from './eye-expressions.js';

export type StateChangeListener = (newState: AtlasState, oldState: AtlasState, config: EyeExpressionConfig) => void;

export class CharacterStateMachine {
  private currentState: AtlasState = AtlasState.IDLE;
  private listeners: Set<StateChangeListener> = new Set();
  private stateHistory: { state: AtlasState; timestamp: number }[] = [];

  constructor(initialState: AtlasState = AtlasState.IDLE) {
    this.currentState = initialState;
    this.recordHistory(initialState);
  }

  public getState(): AtlasState {
    return this.currentState;
  }

  public getExpressionConfig(): EyeExpressionConfig {
    return EYE_EXPRESSION_MAP[this.currentState];
  }

  public setState(newState: AtlasState): boolean {
    if (this.currentState === newState) return false;

    const oldState = this.currentState;
    this.currentState = newState;
    this.recordHistory(newState);

    const config = EYE_EXPRESSION_MAP[newState];
    this.listeners.forEach((listener) => listener(newState, oldState, config));
    return true;
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    // Fire immediately for initial state setup
    listener(this.currentState, this.currentState, EYE_EXPRESSION_MAP[this.currentState]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getHistory(): ReadonlyArray<{ state: AtlasState; timestamp: number }> {
    return this.stateHistory;
  }

  private recordHistory(state: AtlasState): void {
    this.stateHistory.push({ state, timestamp: Date.now() });
    if (this.stateHistory.length > 50) {
      this.stateHistory.shift();
    }
  }
}

export const atlasCharacter = new CharacterStateMachine(AtlasState.IDLE);
