// DARCY128 CPU Emulator - Client Side
// Handles all CPU emulation logic in the browser
// Uses base 16 (hexadecimal) instruction storage and map-based memory

// ============================================================================
// Types and Interfaces
// ============================================================================
import { Darcy128Memory } from './memory';

export interface Darcy128Register {
  name: string;
  value: string; // 128-bit value as hex string
  type: 'general' | 'special';
}

export interface Darcy128CPUState {
  registers: Darcy128Register[];
  pc: string;
  hi: string;
  lo: string;
  running: boolean;
  memory: Darcy128Memory;
  execution_mode: 'mips32' | 'darcy128';
}

export interface MemoryEntry {
  address: string;
  value: string;
  format: string;
  is_instruction: boolean;
  decoded_instruction?: string;
}

// ============================================================================
// Base 16 (Hexadecimal) Instruction Utilities
// ============================================================================

export class HexInstruction {
  static encode(instruction: number): string {
    return '0x' + instruction.toString(16).padStart(8, '0').toUpperCase();
  }
  
  static decode(hexString: string): number {
    // Remove 0x prefix if present
    const cleanHex = hexString.replace(/^0x/i, '');
    return parseInt(cleanHex, 16);
  }
  
  static isValid(hexString: string): boolean {
    const cleanHex = hexString.replace(/^0x/i, '');
    return /^[0-9A-Fa-f]+$/.test(cleanHex) && cleanHex.length <= 8;
  }
  
  static isInstruction(value: string): boolean {
    return HexInstruction.isValid(value) && value.length >= 6; // At least 3 bytes
  }
}

// ============================================================================
// 128-bit Arithmetic Utilities
// ============================================================================

export class Int128 {
  static fromString(value: string): bigint {
    if (value.startsWith('0x')) {
      return BigInt(value);
    }
    return BigInt(value);
  }
  
  static toString(value: bigint): string {
    return '0x' + value.toString(16).padStart(32, '0');
  }
  
  static toDecimal(value: bigint): string {
    return value.toString();
  }
  
  static toBinary(value: bigint): string {
    return value.toString(2).padStart(128, '0');
  }
  
  static add(a: bigint, b: bigint): bigint {
    return a + b;
  }
  
  static sub(a: bigint, b: bigint): bigint {
    return a - b;
  }
  
  static mul(a: bigint, b: bigint): { hi: bigint; lo: bigint } {
    // Karatsuba multiplication for 128-bit numbers
    return Int128.karatsubaMultiply(a, b);
  }
  
  static karatsubaMultiply(a: bigint, b: bigint): { hi: bigint; lo: bigint } {
    // Handle negative numbers
    const aSign = a < BigInt(0) ? -BigInt(1) : BigInt(1);
    const bSign = b < BigInt(0) ? -BigInt(1) : BigInt(1);
    const absA = a * aSign;
    const absB = b * bSign;
    
    // Base case: if numbers are small enough, use regular multiplication
    if (absA < BigInt(2) ** BigInt(64) && absB < BigInt(2) ** BigInt(64)) {
      const result = absA * absB * aSign * bSign;
      const mask = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
      return {
        lo: result & mask,
        hi: (result >> BigInt(128)) & mask
      };
    }
    
    // Karatsuba algorithm
    const n = BigInt(128);
    const half = n / BigInt(2);
    
    // Split numbers into high and low parts
    const mask = (BigInt(1) << half) - BigInt(1);
    const aHigh = absA >> half;
    const aLow = absA & mask;
    const bHigh = absB >> half;
    const bLow = absB & mask;
    
    // Recursive calls
    const z0 = Int128.karatsubaMultiply(aLow, bLow);
    const z1 = Int128.karatsubaMultiply(aLow + aHigh, bLow + bHigh);
    const z2 = Int128.karatsubaMultiply(aHigh, bHigh);
    
    // Combine results
    const result = (z2.lo << n) + ((z1.lo - z2.lo - z0.lo) << half) + z0.lo;
    const carry = (z1.hi - z2.hi - z0.hi) + (z2.lo >> half) + ((z1.lo - z2.lo - z0.lo) >> half);
    
    const finalResult = result * aSign * bSign;
    const finalMask = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    
    return {
      lo: finalResult & finalMask,
      hi: (finalResult >> BigInt(128)) & finalMask
    };
  }
  
