// DARCY128 State Service
// Handles state persistence with the server
// CPU emulation happens client-side

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface SaveStateRequest {
  session_id: string;
  cpu_state: {
    registers: Array<{ name: string; value: string; type: string }>;
    pc: string;
    hi: string;
    lo: string;
    running: boolean;
    memory: { [address: string]: string };
    execution_mode: 'mips32' | 'darcy128';
  };
  execution_history: string[];
  performance_metrics: {
    instructions_executed: number;
    simd_utilization: number;
    crypto_acceleration: number;
    memory_bandwidth: number;
  };
}

export interface LoadStateResponse {
  success: boolean;
  cpu_state?: {
    registers: Array<{ name: string; value: string; type: string }>;
    pc: string;
    hi: string;
    lo: string;
    running: boolean;
    memory: { [address: string]: string };
    execution_mode: 'mips32' | 'darcy128';
  };
  execution_history?: string[];
  performance_metrics?: {
    instructions_executed: number;
    simd_utilization: number;
    crypto_acceleration: number;
    memory_bandwidth: number;
  };
  message: string;
  session_id: string;
  timestamp: string;
  error?: string;
}

export interface SaveStateResponse {
  success: boolean;
  message: string;
  session_id: string;
  timestamp: string;
  error?: string;
}

// ============================================================================
// State Service Class
// ============================================================================

export class Darcy128StateService {
  private baseUrl: string;
  private sessionId: string;

  constructor(sessionId?: string) {
    // Use Netlify functions URL in production, localhost in development
    this.baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888/.netlify/functions'
      : '/.netlify/functions';
    
    // Generate session ID if not provided
    this.sessionId = sessionId || this.generateSessionId();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Save CPU state to server
  async saveState(cpuState: any, executionHistory: string[], performanceMetrics: any): Promise<SaveStateResponse> {
    const request: SaveStateRequest = {
      session_id: this.sessionId,
      cpu_state: cpuState,
      execution_history: executionHistory,
      performance_metrics: performanceMetrics
    };

    return this.makeRequest('/save-state', 'POST', request);
  }

  // Load CPU state from server
  async loadState(): Promise<LoadStateResponse> {
    return this.makeRequest(`/load-state?session_id=${this.sessionId}`, 'GET');
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Set session ID
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.makeRequest('/health-check', 'GET');
  }
}
