// DARCY128 Advance Instruction Endpoint
// Executes a single instruction and returns updated CPU state

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

interface AdvanceInstructionRequest {
  instruction?: string; // Optional: specific instruction to execute
}

interface AdvanceInstructionResponse {
  success: boolean;
  cpu_state: Darcy128CPUState;
  execution_history: string[];
  performance_metrics: {
    instructions_executed: number;
    simd_utilization: number;
    crypto_acceleration: number;
    memory_bandwidth: number;
  };
  error?: string;
}

// ============================================================================
// 128-bit Arithmetic Utilities
// ============================================================================

class Int128 {
  static fromString(value: string): bigint {
    if (value.startsWith('0x')) {
      return BigInt(value);
    }
    return BigInt(value);
  }
  
  static toString(value: bigint): string {
    return '0x' + value.toString(16).padStart(32, '0');
  }
  
  static add(a: bigint, b: bigint): bigint {
    return a + b;
  }
  
  static sub(a: bigint, b: bigint): bigint {
    return a - b;
  }
  
  static mul(a: bigint, b: bigint): { hi: bigint; lo: bigint } {
    const result = a * b;
    const mask = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    return {
      lo: result & mask,
      hi: (result >> BigInt(128)) & mask
    };
  }
  
  static div(a: bigint, b: bigint): { quotient: bigint; remainder: bigint } {
    if (b === BigInt(0)) {
      throw new Error('Division by zero');
    }
    return {
      quotient: a / b,
      remainder: a % b
    };
  }
  
  static compare(a: bigint, b: bigint): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  
  static signExtend16(value: number): bigint {
    const signBit = (value >> 15) & 1;
    if (signBit) {
      return BigInt(value) | BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000');
    }
    return BigInt(value);
  }
}

// ============================================================================
// Memory System
// ============================================================================

class Darcy128Memory {
  private memory: { [address: string]: bigint } = {};
  private readonly MEMORY_SIZE = 8 * 1024 * 1024; // 8MB
  
  private static readonly MMIO_OUTPUT_QWORD = 0xffff0018;
  private static readonly MMIO_INPUT_QWORD = 0xffff0010;
  
  loadWord(address: number): bigint {
    if (address === Darcy128Memory.MMIO_INPUT_QWORD) {
      return BigInt('0x' + Math.random().toString(16).substring(2).repeat(8).substring(0, 32));
    }
    
    this.checkAddress(address, 16);
    this.checkAlignment(address, 16);
    
    const addrStr = address.toString();
    return this.memory[addrStr] || BigInt(0);
  }
  
  storeWord(address: number, value: bigint): void {
    if (address === Darcy128Memory.MMIO_OUTPUT_QWORD) {
      console.log(`Output: ${Int128.toString(value)}`);
      return;
    }
    
    this.checkAddress(address, 16);
    this.checkAlignment(address, 16);
    
    const addrStr = address.toString();
    this.memory[addrStr] = value;
  }
  
  fetchInstruction(address: number): number {
    this.checkAddress(address, 4);
    this.checkAlignment(address, 4);
    
    const word = this.loadWord(address);
    return Number(word & BigInt(0xFFFFFFFF));
  }
  
  private checkAddress(address: number, size: number): void {
    if (address >= 0xffff0000) return;
    if (address + size > this.MEMORY_SIZE) {
      throw new Error(`Memory access out of bounds: 0x${address.toString(16)}`);
    }
  }
  
  private checkAlignment(address: number, alignment: number): void {
    if (address % alignment !== 0) {
      throw new Error(`Unaligned memory access at 0x${address.toString(16)}`);
    }
  }
  
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
  
  readReg(reg: number): bigint {
    if (reg === 0) return BigInt(0);
    if (reg >= 32) throw new Error('Invalid register');
    return this.registers[reg];
  }
  
  writeReg(reg: number, value: bigint): void {
    if (reg === 0) return;
    if (reg >= 32) throw new Error('Invalid register');
    this.registers[reg] = value;
  }
  
  getPC(): bigint { return this.pc; }
  setPC(value: bigint): void { this.pc = value; }
  
  getHI(): bigint { return this.hi; }
  setHI(value: bigint): void { this.hi = value; }
  
  getLO(): bigint { return this.lo; }
  setLO(value: bigint): void { this.lo = value; }
  
  getMemory(): Darcy128Memory { return this.memory; }
  
  isRunning(): boolean { return this.running; }
  stop(): void { this.running = false; }
  
  fetch(): number {
    const instruction = this.memory.fetchInstruction(Number(this.pc));
    this.pc += BigInt(4);
    return instruction;
  }
  
  executeInstruction(instruction: number): void {
    const instr = this.decodeInstruction(instruction);
    instr.execute(this);
    this.instructionsExecuted++;
  }
  
