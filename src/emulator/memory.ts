import { Int128 } from './Darcy128CPU';

// Standalone memory system for DARCY128 (default 32 KiB)
export class Darcy128Memory {
  private memory: Map<string, string> = new Map(); // Address (byte) -> 128-bit value (hex string)
  private readonly MEMORY_SIZE: number;
  
  // Section layout within address space (byte-addressed)
  // 0x0000 - 0x3FFF (16 KiB)  : .text (instructions)
  // 0x4000 - 0x7FFF (16 KiB)  : .data/.bss/heap (data)
  // Note: Stack simulated separately in CPU via register; no dedicated region here for now
  public static readonly TEXT_START = 0x0000;
  public static readonly TEXT_END   = 0x3FFF;
  public static readonly DATA_START = 0x4000;
  public static readonly DATA_END   = 0x7FFF;
  
  // Memory-mapped I/O addresses
  private static readonly MMIO_OUTPUT_QWORD = 0xffff0018;
  private static readonly MMIO_INPUT_QWORD = 0xffff0010;
  
  constructor(sizeBytes: number = 32 * 1024) {
    this.MEMORY_SIZE = sizeBytes;
  }
  
  loadWord(address: number): bigint {
    if (address === Darcy128Memory.MMIO_INPUT_QWORD) {
      return BigInt('0x' + Math.random().toString(16).substring(2).repeat(8).substring(0, 32));
    }
    
    this.checkAddress(address, 16);
    this.checkAlignment(address, 16);
    
    const addrStr = address.toString();
    const value = this.memory.get(addrStr);
    return value ? Int128.fromString(value) : BigInt(0);
  }
  
  storeWord(address: number, value: bigint): void {
    if (address === Darcy128Memory.MMIO_OUTPUT_QWORD) {
      console.log(`Output: ${Int128.toString(value)}`);
      return;
    }
    
    this.checkAddress(address, 16);
    this.checkAlignment(address, 16);
    
    const addrStr = address.toString();
    this.memory.set(addrStr, Int128.toString(value));
  }
  
  // Store instruction in hex format
  storeInstruction(address: number, instruction: number): void {
    this.checkAddress(address, 4);
    this.checkAlignment(address, 4);
    
    const hexInstruction = '0x' + instruction.toString(16).padStart(8, '0').toUpperCase();
    const addrStr = address.toString();
    this.memory.set(addrStr, hexInstruction);
  }
  
  fetchInstruction(address: number): number {
    this.checkAddress(address, 4);
    this.checkAlignment(address, 4);
    
    const addrStr = address.toString();
    const hexInstruction = this.memory.get(addrStr);
    
    if (hexInstruction) {
      const cleanHex = hexInstruction.replace(/^0x/i, '');
      return parseInt(cleanHex, 16);
    }
    
    return 0; // NOP instruction
  }
  
  private checkAddress(address: number, size: number): void {
    if (address >= 0xffff0000) return; // MMIO passthrough
    if (address + size > this.MEMORY_SIZE) {
      throw new Error(`Memory access out of bounds: 0x${address.toString(16)}`);
    }
  }
  
  private checkAlignment(address: number, alignment: number): void {
    if (address % alignment !== 0) {
      throw new Error(`Unaligned memory access at 0x${address.toString(16)}`);
    }
  }
  
  // Convert memory map to object for JSON serialization
  toObject(): { [address: string]: string } {
    const obj: { [address: string]: string } = {};
    for (const [key, value] of this.memory.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  
  // Load memory from object (for JSON deserialization)
  fromObject(obj: { [address: string]: string }): void {
    this.memory.clear();
    for (const [key, value] of Object.entries(obj)) {
      this.memory.set(key, value);
    }
  }
  
  dump(start: number, length: number): { [address: string]: string } {
    const result: { [address: string]: string } = {};
    for (let i = 0; i < length; i += 16) {
      const addr = start + i;
      const addrStr = addr.toString();
      const value = this.memory.get(addrStr) || Int128.toString(BigInt(0));
      result[addrStr] = value;
    }
    return result;
  }
  
  // Clear all memory
  clear(): void {
    this.memory.clear();
  }

  // Helpers for section checks
  isTextAddress(address: number): boolean {
    return address >= Darcy128Memory.TEXT_START && address <= Darcy128Memory.TEXT_END;
  }
  isDataAddress(address: number): boolean {
    return address >= Darcy128Memory.DATA_START && address <= Darcy128Memory.DATA_END;
  }
}

// Shared default memory instance (32 KiB)
export const defaultMemory = new Darcy128Memory(32 * 1024);
// this is the memory class that Darcy128 CPU uses