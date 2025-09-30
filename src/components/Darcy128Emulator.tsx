import React, { useState, useEffect, useRef } from 'react';
import Navbar from './navbar/Navbar';
import { Darcy128CPU, Darcy128CPUState } from '../emulator/Darcy128CPU';
import { Darcy128StateService } from '../services/Darcy128StateService';

interface Darcy128EmulatorProps {
  screenWidth: number;
}

export default function Darcy128Emulator({ screenWidth }: Darcy128EmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cpu, setCpu] = useState<Darcy128CPU | null>(null);
  const [cpuState, setCpuState] = useState<Darcy128CPUState | null>(null);
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stateService] = useState(() => new Darcy128StateService());

  // Initialize CPU
  useEffect(() => {
    const initializeCPU = async () => {
      setIsLoading(true);
      try {
        const newCpu = new Darcy128CPU();
        setCpu(newCpu);
        
        // Load state from server
        const stateResponse = await stateService.loadState();
        if (stateResponse.success && stateResponse.cpu_state) {
          newCpu.loadState(stateResponse.cpu_state);
        }
        
        setCpuState(newCpu.getState());
        setExecutionHistory(newCpu.getExecutionHistory());
        setPerformanceMetrics(newCpu.getPerformanceMetrics());
      } catch (error) {
        console.error('Failed to initialize CPU:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCPU();
  }, [stateService]);

  // Auto-save state periodically
  useEffect(() => {
    if (!cpu || !cpuState) return;

    const saveInterval = setInterval(async () => {
      try {
        await stateService.saveState(
          cpuState,
          executionHistory,
          performanceMetrics
        );
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [cpu, cpuState, executionHistory, performanceMetrics, stateService]);

  // Execute instruction
  const executeInstruction = async (instruction?: string) => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      
      if (instruction) {
        // Execute specific instruction
        const instructionValue = instruction.startsWith('0x') 
          ? parseInt(instruction, 16) 
          : parseInt(instruction, 16);
        cpu.executeInstruction(instructionValue);
      } else {
        // Execute next instruction
        const instructionValue = cpu.fetch();
        cpu.executeInstruction(instructionValue);
      }

      // Update state
      setCpuState(cpu.getState());
      setExecutionHistory(cpu.getExecutionHistory());
      setPerformanceMetrics(cpu.getPerformanceMetrics());

      // Save state
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to execute instruction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset CPU
  const reset = async () => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      cpu.reset();
      
      setCpuState(cpu.getState());
      setExecutionHistory(cpu.getExecutionHistory());
      setPerformanceMetrics(cpu.getPerformanceMetrics());

      // Save reset state
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to reset CPU:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run all instructions
  const runAll = async () => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      
      // Run until halt or error
      while (cpu.isRunning()) {
        const instructionValue = cpu.fetch();
        cpu.executeInstruction(instructionValue);
        
        // Update state periodically
        if (cpu.getPerformanceMetrics().instructions_executed % 10 === 0) {
          setCpuState(cpu.getState());
          setExecutionHistory(cpu.getExecutionHistory());
          setPerformanceMetrics(cpu.getPerformanceMetrics());
        }
      }

      // Final update
      setCpuState(cpu.getState());
      setExecutionHistory(cpu.getExecutionHistory());
      setPerformanceMetrics(cpu.getPerformanceMetrics());

      // Save final state
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to run all instructions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pause execution
  const pause = () => {
    if (cpu) {
      cpu.stop();
      setCpuState(cpu.getState());
    }
  };

  // Load sample program
  const loadSampleProgram = async () => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      
      // Simple MIPS32 program: add two numbers
      const program = [
        0x00000814, // lis $1 (load immediate)
        100,        // .word 100
        0x00001014, // lis $2 (load immediate)
        200,        // .word 200
        0x00221820, // add $3, $1, $2
        0x00000008  // jr $0 (halt)
      ];

      // Store program in memory
      for (let i = 0; i < program.length; i++) {
        cpu.getMemory().storeInstruction(i * 4, program[i]);
      }

      setCpuState(cpu.getState());
      
      // Save state with loaded program
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to load sample program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !cpuState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = screenWidth * 0.9;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#00ffff';
    ctx.font = '24px monospace';
    ctx.fillText('DARCY128 Processor Emulator', 20, 40);

    // Draw CPU state
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    let y = 80;

    // Registers
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Registers:', 20, y);
    y += 25;

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    
    cpuState.registers.forEach((reg, index) => {
      if (index % 4 === 0) {
        y += 20;
      }
      
      const x = 20 + (index % 4) * (canvas.width / 4);
      ctx.fillText(`${reg.name}: ${reg.value}`, x, y);
    });

    y += 30;

    // Special registers
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText('Special Registers:', 20, y);
    y += 25;

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`PC: ${cpuState.pc}`, 20, y);
    y += 20;
    ctx.fillText(`HI: ${cpuState.hi}`, 20, y);
    y += 20;
    ctx.fillText(`LO: ${cpuState.lo}`, 20, y);
    y += 20;
    ctx.fillText(`Mode: ${cpuState.execution_mode}`, 20, y);
    y += 20;
    ctx.fillText(`Running: ${cpuState.running}`, 20, y);

    y += 30;

    // Performance metrics
    if (performanceMetrics) {
      ctx.fillStyle = '#00ff00';
      ctx.font = '14px monospace';
      ctx.fillText('Performance Metrics:', 20, y);
      y += 25;

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(`Instructions Executed: ${performanceMetrics.instructions_executed}`, 20, y);
      y += 20;
      ctx.fillText(`SIMD Utilization: ${performanceMetrics.simd_utilization}%`, 20, y);
      y += 20;
      ctx.fillText(`Crypto Acceleration: ${performanceMetrics.crypto_acceleration}%`, 20, y);
      y += 20;
      ctx.fillText(`Memory Bandwidth: ${performanceMetrics.memory_bandwidth}%`, 20, y);
    }

    y += 30;

    // Execution history
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText('Execution History:', 20, y);
    y += 25;

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    
    const historyToShow = executionHistory.slice(-10); // Show last 10 instructions
    historyToShow.forEach((entry, index) => {
      ctx.fillText(entry, 20, y + (index * 15));
    });

  }, [cpuState, executionHistory, performanceMetrics, screenWidth]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff' }}>
      <Navbar />
      
      <div style={{ paddingTop: '80px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#00ffff', fontSize: '32px', margin: 0 }}>
            DARCY128 Processor Emulator
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => executeInstruction()}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#666' : '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? '⏳' : '▶️'} Step
            </button>
            
            <button
              onClick={reset}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#666' : '#ff6600',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Reset
            </button>
            
            <button
              onClick={runAll}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#666' : '#0066ff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? '⏳' : '🚀'} Run All
            </button>
            
            <button
              onClick={pause}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#666' : '#ff0066',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              ⏸️ Pause
            </button>
            
            <button
              onClick={loadSampleProgram}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#666' : '#6600ff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              📝 Load Sample
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <canvas
              ref={canvasRef}
              style={{
                border: '2px solid #00ffff',
                borderRadius: '10px',
                backgroundColor: '#1a1a1a'
              }}
            />
          </div>
          
          <div style={{ width: '300px' }}>
            <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
              <h3 style={{ color: '#00ff00', marginTop: 0 }}>Session Info</h3>
              <p style={{ margin: '10px 0' }}>
                <strong>Session ID:</strong><br />
                <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                  {stateService.getSessionId()}
                </code>
              </p>
              <p style={{ margin: '10px 0' }}>
                <strong>Status:</strong> {isLoading ? 'Processing...' : 'Ready'}
              </p>
              <p style={{ margin: '10px 0' }}>
                <strong>Architecture:</strong> DARCY128 (128-bit)
              </p>
              <p style={{ margin: '10px 0' }}>
                <strong>Compatibility:</strong> MIPS32
              </p>
              <p style={{ margin: '10px 0' }}>
                <strong>Memory:</strong> Map-based, 8MB
              </p>
              <p style={{ margin: '10px 0' }}>
                <strong>Instructions:</strong> Base 16 (hex)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}