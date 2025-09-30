// Minimal instruction factory utilities for DARCY128/MIPS32-compatible core

export type InstructionFormat = 'R' | 'I' | 'J';

export interface DecodedInstruction {
  format: InstructionFormat;
  name: string;
  word: number; // 32-bit instruction word
  opcode: number;
  rs?: number;
  rt?: number;
  rd?: number;
  shamt?: number;
  funct?: number;
  immediate?: number;
  address?: number;
}

export function decodeHex(hex: string): number {
  const clean = hex.replace(/^0x/i, '');
  return parseInt(clean, 16) >>> 0;
}

export function encodeHex(word: number): string {
  return '0x' + (word >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export function decode(word: number): DecodedInstruction {
  const opcode = (word >>> 26) & 0x3F;
  if (opcode === 0x00) {
    const rs = (word >>> 21) & 0x1F;
    const rt = (word >>> 16) & 0x1F;
    const rd = (word >>> 11) & 0x1F;
    const shamt = (word >>> 6) & 0x1F;
    const funct = word & 0x3F;
    const name = rTypeName(funct);
    return { format: 'R', name, word, opcode, rs, rt, rd, shamt, funct };
  }
  if (opcode === 0x02 || opcode === 0x03) {
    const address = word & 0x3FFFFFF;
    const name = opcode === 0x02 ? 'j' : 'jal';
    return { format: 'J', name, word, opcode, address };
  }
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const immediate = word & 0xFFFF;
  const name = iTypeName(opcode);
  return { format: 'I', name, word, opcode, rs, rt, immediate };
}

function rTypeName(funct: number): string {
  switch (funct) {
    case 0x20: return 'add';
    case 0x22: return 'sub';
    case 0x18: return 'mult';
    case 0x19: return 'multu';
    case 0x1A: return 'div';
    case 0x1B: return 'divu';
    case 0x10: return 'mfhi';
    case 0x12: return 'mflo';
    case 0x14: return 'lis';
    case 0x08: return 'jr';
    case 0x09: return 'jalr';
    case 0x2A: return 'slt';
    case 0x2B: return 'sltu';
    default: return `rfunct_0x${funct.toString(16)}`;
  }
}

function iTypeName(opcode: number): string {
  switch (opcode) {
    case 0x23: return 'lw';
    case 0x2B: return 'sw';
    case 0x04: return 'beq';
    case 0x05: return 'bne';
    default: return `iop_0x${opcode.toString(16)}`;
  }
}

export function decodeHexToInstruction(hex: string): DecodedInstruction {
  return decode(decodeHex(hex));
}

// Simple encoders for R/I forms (helpers for future use)
export function encodeR(opcode: number, rs: number, rt: number, rd: number, shamt: number, funct: number): number {
  return ((opcode & 0x3F) << 26) | ((rs & 0x1F) << 21) | ((rt & 0x1F) << 16) | ((rd & 0x1F) << 11) | ((shamt & 0x1F) << 6) | (funct & 0x3F);
}

export function encodeI(opcode: number, rs: number, rt: number, immediate: number): number {
  return ((opcode & 0x3F) << 26) | ((rs & 0x1F) << 21) | ((rt & 0x1F) << 16) | (immediate & 0xFFFF);
}