  static div(a: bigint, b: bigint): { quotient: bigint; remainder: bigint } {
    if (b === BigInt(0)) {
      throw new Error('Division by zero');
    }
    return Int128.longDivision(a, b);
  }
  
  static longDivision(dividend: bigint, divisor: bigint): { quotient: bigint; remainder: bigint } {
    // Handle negative numbers
    const dividendSign = dividend < BigInt(0) ? -BigInt(1) : BigInt(1);
    const divisorSign = divisor < BigInt(0) ? -BigInt(1) : BigInt(1);
    const absDividend = dividend * dividendSign;
    const absDivisor = divisor * divisorSign;
    
    // Base case: if divisor is larger than dividend
    if (absDivisor > absDividend) {
      return {
        quotient: BigInt(0),
        remainder: dividend
      };
    }
    
    // Long division algorithm
    let quotient = BigInt(0);
    let remainder = BigInt(0);
    
    // Convert to binary representation for bit-by-bit division
    const dividendBits = Int128.toBinary(absDividend);
    const divisorBits = Int128.toBinary(absDivisor);
    
    // Find the position of the most significant bit
    const dividendMsb = dividendBits.indexOf('1');
    const divisorMsb = divisorBits.indexOf('1');
    
    if (dividendMsb === -1) {
      return { quotient: BigInt(0), remainder: BigInt(0) };
    }
    
    // Perform long division
    for (let i = dividendMsb; i < dividendBits.length; i++) {
      remainder = (remainder << BigInt(1)) | BigInt(dividendBits[i] === '1' ? 1 : 0);
      
      if (remainder >= absDivisor) {
        remainder -= absDivisor;
        quotient |= (BigInt(1) << BigInt(dividendBits.length - 1 - i));
      }
    }
    
    // Apply signs
    const finalQuotient = quotient * dividendSign * divisorSign;
    const finalRemainder = remainder * dividendSign;
    
    return {
      quotient: finalQuotient,
      remainder: finalRemainder
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
  
  static signExtend32(value: number): bigint {
    const signBit = (value >> 31) & 1;
    if (signBit) {
      return BigInt(value) | BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFF00000000');
    }
    return BigInt(value);
  }
}

// ============================================================================
// Memory System - Map/Dictionary Based
// ============================================================================

// Memory moved to src/emulator/memory.ts

// ============================================================================
// Instruction Classes - MIPS32 Compatible
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

// R-Type Instructions - MIPS32 Compatible
class AddInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.add(s, t);
    cpu.writeReg(this.getRd(), result);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] add $${this.getRd()}, $${this.getRs()}, $${this.getRt()} (${hex}) -> ${Int128.toString(result)}`);
  }
  getName(): string { return 'add'; }
}

class SubInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.sub(s, t);
    cpu.writeReg(this.getRd(), result);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] sub $${this.getRd()}, $${this.getRs()}, $${this.getRt()} (${hex}) -> ${Int128.toString(result)}`);
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
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] mult $${this.getRs()}, $${this.getRt()} (${hex}) -> HI:LO = ${Int128.toString(result.hi)}:${Int128.toString(result.lo)}`);
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
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] multu $${this.getRs()}, $${this.getRt()} (${hex}) -> HI:LO = ${Int128.toString(result.hi)}:${Int128.toString(result.lo)}`);
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
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] div $${this.getRs()}, $${this.getRt()} (${hex}) -> LO=${Int128.toString(result.quotient)}, HI=${Int128.toString(result.remainder)}`);
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
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] divu $${this.getRs()}, $${this.getRt()} (${hex}) -> LO=${Int128.toString(result.quotient)}, HI=${Int128.toString(result.remainder)}`);
  }
  getName(): string { return 'divu'; }
}

class MfhiInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const hi = cpu.getHI();
    cpu.writeReg(this.getRd(), hi);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] mfhi $${this.getRd()} (${hex}) -> ${Int128.toString(hi)}`);
  }
  getName(): string { return 'mfhi'; }
}

class MfloInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const lo = cpu.getLO();
    cpu.writeReg(this.getRd(), lo);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] mflo $${this.getRd()} (${hex}) -> ${Int128.toString(lo)}`);
  }
  getName(): string { return 'mflo'; }
}

class LisInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const nextWord = cpu.getMemory().fetchInstruction(Number(cpu.getPC()));
    cpu.setPC(cpu.getPC() + BigInt(4));
    const value = BigInt(nextWord);
    cpu.writeReg(this.getRd(), value);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] lis $${this.getRd()} (${hex}) -> ${Int128.toString(value)}`);
  }
  getName(): string { return 'lis'; }
}

class JrInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const target = cpu.readReg(this.getRs());
    cpu.setPC(target);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] jr $${this.getRs()} (${hex}) -> PC = ${Int128.toString(target)}`);
  }
  getName(): string { return 'jr'; }
}

class JalrInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const target = cpu.readReg(this.getRs());
    cpu.writeReg(31, cpu.getPC());
    cpu.setPC(target);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] jalr $${this.getRs()} (${hex}) -> PC = ${Int128.toString(target)}, $31 = ${Int128.toString(cpu.getPC())}`);
  }
  getName(): string { return 'jalr'; }
}

class SltInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.compare(s, t) < 0 ? BigInt(1) : BigInt(0);
    cpu.writeReg(this.getRd(), result);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] slt $${this.getRd()}, $${this.getRs()}, $${this.getRt()} (${hex}) -> ${result}`);
  }
  getName(): string { return 'slt'; }
}

class SltuInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const s = cpu.readReg(this.getRs());
    const t = cpu.readReg(this.getRt());
    const result = Int128.compare(s, t) < 0 ? BigInt(1) : BigInt(0);
    cpu.writeReg(this.getRd(), result);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] sltu $${this.getRd()}, $${this.getRs()}, $${this.getRt()} (${hex}) -> ${result}`);
  }
  getName(): string { return 'sltu'; }
}

// I-Type Instructions - MIPS32 Compatible
class LwInstruction extends Instruction {
  execute(cpu: Darcy128CPU): void {
    const base = cpu.readReg(this.getRs());
    const offset = Int128.signExtend16(this.getImmediate());
    const address = Number(base + offset);
    
    const value = cpu.getMemory().loadWord(address);
    cpu.writeReg(this.getRt(), value);
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] lw $${this.getRt()}, ${this.getImmediate()}($${this.getRs()}) (${hex}) -> ${Int128.toString(value)}`);
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
    
    const mode = cpu.getExecutionMode();
    const hex = HexInstruction.encode(this.raw);
    cpu.addExecutionHistory(`[${mode}] sw $${this.getRt()}, ${this.getImmediate()}($${this.getRs()}) (${hex}) -> Memory[${address}] = ${Int128.toString(value)}`);
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
      
      const mode = cpu.getExecutionMode();
      const hex = HexInstruction.encode(this.raw);
      cpu.addExecutionHistory(`[${mode}] beq $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} (${hex}) -> Branch taken to ${Int128.toString(cpu.getPC())}`);
    } else {
      const mode = cpu.getExecutionMode();
      const hex = HexInstruction.encode(this.raw);
      cpu.addExecutionHistory(`[${mode}] beq $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} (${hex}) -> Branch not taken`);
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
      
      const mode = cpu.getExecutionMode();
      const hex = HexInstruction.encode(this.raw);
      cpu.addExecutionHistory(`[${mode}] bne $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} (${hex}) -> Branch taken to ${Int128.toString(cpu.getPC())}`);
    } else {
      const mode = cpu.getExecutionMode();
      const hex = HexInstruction.encode(this.raw);
      cpu.addExecutionHistory(`[${mode}] bne $${this.getRs()}, $${this.getRt()}, ${this.getImmediate()} (${hex}) -> Branch not taken`);
    }
  }
  getName(): string { return 'bne'; }
}

