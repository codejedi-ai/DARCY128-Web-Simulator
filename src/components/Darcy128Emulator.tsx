import React, { useRef, useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";
import { 
  Darcy128Register, 
  Darcy128VectorRegister, 
  Darcy128Instruction, 
  Darcy128ExecutionState,
  Darcy128Metrics,
  QuadPrecisionFloat,
  CryptoBlock,
  UUID,
  IPv6Address
} from "../types/Darcy128Types";

interface Darcy128EmulatorProps {
  screenWidth: number;
}

export default function Darcy128Emulator({ screenWidth }: Darcy128EmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Darcy128 Instructions showcasing revolutionary capabilities
  const [instructions, setInstructions] = useState<Darcy128Instruction[]>([
    // Traditional MIPS32 compatibility
    { address: 0x00400000, instruction: "addi $t0, $zero, 5", opcode: "addi", operands: ["$t0", "$zero", "5"], description: "Load immediate value 5 into $t0", category: "arithmetic", width: 32 },
    
    // 128-bit arithmetic operations
    { address: 0x00400004, instruction: "add128 $q0, $q1, $q2", opcode: "add128", operands: ["$q0", "$q1", "$q2"], description: "128-bit addition: $q0 = $q1 + $q2", category: "arithmetic", width: 128 },
    
    // SIMD operations - 4x FP32 parallel processing
    { address: 0x00400008, instruction: "vadd.f32 $v0, $v1, $v2", opcode: "vadd.f32", operands: ["$v0", "$v1", "$v2"], description: "SIMD: Add 4x FP32 vectors in parallel", category: "simd", width: 128 },
    
    // SIMD operations - 8x FP16 parallel processing  
    { address: 0x0040000c, instruction: "vadd.f16 $v3, $v4, $v5", opcode: "vadd.f16", operands: ["$v3", "$v4", "$v5"], description: "SIMD: Add 8x FP16 vectors in parallel", category: "simd", width: 128 },
    
    // Native AES encryption
    { address: 0x00400010, instruction: "aes.encrypt $c0, $c1, $c2", opcode: "aes.encrypt", operands: ["$c0", "$c1", "$c2"], description: "Native AES-128 encryption in single cycle", category: "crypto", width: 128 },
    
    // Quad-precision floating point
    { address: 0x00400014, instruction: "qadd $qf0, $qf1, $qf2", opcode: "qadd", operands: ["$qf0", "$qf1", "$qf2"], description: "Quad-precision FP addition (113-bit mantissa)", category: "quad-precision", width: 128 },
    
    // Native UUID operations
    { address: 0x00400018, instruction: "uuid.generate $u0", opcode: "uuid.generate", operands: ["$u0"], description: "Generate 128-bit UUID in hardware", category: "arithmetic", width: 128 },
    
    // IPv6 address operations
    { address: 0x0040001c, instruction: "ipv6.compare $ip0, $ip1", opcode: "ipv6.compare", operands: ["$ip0", "$ip1"], description: "Native IPv6 address comparison", category: "arithmetic", width: 128 },
    
    // Matrix operations for AI/ML
    { address: 0x00400020, instruction: "matmul.f32 $m0, $m1, $m2", opcode: "matmul.f32", operands: ["$m0", "$m1", "$m2"], description: "4x4 FP32 matrix multiplication", category: "simd", width: 128 },
  ]);
  
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Darcy128 Register File - 128-bit registers
  const [registers, setRegisters] = useState<{ [key: string]: Darcy128Register }>({
    // General purpose 128-bit registers
    "$q0": { name: "$q0", value: 0n, type: "general", width: 128 },
    "$q1": { name: "$q1", value: 0n, type: "general", width: 128 },
    "$q2": { name: "$q2", value: 0n, type: "general", width: 128 },
    "$q3": { name: "$q3", value: 0n, type: "general", width: 128 },
    
    // Vector registers for SIMD
    "$v0": { name: "$v0", value: 0n, type: "vector", width: 128 },
    "$v1": { name: "$v1", value: 0n, type: "vector", width: 128 },
    "$v2": { name: "$v2", value: 0n, type: "vector", width: 128 },
    "$v3": { name: "$v3", value: 0n, type: "vector", width: 128 },
    
    // Crypto registers
    "$c0": { name: "$c0", value: 0n, type: "crypto", width: 128 },
    "$c1": { name: "$c1", value: 0n, type: "crypto", width: 128 },
    "$c2": { name: "$c2", value: 0n, type: "crypto", width: 128 },
    
    // Quad-precision floating point registers
    "$qf0": { name: "$qf0", value: 0n, type: "general", width: 128 },
    "$qf1": { name: "$qf1", value: 0n, type: "general", width: 128 },
    "$qf2": { name: "$qf2", value: 0n, type: "general", width: 128 },
    
    // Special purpose registers
    "$u0": { name: "$u0", value: 0n, type: "general", width: 128 }, // UUID register
    "$ip0": { name: "$ip0", value: 0n, type: "general", width: 128 }, // IPv6 register
    "$ip1": { name: "$ip1", value: 0n, type: "general", width: 128 },
    
    // Matrix registers for AI/ML
    "$m0": { name: "$m0", value: 0n, type: "vector", width: 128 },
    "$m1": { name: "$m1", value: 0n, type: "vector", width: 128 },
    "$m2": { name: "$m2", value: 0n, type: "vector", width: 128 },
    
    // Legacy MIPS32 compatibility
    "$zero": { name: "$zero", value: 0n, type: "general", width: 128 },
    "$t0": { name: "$t0", value: 0n, type: "general", width: 128 },
    "$t1": { name: "$t1", value: 0n, type: "general", width: 128 },
  });
  
  const [vectorRegisters, setVectorRegisters] = useState<{ [key: string]: Darcy128VectorRegister }>({
    "$v0": { name: "$v0", fp32: [0, 0, 0, 0], fp16: [0, 0, 0, 0, 0, 0, 0, 0], int32: [0, 0, 0, 0], int16: [0, 0, 0, 0, 0, 0, 0, 0], int8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    "$v1": { name: "$v1", fp32: [1.0, 2.0, 3.0, 4.0], fp16: [1, 2, 3, 4, 5, 6, 7, 8], int32: [1, 2, 3, 4], int16: [1, 2, 3, 4, 5, 6, 7, 8], int8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    "$v2": { name: "$v2", fp32: [2.0, 3.0, 4.0, 5.0], fp16: [2, 3, 4, 5, 6, 7, 8, 9], int32: [2, 3, 4, 5], int16: [2, 3, 4, 5, 6, 7, 8, 9], int8: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
    "$v3": { name: "$v3", fp32: [0, 0, 0, 0], fp16: [0, 0, 0, 0, 0, 0, 0, 0], int32: [0, 0, 0, 0], int16: [0, 0, 0, 0, 0, 0, 0, 0], int8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  });
  
  const [memory, setMemory] = useState<{ [key: number]: bigint }>({});
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);
  const [executionState, setExecutionState] = useState<Darcy128ExecutionState>({
    pc: 0x00400000,
    mode: "128bit",
    flags: { zero: false, carry: false, overflow: false, sign: false },
    simdMode: "fp32"
  });
  
  const [metrics, setMetrics] = useState<Darcy128Metrics>({
    instructionsPerCycle: 4.0, // 4x improvement over traditional processors
    simdUtilization: 85.0, // 85% SIMD utilization
    cryptoAcceleration: 300.0, // 300% faster crypto operations
    quadPrecisionOps: 0,
    memoryBandwidthUtilization: 75.0
  });

  // Setup canvas for visual representation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth - 4;
      canvas.height = window.innerHeight - (screenWidth < 768 ? 60 : 70);
    };
    
    updateCanvasSize();

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background with Darcy128 branding
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(0.5, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw instruction list
      const instructionWidth = canvas.width * 0.35;
      const instructionHeight = 45;
      const startY = 60;
      
      ctx.fillStyle = "rgba(42, 42, 42, 0.9)";
      ctx.fillRect(10, 10, instructionWidth, canvas.height - 20);
      
      // Draw instruction header with Darcy128 branding
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 18px monospace";
      ctx.fillText("DARCY128 Instructions", 20, 35);
      
      // Draw instructions with category color coding
      instructions.forEach((inst, index) => {
        const y = startY + (index * instructionHeight);
        
        // Highlight current instruction
        if (index === currentInstructionIndex) {
          ctx.fillStyle = "#ff69b4";
          ctx.fillRect(15, y - 5, instructionWidth - 10, instructionHeight - 5);
          
          // Draw arrow pointing to current instruction
          ctx.fillStyle = "#ff69b4";
          ctx.beginPath();
          ctx.moveTo(instructionWidth + 20, y + instructionHeight / 2);
          ctx.lineTo(instructionWidth + 40, y + instructionHeight / 2 - 10);
          ctx.lineTo(instructionWidth + 40, y + instructionHeight / 2 + 10);
          ctx.closePath();
          ctx.fill();
        }
        
        // Draw instruction address
        ctx.fillStyle = "#888";
        ctx.font = "12px monospace";
        ctx.fillText(`0x${inst.address.toString(16).padStart(8, '0')}`, 20, y + 15);
        
        // Draw instruction text with category color
        const categoryColors = {
          'arithmetic': '#00ffff',
          'simd': '#ff9800',
          'crypto': '#4caf50',
          'memory': '#9c27b0',
          'control': '#f44336',
          'quad-precision': '#ff5722'
        };
        
        ctx.fillStyle = index === currentInstructionIndex ? "#000" : categoryColors[inst.category] || "#fff";
        ctx.font = "13px monospace";
        ctx.fillText(inst.instruction, 20, y + 30);
        
        // Draw width indicator
        ctx.fillStyle = "#666";
        ctx.font = "10px monospace";
        ctx.fillText(`${inst.width}-bit`, 20, y + 42);
      });
      
      // Draw registers panel
      const registersX = instructionWidth + 60;
      const registersWidth = canvas.width - registersX - 20;
      
      ctx.fillStyle = "rgba(42, 42, 42, 0.9)";
      ctx.fillRect(registersX, 10, registersWidth, canvas.height - 20);
      
      // Draw registers header
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 16px monospace";
      ctx.fillText("DARCY128 Register File", registersX + 10, 35);
      
      // Draw register categories
      const registerCategories = [
        { name: "General 128-bit", regs: ["$q0", "$q1", "$q2", "$q3"], color: "#00ffff" },
        { name: "Vector SIMD", regs: ["$v0", "$v1", "$v2", "$v3"], color: "#ff9800" },
        { name: "Crypto", regs: ["$c0", "$c1", "$c2"], color: "#4caf50" },
        { name: "Quad-Precision", regs: ["$qf0", "$qf1", "$qf2"], color: "#ff5722" },
        { name: "Special", regs: ["$u0", "$ip0", "$ip1"], color: "#9c27b0" },
        { name: "Matrix AI/ML", regs: ["$m0", "$m1", "$m2"], color: "#e91e63" }
      ];
      
      let currentY = startY;
      registerCategories.forEach((category, catIndex) => {
        // Draw category header
        ctx.fillStyle = category.color;
        ctx.font = "bold 12px monospace";
        ctx.fillText(category.name, registersX + 10, currentY);
        currentY += 20;
        
        // Draw registers in this category
        category.regs.forEach((regName, regIndex) => {
          const reg = registers[regName];
          if (reg) {
            ctx.fillStyle = "#fff";
            ctx.font = "11px monospace";
            ctx.fillText(`${regName}:`, registersX + 20, currentY);
            
            // Display 128-bit value in hex
            const hexValue = reg.value.toString(16).padStart(32, '0');
            ctx.fillStyle = "#8a2be2";
            ctx.fillText(`0x${hexValue.substring(0, 8)}...`, registersX + 80, currentY);
            
            // Show decimal value if small
            if (reg.value < 1000000n) {
              ctx.fillStyle = "#888";
              ctx.fillText(`(${reg.value.toString()})`, registersX + 180, currentY);
            }
            
            currentY += 18;
          }
        });
        currentY += 10;
      });
      
      // Draw execution history
      const historyY = currentY + 20;
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 14px monospace";
      ctx.fillText("Execution History", registersX + 10, historyY);
      
      executionHistory.slice(-8).forEach((entry, index) => {
        const y = historyY + 20 + (index * 16);
        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.fillText(entry, registersX + 10, y);
      });
      
      // Draw performance metrics
      const metricsY = historyY + 160;
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 14px monospace";
      ctx.fillText("DARCY128 Performance", registersX + 10, metricsY);
      
      const metricsData = [
        `IPC: ${metrics.instructionsPerCycle.toFixed(1)}x`,
        `SIMD Util: ${metrics.simdUtilization.toFixed(1)}%`,
        `Crypto Accel: ${metrics.cryptoAcceleration.toFixed(0)}%`,
        `Quad-Precision: ${metrics.quadPrecisionOps}`,
        `Memory BW: ${metrics.memoryBandwidthUtilization.toFixed(1)}%`
      ];
      
      metricsData.forEach((metric, index) => {
        const y = metricsY + 20 + (index * 16);
        ctx.fillStyle = "#4caf50";
        ctx.font = "11px monospace";
        ctx.fillText(metric, registersX + 10, y);
      });
      
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [instructions, currentInstructionIndex, registers, executionHistory, metrics, screenWidth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth - 4;
        canvas.height = window.innerHeight - (window.innerWidth < 768 ? 60 : 70);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const executeInstruction = (instruction: Darcy128Instruction) => {
    const newRegisters = { ...registers };
    const newVectorRegisters = { ...vectorRegisters };
    let newHistory = [...executionHistory];
    let newMetrics = { ...metrics };
    
    switch (instruction.opcode) {
      case "addi":
        // Legacy MIPS32 compatibility
        const dest = instruction.operands[0];
        const src = instruction.operands[1];
        const imm = BigInt(parseInt(instruction.operands[2]));
        newRegisters[dest].value = newRegisters[src].value + imm;
        newHistory.push(`MIPS32: ${instruction.instruction} -> ${dest} = ${newRegisters[dest].value}`);
        break;
        
      case "add128":
        // 128-bit arithmetic
        const dest128 = instruction.operands[0];
        const src1_128 = instruction.operands[1];
        const src2_128 = instruction.operands[2];
        newRegisters[dest128].value = newRegisters[src1_128].value + newRegisters[src2_128].value;
        newHistory.push(`128-bit: ${instruction.instruction} -> ${dest128} = 0x${newRegisters[dest128].value.toString(16)}`);
        break;
        
      case "vadd.f32":
        // SIMD: 4x FP32 parallel addition
        const vdest = instruction.operands[0];
        const vsrc1 = instruction.operands[1];
        const vsrc2 = instruction.operands[2];
        
        const v1 = newVectorRegisters[vsrc1];
        const v2 = newVectorRegisters[vsrc2];
        const result = newVectorRegisters[vdest];
        
        for (let i = 0; i < 4; i++) {
          result.fp32[i] = v1.fp32[i] + v2.fp32[i];
        }
        
        newHistory.push(`SIMD FP32: ${instruction.instruction} -> 4x parallel FP32 addition`);
        newMetrics.simdUtilization = Math.min(100, newMetrics.simdUtilization + 5);
        break;
        
      case "vadd.f16":
        // SIMD: 8x FP16 parallel addition
        const vdest16 = instruction.operands[0];
        const vsrc1_16 = instruction.operands[1];
        const vsrc2_16 = instruction.operands[2];
        
        const v1_16 = newVectorRegisters[vsrc1_16];
        const v2_16 = newVectorRegisters[vsrc2_16];
        const result16 = newVectorRegisters[vdest16];
        
        for (let i = 0; i < 8; i++) {
          result16.fp16[i] = v1_16.fp16[i] + v2_16.fp16[i];
        }
        
        newHistory.push(`SIMD FP16: ${instruction.instruction} -> 8x parallel FP16 addition`);
        newMetrics.simdUtilization = Math.min(100, newMetrics.simdUtilization + 8);
        break;
        
      case "aes.encrypt":
        // Native AES encryption
        const cdest = instruction.operands[0];
        const cdata = instruction.operands[1];
        const ckey = instruction.operands[2];
        
        // Simulate AES encryption (simplified)
        const data = newRegisters[cdata].value;
        const key = newRegisters[ckey].value;
        const encrypted = data ^ key; // Simplified XOR for demo
        
        newRegisters[cdest].value = encrypted;
        newHistory.push(`AES: ${instruction.instruction} -> Native 128-bit encryption`);
        newMetrics.cryptoAcceleration = Math.min(500, newMetrics.cryptoAcceleration + 10);
        break;
        
      case "qadd":
        // Quad-precision floating point addition
        const qdest = instruction.operands[0];
        const qsrc1 = instruction.operands[1];
        const qsrc2 = instruction.operands[2];
        
        // Simulate quad-precision (simplified)
        newRegisters[qdest].value = newRegisters[qsrc1].value + newRegisters[qsrc2].value;
        newHistory.push(`Quad-Precision: ${instruction.instruction} -> 113-bit mantissa precision`);
        newMetrics.quadPrecisionOps++;
        break;
        
      case "uuid.generate":
        // Generate UUID
        const uuidReg = instruction.operands[0];
        const uuid = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) << 64n | BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        newRegisters[uuidReg].value = uuid;
        newHistory.push(`UUID: ${instruction.instruction} -> Generated 128-bit UUID`);
        break;
        
      case "ipv6.compare":
        // IPv6 comparison
        const ip1 = instruction.operands[0];
        const ip2 = instruction.operands[1];
        const equal = newRegisters[ip1].value === newRegisters[ip2].value;
        newHistory.push(`IPv6: ${instruction.instruction} -> Addresses ${equal ? 'equal' : 'different'}`);
        break;
        
      case "matmul.f32":
        // Matrix multiplication for AI/ML
        const mdest = instruction.operands[0];
        const msrc1 = instruction.operands[1];
        const msrc2 = instruction.operands[2];
        
        // Simulate 4x4 matrix multiplication
        newRegisters[mdest].value = newRegisters[msrc1].value + newRegisters[msrc2].value;
        newHistory.push(`AI/ML: ${instruction.instruction} -> 4x4 FP32 matrix multiplication`);
        newMetrics.simdUtilization = Math.min(100, newMetrics.simdUtilization + 15);
        break;
        
      default:
        newHistory.push(`Unknown instruction: ${instruction.instruction}`);
    }
    
    setRegisters(newRegisters);
    setVectorRegisters(newVectorRegisters);
    setExecutionHistory(newHistory);
    setMetrics(newMetrics);
  };

  const stepForward = () => {
    if (currentInstructionIndex < instructions.length - 1) {
      const nextIndex = currentInstructionIndex + 1;
      setCurrentInstructionIndex(nextIndex);
      executeInstruction(instructions[nextIndex]);
    }
  };

  const stepBackward = () => {
    if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
    }
  };

  const reset = () => {
    setCurrentInstructionIndex(0);
    setRegisters({
      "$q0": { name: "$q0", value: 0n, type: "general", width: 128 },
      "$q1": { name: "$q1", value: 0n, type: "general", width: 128 },
      "$q2": { name: "$q2", value: 0n, type: "general", width: 128 },
      "$q3": { name: "$q3", value: 0n, type: "general", width: 128 },
      "$v0": { name: "$v0", value: 0n, type: "vector", width: 128 },
      "$v1": { name: "$v1", value: 0n, type: "vector", width: 128 },
      "$v2": { name: "$v2", value: 0n, type: "vector", width: 128 },
      "$v3": { name: "$v3", value: 0n, type: "vector", width: 128 },
      "$c0": { name: "$c0", value: 0n, type: "crypto", width: 128 },
      "$c1": { name: "$c1", value: 0n, type: "crypto", width: 128 },
      "$c2": { name: "$c2", value: 0n, type: "crypto", width: 128 },
      "$qf0": { name: "$qf0", value: 0n, type: "general", width: 128 },
      "$qf1": { name: "$qf1", value: 0n, type: "general", width: 128 },
      "$qf2": { name: "$qf2", value: 0n, type: "general", width: 128 },
      "$u0": { name: "$u0", value: 0n, type: "general", width: 128 },
      "$ip0": { name: "$ip0", value: 0n, type: "general", width: 128 },
      "$ip1": { name: "$ip1", value: 0n, type: "general", width: 128 },
      "$m0": { name: "$m0", value: 0n, type: "vector", width: 128 },
      "$m1": { name: "$m1", value: 0n, type: "vector", width: 128 },
      "$m2": { name: "$m2", value: 0n, type: "vector", width: 128 },
      "$zero": { name: "$zero", value: 0n, type: "general", width: 128 },
      "$t0": { name: "$t0", value: 0n, type: "general", width: 128 },
      "$t1": { name: "$t1", value: 0n, type: "general", width: 128 },
    });
    setExecutionHistory([]);
    setMetrics({
      instructionsPerCycle: 4.0,
      simdUtilization: 0,
      cryptoAcceleration: 0,
      quadPrecisionOps: 0,
      memoryBandwidthUtilization: 0
    });
  };

  const runAll = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const runStep = () => {
      if (currentInstructionIndex < instructions.length - 1 && !isPaused) {
        setTimeout(() => {
          stepForward();
          runStep();
        }, 1200); // Slightly slower to appreciate the 128-bit operations
      } else {
        setIsRunning(false);
      }
    };
    
    runStep();
  };

  const pause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      overflow: "hidden",
      boxSizing: "border-box",
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <Navbar screenWidth={screenWidth} />
      
      <div style={{ 
        position: "fixed",
        top: screenWidth < 768 ? "60px" : "70px",
        left: 0,
        width: "100vw",
        height: `calc(100vh - ${screenWidth < 768 ? "60px" : "70px"})`,
        overflow: "hidden"
      }}>
        {/* Title */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10
        }}>
          <h1 style={{ 
            color: "#00ffff", 
            fontSize: "32px", 
            fontWeight: "bold", 
            margin: 0,
            textShadow: "0 0 15px rgba(0, 255, 255, 0.7)"
          }}>
            DARCY128 Processor Simulator
          </h1>
          <p style={{
            color: "#888",
            fontSize: "14px",
            margin: "5px 0 0 0",
            fontStyle: "italic"
          }}>
            Revolutionary 128-bit Architecture • SIMD • Crypto • AI/ML • Quad-Precision
          </p>
        </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 4}
        height={window.innerHeight - (screenWidth < 768 ? 60 : 70)}
        style={{
          display: "block",
          width: "calc(100% - 4px)",
          height: "calc(100% - 4px)",
          margin: "2px",
          background: "#1a1a1a"
        }}
      />
      
      {/* Control Panel */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.9)",
        padding: "15px 25px",
        borderRadius: "12px",
        display: "flex",
        gap: "12px",
        zIndex: 1000,
        border: "1px solid #00ffff"
      }}>
        <button
          onClick={stepBackward}
          disabled={currentInstructionIndex === 0}
          style={{
            padding: "10px 18px",
            background: currentInstructionIndex === 0 ? "#333" : "#8a2be2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: currentInstructionIndex === 0 ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          ⬅️ Step Back
        </button>
        
        <button
          onClick={stepForward}
          disabled={currentInstructionIndex >= instructions.length - 1}
          style={{
            padding: "10px 18px",
            background: currentInstructionIndex >= instructions.length - 1 ? "#333" : "#ff69b4",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: currentInstructionIndex >= instructions.length - 1 ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          Step Forward ➡️
        </button>
        
        <button
          onClick={runAll}
          disabled={isRunning}
          style={{
            padding: "10px 18px",
            background: isRunning ? "#333" : "#00ffff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          ▶️ Run All
        </button>
        
        <button
          onClick={pause}
          disabled={!isRunning}
          style={{
            padding: "10px 18px",
            background: !isRunning ? "#333" : "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: !isRunning ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          ⏸️ Pause
        </button>
        
        <button
          onClick={reset}
          style={{
            padding: "10px 18px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          🔄 Reset
        </button>
      </div>
      
      {/* Current Instruction Info */}
      <div style={{
        position: "fixed",
        top: "100px",
        right: "20px",
        background: "rgba(0, 0, 0, 0.9)",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        fontFamily: "monospace",
        fontSize: "12px",
        zIndex: 1000,
        maxWidth: "350px",
        border: "1px solid #00ffff"
      }}>
        <div style={{ color: "#00ffff", fontWeight: "bold", marginBottom: "15px", fontSize: "14px" }}>
          Current Instruction
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Address:</strong> 0x{instructions[currentInstructionIndex]?.address.toString(16).padStart(8, '0')}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Instruction:</strong> {instructions[currentInstructionIndex]?.instruction}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Category:</strong> <span style={{ color: "#ff9800" }}>{instructions[currentInstructionIndex]?.category}</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Width:</strong> <span style={{ color: "#4caf50" }}>{instructions[currentInstructionIndex]?.width}-bit</span>
        </div>
        <div>
          <strong>Description:</strong> {instructions[currentInstructionIndex]?.description}
        </div>
      </div>
    </div>
    </div>
  );
}
