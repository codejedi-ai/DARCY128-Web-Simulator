// DARCY128 Query Memory Endpoint
// Inspects memory contents at specified addresses

import { Handler } from '@netlify/functions';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface QueryMemoryRequest {
  start_address?: number;
  length?: number;
  address?: number; // Single address query
}

interface MemoryWord {
  address: string;
  value: string;
  hex: string;
  decimal: string;
  binary: string;
}

interface QueryMemoryResponse {
  success: boolean;
  memory_words: MemoryWord[];
  total_words: number;
  start_address: number;
  end_address: number;
  error?: string;
}

// ============================================================================
// 128-bit Arithmetic Utilities
// ============================================================================

class Int128 {
  static toString(value: bigint): string {
    return '0x' + value.toString(16).padStart(32, '0');
  }
  
  static toDecimal(value: bigint): string {
    return value.toString();
  }
  
  static toBinary(value: bigint): string {
    return value.toString(2).padStart(128, '0');
  }
}

// ============================================================================
// Memory System
// ============================================================================

class Darcy128Memory {
  private memory: { [address: string]: bigint } = {};
  private readonly MEMORY_SIZE = 8 * 1024 * 1024; // 8MB
  
  // Memory-mapped I/O addresses
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
  
  private checkAddress(address: number, size: number): void {
    if (address >= 0xffff0000) return; // MMIO addresses are valid
    if (address + size > this.MEMORY_SIZE) {
      throw new Error(`Memory access out of bounds: 0x${address.toString(16)}`);
    }
  }
  
  private checkAlignment(address: number, alignment: number): void {
    if (address % alignment !== 0) {
      throw new Error(`Unaligned memory access at 0x${address.toString(16)}`);
    }
  }
  
  queryMemory(startAddress: number, length: number): MemoryWord[] {
    const words: MemoryWord[] = [];
    
    for (let i = 0; i < length; i += 16) {
      const address = startAddress + i;
      
      try {
        const value = this.loadWord(address);
        words.push({
          address: `0x${address.toString(16).padStart(8, '0')}`,
          value: Int128.toString(value),
          hex: Int128.toString(value),
          decimal: Int128.toDecimal(value),
          binary: Int128.toBinary(value)
        });
      } catch (error) {
        words.push({
          address: `0x${address.toString(16).padStart(8, '0')}`,
          value: 'INVALID',
          hex: 'INVALID',
          decimal: 'INVALID',
          binary: 'INVALID'
        });
      }
    }
    
    return words;
  }
  
  querySingleAddress(address: number): MemoryWord {
    try {
      const value = this.loadWord(address);
      return {
        address: `0x${address.toString(16).padStart(8, '0')}`,
        value: Int128.toString(value),
        hex: Int128.toString(value),
        decimal: Int128.toDecimal(value),
        binary: Int128.toBinary(value)
      };
    } catch (error) {
      return {
        address: `0x${address.toString(16).padStart(8, '0')}`,
        value: 'INVALID',
        hex: 'INVALID',
        decimal: 'INVALID',
        binary: 'INVALID'
      };
    }
  }
}

// ============================================================================
// Global Memory Instance
// ============================================================================

let globalMemory: Darcy128Memory | null = null;

function getMemory(): Darcy128Memory {
  if (!globalMemory) {
    globalMemory = new Darcy128Memory();
  }
  return globalMemory;
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
    const memory = getMemory();
    let request: QueryMemoryRequest = {};

    if (event.httpMethod === 'POST') {
      request = JSON.parse(event.body || '{}');
    } else if (event.httpMethod === 'GET') {
      // Parse query parameters
      const url = new URL(event.rawUrl || '');
      const params = url.searchParams;
      
      if (params.get('address')) {
        request.address = parseInt(params.get('address')!, 16);
      }
      if (params.get('start')) {
        request.start_address = parseInt(params.get('start')!, 16);
      }
      if (params.get('length')) {
        request.length = parseInt(params.get('length')!);
      }
    }

    let response: QueryMemoryResponse;

    try {
      let memoryWords: MemoryWord[];
      let startAddress: number;
      let endAddress: number;

      if (request.address !== undefined) {
        // Single address query
        const word = memory.querySingleAddress(request.address);
        memoryWords = [word];
        startAddress = request.address;
        endAddress = request.address;
      } else {
        // Range query
        startAddress = request.start_address || 0;
        const length = request.length || 256; // Default to 256 bytes (16 words)
        endAddress = startAddress + length - 16; // Last word address
        
        memoryWords = memory.queryMemory(startAddress, length);
      }

      response = {
        success: true,
        memory_words: memoryWords,
        total_words: memoryWords.length,
        start_address: startAddress,
        end_address: endAddress
      };
    } catch (error) {
      response = {
        success: false,
        memory_words: [],
        total_words: 0,
        start_address: 0,
        end_address: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    const errorResponse: QueryMemoryResponse = {
      success: false,
      memory_words: [],
      total_words: 0,
      start_address: 0,
      end_address: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};