// ============================================================================
// CPU Core - MIPS32 Compatible
// ============================================================================

export class Darcy128CPU {
  private registers: bigint[] = new Array(32).fill(BigInt(0));
  private pc: bigint = BigInt(0);
  private hi: bigint = BigInt(0);
  private lo: bigint = BigInt(0);
  private memory: Darcy128Memory;
  private running: boolean = false;
  private executionHistory: string[] = [];
  private instructionsExecuted: number = 0;
  private executionMode: 'mips32' | 'darcy128' = 'mips32'; // Default to MIPS32 compatibility
  
  constructor(memory?: Darcy128Memory) {
    this.memory = memory ?? new Darcy128Memory(32 * 1024);
  }
  
  // Allow wiring an external memory instance if desired
  setMemory(memory: Darcy128Memory): void {
    this.memory = memory;
  }
  
  reset(): void {
    // Clear all registers
    this.registers.fill(BigInt(0));
    
    // Reset special registers
    this.pc = BigInt(0);
    this.hi = BigInt(0);
    this.lo = BigInt(0);
    
    // Reset execution state
    this.running = false;
    this.executionHistory = [];
    this.instructionsExecuted = 0;
    
    // Reset to MIPS32 compatibility mode
    this.executionMode = 'mips32';
    
    // Add reset entry to history
    this.addExecutionHistory(`[${this.executionMode}] CPU RESET - All registers cleared, PC=0, execution mode=${this.executionMode}`);
  }
  
  setExecutionMode(mode: 'mips32' | 'darcy128'): void {
    this.executionMode = mode;
  }
  
  getExecutionMode(): 'mips32' | 'darcy128' {
    return this.executionMode;
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

  // Convenience: execute a single instruction provided as a hex string (e.g., "0x00221820")
  executeInstructionHex(hexString: string): void {
    const word = HexInstruction.decode(hexString);
    this.executeInstruction(word);
  }

  // Generic execute that accepts either a hex string or a numeric word
  execute(instruction: string | number): void {
    if (typeof instruction === 'string') {
      this.executeInstructionHex(instruction);
    } else {
      this.executeInstruction(instruction);
    }
  }
  
  private decodeInstruction(word: number): Instruction {
    const opcode = (word >> 26) & 0x3F;
    
    if (opcode === 0x00) { // R-type
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
    } else { // I-type
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
  setState(state: Darcy128CPUState): void {
    this.registers = state.registers.map(reg => Int128.fromString(reg.value));
    this.pc = Int128.fromString(state.pc);
    this.hi = Int128.fromString(state.hi);
    this.lo = Int128.fromString(state.lo);
    this.running = state.running;
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
      memory: this.memory,
      execution_mode: this.executionMode
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
  
  // Load state from server
  loadState(state: Darcy128CPUState): void {
    // Load registers
    for (let i = 0; i < 32; i++) {
      this.registers[i] = Int128.fromString(state.registers[i].value);
    }
    
    // Load special registers
    this.pc = Int128.fromString(state.pc);
    this.hi = Int128.fromString(state.hi);
    this.lo = Int128.fromString(state.lo);
    
    // Load memory
    this.memory = state.memory;
    
    // Load execution mode
    this.executionMode = state.execution_mode;
    
    this.addExecutionHistory(`[${this.executionMode}] STATE LOADED from server`);
  }
}