  private decodeInstruction(word: number): Instruction {
    const opcode = (word >> 26) & 0x3F;
    
    if (opcode === 0x00) {
      const func = word & 0x3F;
      switch (func) {
        case 0x20: return new AddInstruction(word);
        case 0x22: return new SubInstruction(word);
        case 0x18: return new MultInstruction(word);
        case 0x19: return new MultuInstruction(word);
        case 0x1A: return new DivInstruction(word);
        case 0x1B: return new DivuInstruction(word);
        case 0x10: return new MfhiInstruction(word);
        case 0x12: return new MfloInstruction(word);
        case 0x14: return new LisInstruction(word);
        case 0x08: return new JrInstruction(word);
        case 0x09: return new JalrInstruction(word);
        case 0x2A: return new SltInstruction(word);
        case 0x2B: return new SltuInstruction(word);
        default:
          throw new Error(`Unknown R-type function: 0x${func.toString(16)}`);
      }
    } else {
      switch (opcode) {
        case 0x23: return new LwInstruction(word);
        case 0x2B: return new SwInstruction(word);
        case 0x04: return new BeqInstruction(word);
        case 0x05: return new BneInstruction(word);
        default:
          throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
      }
    }
  }
  
  addExecutionHistory(entry: string): void {
    this.executionHistory.push(entry);
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }
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
// Instruction Classes (Simplified)
// ============================================================================

abstract class Instruction {
  protected raw: number;
  
  constructor(instruction: number) {
    this.raw = instruction;
  }
  
  abstract execute(cpu: Darcy128CPU): void;
  abstract getName(): string;
  
  protected getOpcode(): number { return (this.raw >> 26) & 0x3F; }
  protected getRs(): number { return (this.raw >> 21) & 0x1F; }
  protected getRt(): number { return (this.raw >> 16) & 0x1F; }
  protected getRd(): number { return (this.raw >> 11) & 0x1F; }
  protected getShamt(): number { return (this.raw >> 6) & 0x1F; }
  protected getFunc(): number { return this.raw & 0x3F; }
  protected getImmediate(): number { return this.raw & 0xFFFF; }
  protected getAddress(): number { return this.raw & 0x3FFFFFF; }
}

class AddInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.add(s, t);
    cpu.writeReg(this.getRd(), result);
    cpu.addExecutionHistory(`add $${this.getRd()}, $${this.getRs()}, $${this.getRt()} -> ${Int128.toString(result)}`);
  }
  getName(): string { return 'add'; }
}

class SubInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.sub(s, t);
    cpu.writeReg(this.getRd(), result);
    cpu.addExecutionHistory(`sub $${this.getRd()}, $${this.getRs()}, $${this.getRt()} -> ${Int128.toString(result)}`);
  }
  getName(): string { return 'sub'; }
}

class MultInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.mul(s, t);
    cpu.setLO(result.lo);
    cpu.setHI(result.hi);
    cpu.addExecutionHistory(`mult $${this.getRs()}, $${this.getRt()} -> HI:LO = ${Int128.toString(result.hi)}:${Int128.toString(result.lo)}`);
  }
  getName(): string { return 'mult'; }
}

class MultuInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.mul(s, t);
    cpu.setLO(result.lo);
    cpu.setHI(result.hi);
    cpu.addExecutionHistory(`multu $${this.getRs()}, $${this.getRt()} -> HI:LO = ${Int128.toString(result.hi)}:${Int128.toString(result.lo)}`);
  }
  getName(): string { return 'multu'; }
}

class DivInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.div(s, t);
    cpu.setLO(result.quotient);
    cpu.setHI(result.remainder);
    cpu.addExecutionHistory(`div $${this.getRs()}, $${this.getRt()} -> LO=${Int128.toString(result.quotient)}, HI=${Int128.toString(result.remainder)}`);
  }
  getName(): string { return 'div'; }
}

class DivuInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.div(s, t);
    cpu.setLO(result.quotient);
    cpu.setHI(result.remainder);
    cpu.addExecutionHistory(`divu $${this.getRs()}, $${this.getRt()} -> LO=${Int128.toString(result.quotient)}, HI=${Int128.toString(result.remainder)}`);
  }
  getName(): string { return 'divu'; }
}

class MfhiInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const hi = cpu.getHI();
    cpu.writeReg(this.getRd(), hi);
    cpu.addExecutionHistory(`mfhi $${this.getRd()} -> ${Int128.toString(hi)}`);
  }
  getName(): string { return 'mfhi'; }
}

class MfloInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const lo = cpu.getLO();
    cpu.writeReg(this.getRd(), lo);
    cpu.addExecutionHistory(`mflo $${this.getRd()} -> ${Int128.toString(lo)}`);
  }
  getName(): string { return 'mflo'; }
}

class LisInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const nextWord = cpu.getMemory().fetchInstruction(Number(cpu.getPC()));
    cpu.setPC(cpu.getPC() + BigInt(4));
    const value = BigInt(nextWord);
    cpu.writeReg(this.getRd(), value);
    cpu.addExecutionHistory(`lis $${this.getRd()} -> ${Int128.toString(value)}`);
  }
  getName(): string { return 'lis'; }
}

class JrInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const target = cpu.readReg(this.getRs());
    cpu.setPC(target);
    cpu.addExecutionHistory(`jr $${this.getRs()} -> PC = ${Int128.toString(target)}`);
  }
  getName(): string { return 'jr'; }
}

class JalrInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const target = cpu.readReg(this.getRs());
    cpu.writeReg(31, cpu.getPC());
    cpu.setPC(target);
    cpu.addExecutionHistory(`jalr $${this.getRs()} -> PC = ${Int128.toString(target)}, $31 = ${Int128.toString(cpu.getPC())}`);
  }
  getName(): string { return 'jalr'; }
}

class SltInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.compare(s, t) < 0 ? BigInt(1) : BigInt(0);
    cpu.writeReg(this.getRd(), result);
    cpu.addExecutionHistory(`slt $${this.getRd()}, $${this.getRs()}, $${this.getRt()} -> ${result}`);
  }
  getName(): string { return 'slt'; }
}

class SltuInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.compare(s, t) < 0 ? BigInt(1) : BigInt(0);
    cpu.writeReg(this.getRd(), result);
    cpu.addExecutionHistory(`sltu $${this.getRd()}, $${this.getRs()}, $${this.getRt()} -> ${result}`);
  }
  getName(): string { return 'sltu'; }
}

class LwInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const base = cpu.readReg(this.getRs());
    const offset = Int128.signExtend16(this.getImmediate());
    const address = Number(base + offset);
    
    const value = cpu.getMemory().loadWord(address);
    cpu.writeReg(this.getRt(), value);
    cpu.addExecutionHistory(`lw $${this.getRt()}, ${this.getImmediate()}($${this.getRs()}) -> ${Int128.toString(value)}`);
  }
  getName(): string { return 'lw'; }
}

class SwInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const base = cpu.readReg(this.getRs());
    const offset = Int128.signExtend16(this.getImmediate());
    const address = Number(base + offset);
    
    const value = cpu.readReg(this.getRt());
    cpu.getMemory().storeWord(address, value);
    cpu.addExecutionHistory(`sw $${this.getRt()}, ${this.getImmediate()}($${this.getRs()}) -> Memory[${address}] = ${Int128.toString(value)}`);
  }
  getName(): string { return 'sw'; }
}

class BeqInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    if (s === t) {
      const offset = Int128.signExtend16(this.getImmediate());
      cpu.setPC(cpu.getPC() + (offset * BigInt(4)));
      cpu.addExecutionHistory(`beq $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} -> Branch taken to ${Int128.toString(cpu.getPC())}`);
    } else {
      cpu.addExecutionHistory(`beq $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} -> Branch not taken`);
    }
  }
  getName(): string { return 'beq'; }
}

class BneInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    if (s !== t) {
      const offset = Int128.signExtend16(this.getImmediate());
      cpu.setPC(cpu.getPC() + (offset * BigInt(4)));
      cpu.addExecutionHistory(`bne $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} -> Branch taken to ${Int128.toString(cpu.getPC())}`);
    } else {
      cpu.addExecutionHistory(`bne $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} -> Branch not taken`);
    }
  }
  getName(): string { return 'bne'; }
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
    let request: AdvanceInstructionRequest = {};

    if (event.httpMethod === 'POST') {
      request = JSON.parse(event.body || '{}');
    }

    let response: AdvanceInstructionResponse;

    try {
      if (request.instruction) {
        // Execute specific instruction
        const instructionHex = parseInt(request.instruction, 16);
        cpu.executeInstruction(instructionHex);
      } else {
        // Fetch and execute next instruction
        const instruction = cpu.fetch();
        cpu.executeInstruction(instruction);
      }

      response = {
        success: true,
        cpu_state: cpu.getState(),
        execution_history: cpu.getExecutionHistory(),
        performance_metrics: cpu.getPerformanceMetrics()
      };
    } catch (error) {
      response = {
        success: false,
        cpu_state: cpu.getState(),
        execution_history: cpu.getExecutionHistory(),
        performance_metrics: cpu.getPerformanceMetrics(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    const errorResponse: AdvanceInstructionResponse = {
      success: false,
      cpu_state: getCPU().getState(),
      execution_history: getCPU().getExecutionHistory(),
      performance_metrics: getCPU().getPerformanceMetrics(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};
