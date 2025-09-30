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
import Darcy128ApiService, { Darcy128CPU as ApiCPU, EmulatorResponse } from "../services/darcy128ApiService";

interface Darcy128EmulatorProps {
  screenWidth: number;
}

export default function Darcy128Emulator({ screenWidth }: Darcy128EmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const apiService = new Darcy128ApiService();
  
  // Darcy128 Instructions showcasing revolutionary capabilities
  const [instructions, setInstructions] = useState<Darcy128Instruction[]>([
    // Traditional MIPS32 compatibility
    { address: 0x00400000, instruction: "lis $1", opcode: "lis", operands: ["$1"], description: "Load immediate value into $1", category: "arithmetic", width: 32 },
    { address: 0x00400004, instruction: ".word 100", opcode: "word", operands: ["100"], description: "Immediate value: 100", category: "arithmetic", width: 32 },
    
    // 128-bit arithmetic operations
    { address: 0x00400008, instruction: "lis $2", opcode: "lis", operands: ["$2"], description: "Load immediate value into $2", category: "arithmetic", width: 32 },
    { address: 0x0040000c, instruction: ".word 200", opcode: "word", operands: ["200"], description: "Immediate value: 200", category: "arithmetic", width: 32 },
    { address: 0x00400010, instruction: "add $3, $1, $2", opcode: "add", operands: ["$3", "$1", "$2"], description: "128-bit addition: $3 = $1 + $2", category: "arithmetic", width: 128 },
    
    // Memory operations
    { address: 0x00400014, instruction: "sw $3, 0($0)", opcode: "sw", operands: ["$3", "0", "$0"], description: "Store 128-bit word to memory", category: "memory", width: 128 },
    
    // Multiplication
    { address: 0x00400018, instruction: "mult $1, $2", opcode: "mult", operands: ["$1", "$2"], description: "128-bit multiplication: HI:LO = $1 × $2", category: "arithmetic", width: 128 },
    { address: 0x0040001c, instruction: "mflo $4", opcode: "mflo", operands: ["$4"], description: "Move from LO register", category: "arithmetic", width: 128 },
    
    // Division
    { address: 0x00400020, instruction: "div $1, $2", opcode: "div", operands: ["$1", "$2"], description: "128-bit division: LO = quotient, HI = remainder", category: "arithmetic", width: 128 },
    { address: 0x00400024, instruction: "mfhi $5", opcode: "mfhi", operands: ["$5"], description: "Move from HI register", category: "arithmetic", width: 128 },
    
    // Branch test
    { address: 0x00400028, instruction: "beq $1, $2, 4", opcode: "beq", operands: ["$1", "$2", "4"], description: "Branch if equal", category: "control", width: 32 },
    { address: 0x0040002c, instruction: "jr $0", opcode: "jr", operands: ["$0"], description: "Jump to halt (address 0)", category: "control", width: 32 },
  ]);
  
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Backend CPU state
  const [cpuState, setCpuState] = useState<ApiCPU | null>(null);
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    instructions_executed: 0,
    simd_utilization: 0,
    crypto_acceleration: 0,
    memory_bandwidth: 0
  });
  
  // Initialize CPU state from backend
  useEffect(() => {
    initializeCPU();
  }, []);
  
  const initializeCPU = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getStatus();
      if (response.success) {
        setCpuState(response.cpu_state);
        setExecutionHistory(response.execution_history);
        if (response.performance_metrics) {
          setPerformanceMetrics(response.performance_metrics);
        }
      }
    } catch (error) {
      console.error('Failed to initialize CPU:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

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
      
      // Draw registers from backend CPU state
      if (cpuState && cpuState.registers) {
        const registerCategories = [
          { name: "General Purpose", regs: cpuState.registers.slice(0, 8), color: "#00ffff" },
          { name: "Arguments & Returns", regs: cpuState.registers.slice(8, 16), color: "#ff9800" },
          { name: "Saved Registers", regs: cpuState.registers.slice(16, 24), color: "#4caf50" },
          { name: "Special Registers", regs: cpuState.registers.slice(24, 32), color: "#ff5722" }
        ];
        
        let currentY = startY;
        registerCategories.forEach((category, catIndex) => {
          // Draw category header
          ctx.fillStyle = category.color;
          ctx.font = "bold 12px monospace";
          ctx.fillText(category.name, registersX + 10, currentY);
          currentY += 20;
          
          // Draw registers in this category
          category.regs.forEach((reg, regIndex) => {
            ctx.fillStyle = "#fff";
            ctx.font = "11px monospace";
            ctx.fillText(`${reg.name}:`, registersX + 20, currentY);
            
            // Display 128-bit value in hex
            ctx.fillStyle = "#8a2be2";
            ctx.fillText(reg.value.substring(0, 10) + "...", registersX + 80, currentY);
            
            // Show decimal value if small
            try {
              const decimalValue = BigInt(reg.value).toString();
              if (decimalValue.length < 10) {
                ctx.fillStyle = "#888";
                ctx.fillText(`(${decimalValue})`, registersX + 180, currentY);
              }
            } catch (error) {
              // Ignore parsing errors
            }
            
            currentY += 18;
          });
          currentY += 10;
        });
        
        // Draw special registers (PC, HI, LO)
        ctx.fillStyle = "#9c27b0";
        ctx.font = "bold 12px monospace";
        ctx.fillText("Special Registers", registersX + 10, currentY);
        currentY += 20;
        
        const specialRegs = [
          { name: "PC", value: cpuState.pc },
          { name: "HI", value: cpuState.hi },
          { name: "LO", value: cpuState.lo }
        ];
        
        specialRegs.forEach(reg => {
          ctx.fillStyle = "#fff";
          ctx.font = "11px monospace";
          ctx.fillText(`${reg.name}:`, registersX + 20, currentY);
          
          ctx.fillStyle = "#8a2be2";
          ctx.fillText(reg.value.substring(0, 10) + "...", registersX + 80, currentY);
          
          currentY += 18;
        });
      }
      
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
        `Instructions: ${performanceMetrics.instructions_executed}`,
        `SIMD Util: ${performanceMetrics.simd_utilization.toFixed(1)}%`,
        `Crypto Accel: ${performanceMetrics.crypto_acceleration.toFixed(0)}%`,
        `Memory BW: ${performanceMetrics.memory_bandwidth.toFixed(1)}%`
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
  }, [instructions, currentInstructionIndex, cpuState, executionHistory, performanceMetrics, screenWidth]);

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

  const executeInstruction = async (instruction: Darcy128Instruction) => {
    try {
      setIsLoading(true);
      
      // Convert instruction to hex format for backend
      const instructionHex = Darcy128ApiService.instructionToHex(instruction.instruction);
      
      const response = await apiService.executeInstruction(instructionHex);
      
      if (response.success) {
        setCpuState(response.cpu_state);
        setExecutionHistory(response.execution_history);
        if (response.performance_metrics) {
          setPerformanceMetrics(response.performance_metrics);
        }
      } else {
        console.error('Execution failed:', response.error);
        setExecutionHistory(prev => [...prev, `Error: ${response.error}`]);
      }
    } catch (error) {
      console.error('Failed to execute instruction:', error);
      setExecutionHistory(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const stepForward = async () => {
    if (currentInstructionIndex < instructions.length - 1) {
      const nextIndex = currentInstructionIndex + 1;
      setCurrentInstructionIndex(nextIndex);
      await executeInstruction(instructions[nextIndex]);
    }
  };

  const stepBackward = () => {
    if (currentInstructionIndex > 0) {
      setCurrentInstructionIndex(currentInstructionIndex - 1);
    }
  };

  const reset = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.reset();
      if (response.success) {
        setCpuState(response.cpu_state);
        setExecutionHistory(response.execution_history);
        if (response.performance_metrics) {
          setPerformanceMetrics(response.performance_metrics);
        }
        setCurrentInstructionIndex(0);
      }
    } catch (error) {
      console.error('Failed to reset CPU:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAll = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const runStep = async () => {
      if (currentInstructionIndex < instructions.length - 1 && !isPaused) {
        await stepForward();
        setTimeout(() => {
          runStep();
        }, 1000); // 1 second delay between steps
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

  const loadSampleProgram = async (programName: string) => {
    try {
      setIsLoading(true);
      const samplePrograms = Darcy128ApiService.getSamplePrograms();
      const program = samplePrograms.find(p => p.name === programName);
      
      if (program) {
        const response = await apiService.loadProgram(program.program);
        if (response.success) {
          setCpuState(response.cpu_state);
          setExecutionHistory(response.execution_history);
          if (response.performance_metrics) {
            setPerformanceMetrics(response.performance_metrics);
          }
          setCurrentInstructionIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to load program:', error);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          style={{
            padding: "10px 18px",
            background: isLoading ? "#333" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          🔄 Reset
        </button>
        
        <button
          onClick={() => loadSampleProgram('Simple Addition')}
          disabled={isLoading}
          style={{
            padding: "10px 18px",
            background: isLoading ? "#333" : "#9c27b0",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          📝 Load Sample
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
