// DARCY128 Reset Processor Endpoint
// Resets the CPU to initial state

import { Handler } from '@netlify/functions';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface Darcy128Register {
  name: string;
  value: string; // 128-bit value as hex string
  type: 'general' | 'special';
}

interface Darcy128CPUState {
  registers: Darcy128Register[];
  pc: string;
  hi: string;
  lo: string;
  running: boolean;
  memory: { [address: string]: string };
}

interface ResetProcessorResponse {
  success: boolean;
  cpu_state: Darcy128CPUState;
  execution_history: string[];
  performance_metrics: {
    instructions_executed: number;
    simd_utilization: number;
    crypto_acceleration: number;
    memory_bandwidth: number;
  };
  message: string;
}

// ============================================================================
// 128-bit Arithmetic Utilities
// ============================================================================

class Int128 {
  static toString(value: bigint): string {
    return '0x' + value.toString(16).padStart(32, '0');
  }
}

// ============================================================================
// Memory System
// ============================================================================

class Darcy128Memory {
  private memory: { [address: string]: bigint } = {};
  private readonly MEMORY_SIZE = 8 * 1024 * 1024; // 8MB
  
  dump(start: number, length: number): { [address: string]: string } {
    const result: { [address: string]: string } = {};
    for (let i = 0; i < length; i += 16) {
      const addr = start + i;
      const addrStr = addr.toString();
      const value = this.memory[addrStr] || BigInt(0);
      result[addrStr] = Int128.toString(value);
    }
    return result;
  }
}

// ============================================================================
// CPU Core
// ============================================================================

class Darcy128CPU {
  private registers: bigint[] = new Array(32).fill(BigInt(0));
  private pc: bigint = BigInt(0);
  private hi: bigint = BigInt(0);
  private lo: bigint = BigInt(0);
  private memory: Darcy128Memory;
  private running: boolean = false;
  private executionHistory: string[] = [];
  private instructionsExecuted: number = 0;
  
  constructor() {
    this.memory = new Darcy128Memory();
  }
  
  reset(): void {
    this.registers.fill(BigInt(0));
    this.pc = BigInt(0);
    this.hi = BigInt(0);
    this.lo = BigInt(0);
    this.running = false;
    this.executionHistory = [];
    this.instructionsExecuted = 0;
  }
  
  getState(): Darcy128CPUState {
    const registers: Darcy128Register[] = [];
    for (let i = 0; i < 32; i++) {
      registers.push({
        name: `$${i}`,
        value: Int128.toString(this.registers[i]),
        type: 'general'
      });
    }
    
    return {
      registers,
      pc: Int128.toString(this.pc),
      hi: Int128.toString(this.hi),
      lo: Int128.toString(this.lo),
      running: this.running,
      memory: this.memory.dump(0, 256)
    };
  }
  
  getExecutionHistory(): string[] {
    return [...this.executionHistory];
  }
  
  getPerformanceMetrics() {
    return {
      instructions_executed: this.instructionsExecuted,
      simd_utilization: Math.min(100, this.instructionsExecuted * 2),
      crypto_acceleration: Math.min(500, this.instructionsExecuted * 5),
      memory_bandwidth: Math.min(100, this.instructionsExecuted * 1.5)
    };
  }
}

// ============================================================================
// Global CPU Instance
// ============================================================================

let globalCPU: Darcy128CPU | null = null;

function getCPU(): Darcy128CPU {
  if (!globalCPU) {
    globalCPU = new Darcy128CPU();
  }
  return globalCPU;
}

// ============================================================================
// Netlify Handler
// ============================================================================

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const cpu = getCPU();
    
    // Reset the CPU
    cpu.reset();
    
    const response: ResetProcessorResponse = {
      success: true,
      cpu_state: cpu.getState(),
      execution_history: cpu.getExecutionHistory(),
      performance_metrics: cpu.getPerformanceMetrics(),
      message: 'DARCY128 processor has been reset to initial state'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    const errorResponse: ResetProcessorResponse = {
      success: false,
      cpu_state: getCPU().getState(),
      execution_history: getCPU().getExecutionHistory(),
      performance_metrics: getCPU().getPerformanceMetrics(),
      message: `Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};
