import React, { useState, useEffect, useRef } from 'react';
import Navbar from './navbar/Navbar';
import { Darcy128CPU, Darcy128CPUState } from '../emulator/Darcy128CPU';
import { Darcy128StateService } from '../services/Darcy128StateService';

interface Darcy128EmulatorProps {
  screenWidth: number;
}

interface InstructionBlock {
  id: string;
  type: 'add' | 'sub' | 'mult' | 'div' | 'lw' | 'sw' | 'beq' | 'bne' | 'lis' | 'jr' | 'jalr';
  x: number;
  y: number;
  params: { [key: string]: string };
  hexCode: string;
  isExecuting?: boolean;
}

interface CommandTemplate {
  type: string;
  name: string;
  params: string[];
  description: string;
  hexCode: string;
}

export default function Darcy128Emulator({ screenWidth }: Darcy128EmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cpu, setCpu] = useState<Darcy128CPU | null>(null);
  const [cpuState, setCpuState] = useState<Darcy128CPUState | null>(null);
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showRegisterEditor, setShowRegisterEditor] = useState(false);
  const [editingRegister, setEditingRegister] = useState<number | null>(null);
  const [registerValue, setRegisterValue] = useState<string>('');
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);
  const [instructionBlocks, setInstructionBlocks] = useState<InstructionBlock[]>([]);
  const [showCommandBuilder, setShowCommandBuilder] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<CommandTemplate | null>(null);
  const [commandParams, setCommandParams] = useState<{ [key: string]: string }>({});
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
        
        // Initialize with sample program blocks
        initializeSampleProgram();
      } catch (error) {
        console.error('Failed to initialize CPU:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCPU();
  }, [stateService]);

  // Command templates for interactive building
  const commandTemplates: CommandTemplate[] = [
    { type: 'add', name: 'ADD', params: ['rd', 'rs', 'rt'], description: 'Add two registers', hexCode: '0x00221820' },
    { type: 'sub', name: 'SUB', params: ['rd', 'rs', 'rt'], description: 'Subtract two registers', hexCode: '0x00221822' },
    { type: 'mult', name: 'MULT', params: ['rs', 'rt'], description: 'Multiply two registers', hexCode: '0x00220018' },
    { type: 'div', name: 'DIV', params: ['rs', 'rt'], description: 'Divide two registers', hexCode: '0x0022001A' },
    { type: 'lw', name: 'LW', params: ['rt', 'rs', 'offset'], description: 'Load word from memory', hexCode: '0x8C220000' },
    { type: 'sw', name: 'SW', params: ['rt', 'rs', 'offset'], description: 'Store word to memory', hexCode: '0xAC220000' },
    { type: 'beq', name: 'BEQ', params: ['rs', 'rt', 'offset'], description: 'Branch if equal', hexCode: '0x10220004' },
    { type: 'bne', name: 'BNE', params: ['rs', 'rt', 'offset'], description: 'Branch if not equal', hexCode: '0x14220004' },
    { type: 'lis', name: 'LIS', params: ['rd', 'immediate'], description: 'Load immediate value', hexCode: '0x00000814' },
    { type: 'jr', name: 'JR', params: ['rs'], description: 'Jump to register', hexCode: '0x00000008' },
    { type: 'jalr', name: 'JALR', params: ['rs'], description: 'Jump and link register', hexCode: '0x00000009' }
  ];

  // Initialize sample program as visual blocks
  const initializeSampleProgram = () => {
    const sampleBlocks: InstructionBlock[] = [
      {
        id: 'block-1',
        type: 'lis',
        x: 50,
        y: 50,
        params: { rd: '1', immediate: '100' },
        hexCode: '0x00000814'
      },
      {
        id: 'block-2',
        type: 'lis',
        x: 50,
        y: 120,
        params: { rd: '2', immediate: '200' },
        hexCode: '0x00001014'
      },
      {
        id: 'block-3',
        type: 'add',
        x: 50,
        y: 190,
        params: { rd: '3', rs: '1', rt: '2' },
        hexCode: '0x00221820'
      },
      {
        id: 'block-4',
        type: 'sw',
        x: 50,
        y: 260,
        params: { rt: '3', rs: '0', offset: '0' },
        hexCode: '0xAC030000'
      },
      {
        id: 'block-5',
        type: 'jr',
        x: 50,
        y: 330,
        params: { rs: '0' },
        hexCode: '0x00000008'
      }
    ];
    setInstructionBlocks(sampleBlocks);
  };

  // Add new instruction block
  const addInstructionBlock = () => {
    if (!selectedCommand) return;

    const newBlock: InstructionBlock = {
      id: `block-${Date.now()}`,
      type: selectedCommand.type as any,
      x: 50 + (instructionBlocks.length % 3) * 250,
      y: 50 + Math.floor(instructionBlocks.length / 3) * 80,
      params: commandParams,
      hexCode: selectedCommand.hexCode
    };

    setInstructionBlocks(prev => [...prev, newBlock]);
    setShowCommandBuilder(false);
    setSelectedCommand(null);
    setCommandParams({});
    addToTerminal(`Added ${selectedCommand.name} instruction`);
  };

  // Open command builder
  const openCommandBuilder = (command: CommandTemplate) => {
    setSelectedCommand(command);
    setCommandParams({});
    setShowCommandBuilder(true);
  };

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
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [cpu, cpuState, executionHistory, performanceMetrics, stateService]);

  // Execute single instruction
  const executeInstruction = async (instruction?: string) => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      
      if (instruction) {
        const instructionValue = instruction.startsWith('0x') 
          ? parseInt(instruction, 16) 
          : parseInt(instruction, 16);
        cpu.executeInstruction(instructionValue);
      } else {
        const instructionValue = cpu.fetch();
        cpu.executeInstruction(instructionValue);
      }

      // Update current instruction index
      setCurrentInstructionIndex(prev => prev + 1);

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

  // Execute next instruction from visual blocks
  const executeNextInstruction = async () => {
    if (!cpu || currentInstructionIndex >= instructionBlocks.length) return;

    const currentBlock = instructionBlocks[currentInstructionIndex + 1];
    if (!currentBlock) return;

    try {
      setIsLoading(true);
      
      // Highlight current instruction
      setInstructionBlocks(prev => prev.map((block, index) => ({
        ...block,
        isExecuting: index === currentInstructionIndex + 1
      })));

      // Execute the instruction
      const instructionValue = parseInt(currentBlock.hexCode, 16);
      cpu.executeInstruction(instructionValue);

      // Update current instruction index
      setCurrentInstructionIndex(prev => prev + 1);

      // Update state
      setCpuState(cpu.getState());
      setExecutionHistory(cpu.getExecutionHistory());
      setPerformanceMetrics(cpu.getPerformanceMetrics());

      // Add to terminal
      addToTerminal(`Executed: ${currentBlock.type} ${JSON.stringify(currentBlock.params)}`);

      // Save state
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to execute instruction:', error);
      addToTerminal(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Run all instructions
  const runAllInstructions = async () => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      setIsRunning(true);
      
      // Reset instruction index
      setCurrentInstructionIndex(-1);
      
      // Run all instructions
      for (let i = 0; i < instructionBlocks.length; i++) {
        if (!isRunning) break;
        
        const block = instructionBlocks[i];
        
        // Highlight current instruction
        setInstructionBlocks(prev => prev.map((b, index) => ({
          ...b,
          isExecuting: index === i
        })));

        // Execute instruction
        const instructionValue = parseInt(block.hexCode, 16);
        cpu.executeInstruction(instructionValue);

        // Update state
        setCpuState(cpu.getState());
        setExecutionHistory(cpu.getExecutionHistory());
        setPerformanceMetrics(cpu.getPerformanceMetrics());

        // Add to terminal
        addToTerminal(`Executed: ${block.type} ${JSON.stringify(block.params)}`);

        // Small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Clear highlighting
      setInstructionBlocks(prev => prev.map(block => ({ ...block, isExecuting: false })));

      // Save final state
      await stateService.saveState(
        cpu.getState(),
        cpu.getExecutionHistory(),
        cpu.getPerformanceMetrics()
      );
    } catch (error) {
      console.error('Failed to run all instructions:', error);
      addToTerminal(`Error: ${error}`);
    } finally {
      setIsLoading(false);
      setIsRunning(false);
    }
  };

  // Reset CPU
  const reset = async () => {
    if (!cpu) return;

    try {
      setIsLoading(true);
      cpu.reset();
      setCurrentInstructionIndex(-1);
      
      // Clear highlighting
      setInstructionBlocks(prev => prev.map(block => ({ ...block, isExecuting: false })));
      
      setCpuState(cpu.getState());
      setExecutionHistory(cpu.getExecutionHistory());
      setPerformanceMetrics(cpu.getPerformanceMetrics());

      // Clear terminal
      setExecutionHistory([]);

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

  // Pause execution
  const pause = () => {
    if (cpu) {
      cpu.stop();
      setIsRunning(false);
      setCpuState(cpu.getState());
    }
  };

  // Stop execution
  const stop = () => {
    if (cpu) {
      cpu.stop();
      setIsRunning(false);
      setCpuState(cpu.getState());
    }
  };

  // Add message to terminal
  const addToTerminal = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setExecutionHistory(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Draw Scratch-like canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = screenWidth * 0.7;
    canvas.height = 500;

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw instruction blocks
    instructionBlocks.forEach((block, index) => {
      drawInstructionBlock(ctx, block, index);
    });

  }, [instructionBlocks, screenWidth]);

  // Draw individual instruction block
  const drawInstructionBlock = (ctx: CanvasRenderingContext2D, block: InstructionBlock, index: number) => {
    const blockWidth = 200;
    const blockHeight = 60;
    const x = block.x;
    const y = block.y;

    // Block background
    ctx.fillStyle = block.isExecuting ? '#ff6b6b' : getBlockColor(block.type);
    ctx.fillRect(x, y, blockWidth, blockHeight);

    // Block border
    ctx.strokeStyle = block.isExecuting ? '#ff0000' : '#333';
    ctx.lineWidth = block.isExecuting ? 3 : 2;
    ctx.strokeRect(x, y, blockWidth, blockHeight);

    // Instruction text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(block.type.toUpperCase(), x + blockWidth/2, y + 25);

    // Parameters
    ctx.font = '12px Arial';
    const params = Object.entries(block.params).map(([key, value]) => `${key}=${value}`).join(', ');
    ctx.fillText(params, x + blockWidth/2, y + 45);

    // Connection line to next block
    if (index < instructionBlocks.length - 1) {
      const nextBlock = instructionBlocks[index + 1];
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + blockWidth/2, y + blockHeight);
      ctx.lineTo(nextBlock.x + blockWidth/2, nextBlock.y);
      ctx.stroke();
    }
  };

  // Get block color based on instruction type
  const getBlockColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'add': '#4ecdc4',
      'sub': '#45b7d1',
      'mult': '#96ceb4',
      'div': '#feca57',
      'lw': '#ff9ff3',
      'sw': '#54a0ff',
      'beq': '#5f27cd',
      'bne': '#00d2d3',
      'lis': '#ff6348',
      'jr': '#ff4757',
      'jalr': '#2ed573'
    };
    return colors[type] || '#95a5a6';
  };

  // Edit register value
  const editRegister = (regIndex: number) => {
    if (!cpuState) return;
    
    setEditingRegister(regIndex);
    setRegisterValue(cpuState.registers[regIndex].value);
    setShowRegisterEditor(true);
  };

  // Save register value
  const saveRegisterValue = () => {
    if (!cpu || editingRegister === null) return;

    try {
      const value = BigInt(registerValue);
      cpu.writeReg(editingRegister, value);
      setCpuState(cpu.getState());
      setShowRegisterEditor(false);
      setEditingRegister(null);
      setRegisterValue('');
      addToTerminal(`Register $${editingRegister} set to ${registerValue}`);
    } catch (error) {
      console.error('Invalid register value:', error);
      addToTerminal(`Error: Invalid register value`);
    }
  };

  // Cancel register editing
  const cancelRegisterEdit = () => {
    setShowRegisterEditor(false);
    setEditingRegister(null);
    setRegisterValue('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', overflow: 'hidden' }}>
      <Navbar />
      
      <div style={{ 
        paddingTop: '80px', 
        height: `calc(100vh - ${terminalExpanded ? terminalHeight : 40}px - 80px)`,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#00ffff', fontSize: '32px', margin: 0 }}>
              DARCY128 Visual Programmer
            </h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={executeNextInstruction}
                disabled={isLoading || isRunning || currentInstructionIndex >= instructionBlocks.length - 1}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isLoading || isRunning || currentInstructionIndex >= instructionBlocks.length - 1 ? '#666' : '#00ff00',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isLoading || isRunning || currentInstructionIndex >= instructionBlocks.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? '⏳' : '▶️'} Next Step
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
                onClick={runAllInstructions}
                disabled={isLoading || isRunning}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isLoading || isRunning ? '#666' : '#0066ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isLoading || isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isRunning ? '⏳' : '🚀'} {isRunning ? 'Running...' : 'Run All'}
              </button>
              
              <button
                onClick={pause}
                disabled={!isRunning}
                style={{
                  padding: '10px 20px',
                  backgroundColor: !isRunning ? '#666' : '#ff0066',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: !isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ⏸️ Pause
              </button>
              
              <button
                onClick={stop}
                disabled={!isRunning}
                style={{
                  padding: '10px 20px',
                  backgroundColor: !isRunning ? '#666' : '#ff0000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: !isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ⏹️ Stop
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', gap: '20px', height: 'calc(100% - 100px)' }}>
            {/* Visual Programming Canvas */}
            <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ color: '#00ff00', marginTop: 0, marginBottom: '20px' }}>Instruction Canvas</h3>
              <canvas
                ref={canvasRef}
                style={{
                  border: '2px solid #00ffff',
                  borderRadius: '10px',
                  backgroundColor: '#f0f0f0',
                  width: '100%',
                  height: '400px'
                }}
              />
            </div>
            
            {/* Command Builder Panel */}
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Command Builder */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
                <h3 style={{ color: '#00ff00', marginTop: 0 }}>Command Builder</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  {commandTemplates.map((command, index) => (
                    <button
                      key={index}
                      onClick={() => openCommandBuilder(command)}
                      style={{
                        padding: '10px',
                        backgroundColor: '#0066ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {command.name}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                  Click a command to add it to your program
                </div>
              </div>

              {/* Register Editor */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
                <h3 style={{ color: '#00ff00', marginTop: 0 }}>Registers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  {cpuState?.registers.slice(0, 8).map((reg, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '12px', color: '#ccc' }}>{reg.name}</label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                          type="text"
                          value={reg.value}
                          readOnly
                          style={{
                            flex: 1,
                            padding: '5px',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: '3px',
                            fontSize: '10px'
                          }}
                        />
                        <button
                          onClick={() => editRegister(index)}
                          disabled={isRunning}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: isRunning ? '#666' : '#0066ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Panel */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
                <h3 style={{ color: '#00ff00', marginTop: 0 }}>Status</h3>
                <div style={{ fontSize: '12px', color: '#ccc' }}>
                  <p><strong>Current Step:</strong> {currentInstructionIndex + 1} / {instructionBlocks.length}</p>
                  <p><strong>Status:</strong> {isRunning ? 'Running' : isLoading ? 'Processing...' : 'Ready'}</p>
                  <p><strong>PC:</strong> {cpuState?.pc}</p>
                  <p><strong>Instructions Executed:</strong> {performanceMetrics?.instructions_executed || 0}</p>
                  <p><strong>Architecture:</strong> DARCY128 (128-bit)</p>
                  <p><strong>Compatibility:</strong> MIPS32</p>
                  <p><strong>Multiplication:</strong> Karatsuba</p>
                  <p><strong>Division:</strong> Long Division</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div style={{
          height: terminalExpanded ? `${terminalHeight}px` : '40px',
          backgroundColor: '#1e1e1e',
          borderTop: '2px solid #00ff00',
          transition: 'height 0.3s ease',
          overflow: 'hidden'
        }}>
          {/* Terminal Header */}
          <div style={{
            height: '40px',
            backgroundColor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 15px',
            cursor: 'pointer',
            borderBottom: terminalExpanded ? '1px solid #444' : 'none'
          }} onClick={() => setTerminalExpanded(!terminalExpanded)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>Terminal</span>
              <span style={{ color: '#888', fontSize: '12px' }}>
                {executionHistory.length} messages
              </span>
            </div>
            <div style={{ color: '#00ff00', fontSize: '18px' }}>
              {terminalExpanded ? '▼' : '▲'}
            </div>
          </div>

          {/* Terminal Content */}
          {terminalExpanded && (
            <div style={{
              height: `calc(100% - 40px)`,
              overflow: 'auto',
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#00ff00',
              backgroundColor: '#1e1e1e'
            }}>
              {executionHistory.length === 0 ? (
                <div style={{ color: '#888' }}>No execution history yet...</div>
              ) : (
                executionHistory.map((entry, index) => (
                  <div key={index} style={{ marginBottom: '5px' }}>
                    {entry}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

        {/* Command Builder Modal */}
        {showCommandBuilder && selectedCommand && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '30px',
              borderRadius: '10px',
              border: '2px solid #00ff00',
              minWidth: '500px'
            }}>
              <h3 style={{ color: '#00ff00', marginTop: 0 }}>
                Add {selectedCommand.name} Instruction
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>
                {selectedCommand.description}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                {selectedCommand.params.map((param, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
                      {param.toUpperCase()}:
                    </label>
                    <input
                      type="text"
                      value={commandParams[param] || ''}
                      onChange={(e) => setCommandParams(prev => ({ ...prev, [param]: e.target.value }))}
                      placeholder={`Enter ${param}`}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #555',
                        borderRadius: '5px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowCommandBuilder(false);
                    setSelectedCommand(null);
                    setCommandParams({});
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addInstructionBlock}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add Instruction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Register Editor Modal */}
        {showRegisterEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '10px',
            border: '2px solid #00ff00',
            minWidth: '400px'
          }}>
            <h3 style={{ color: '#00ff00', marginTop: 0 }}>
              Edit Register ${editingRegister}
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>
                Enter new value (hexadecimal):
              </label>
              <input
                type="text"
                value={registerValue}
                onChange={(e) => setRegisterValue(e.target.value)}
                placeholder="0x00000000000000000000000000000000"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelRegisterEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveRegisterValue}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00ff00',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}