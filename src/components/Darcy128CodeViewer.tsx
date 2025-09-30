import React, { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import { Darcy128CPU, HexInstruction } from '../emulator/Darcy128CPU';
import { Darcy128StateService } from '../services/Darcy128StateService';

interface CompiledInstruction {
  id: string;
  type: string;
  params: { [key: string]: string };
  hexCode: string;
  assembly: string;
  lineNumber: number;
}

export default function Darcy128CodeViewer() {
  const [cpu] = useState(() => new Darcy128CPU());
  const [stateService] = useState(() => new Darcy128StateService());
  const [cpuState, setCpuState] = useState<any>(null);
  const [compiledCode, setCompiledCode] = useState<CompiledInstruction[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [executionHistory, setExecutionHistory] = useState<string[]>([]);

  // Initialize CPU
  useEffect(() => {
    const initializeCPU = async () => {
      try {
        const state = await stateService.loadState();
        if (state) {
          setCpuState(state.cpuState);
          cpu.setState(state.cpuState);
        } else {
          const initialState = cpu.getState();
          setCpuState(initialState);
        }
      } catch (error) {
        console.error('Failed to initialize CPU:', error);
        const initialState = cpu.getState();
        setCpuState(initialState);
      }
    };

    initializeCPU();
  }, []);

  // Sample compiled program
  useEffect(() => {
    const sampleProgram: CompiledInstruction[] = [
      {
        id: '1',
        type: 'lis',
        params: { rd: '1', immediate: '100' },
        hexCode: '0x00000814',
        assembly: 'lis $1, 100',
        lineNumber: 1
      },
      {
        id: '2',
        type: 'lis',
        params: { rd: '2', immediate: '200' },
        hexCode: '0x00001014',
        assembly: 'lis $2, 200',
        lineNumber: 2
      },
      {
        id: '3',
        type: 'add',
        params: { rd: '3', rs: '1', rt: '2' },
        hexCode: '0x00221820',
        assembly: 'add $3, $1, $2',
        lineNumber: 3
      },
      {
        id: '4',
        type: 'sw',
        params: { rt: '3', rs: '0', offset: '0' },
        hexCode: '0xAC030000',
        assembly: 'sw $3, 0($0)',
        lineNumber: 4
      },
      {
        id: '5',
        type: 'jr',
        params: { rs: '0' },
        hexCode: '0x00000008',
        assembly: 'jr $0',
        lineNumber: 5
      }
    ];
    setCompiledCode(sampleProgram);
  }, []);

  const addToHistory = (message: string) => {
    setExecutionHistory(prev => [...prev, message]);
  };

  const executeNextInstruction = async () => {
    if (currentLine >= compiledCode.length - 1) {
      addToHistory('Program execution completed');
      setIsRunning(false);
      return;
    }

    const nextLine = currentLine + 1;
    const instruction = compiledCode[nextLine];
    
    setCurrentLine(nextLine);
    addToHistory(`Executing line ${nextLine + 1}: ${instruction.assembly}`);

    try {
      const hexInstruction = new HexInstruction(instruction.hexCode);
      cpu.executeInstruction(hexInstruction);
      
      const newState = cpu.getState();
      setCpuState(newState);
      
      addToHistory(`Instruction executed successfully`);
      
      // Auto-save state
      await stateService.saveState(newState, executionHistory, {});
    } catch (error) {
      addToHistory(`Error executing instruction: ${error}`);
    }
  };

  const runAllInstructions = async () => {
    setIsRunning(true);
    setCurrentLine(-1);
    
    for (let i = 0; i < compiledCode.length; i++) {
      await executeNextInstruction();
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visual effect
    }
    
    setIsRunning(false);
  };

  const resetProgram = async () => {
    cpu.reset();
    const initialState = cpu.getState();
    setCpuState(initialState);
    setCurrentLine(-1);
    setExecutionHistory([]);
    addToHistory('Program reset');
    
    try {
      await stateService.saveState(initialState, [], {});
    } catch (error) {
      console.error('Failed to save reset state:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', overflowY: 'auto' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ color: '#00ffff', fontSize: '32px', margin: 0 }}>DARCY128 Code Viewer</h1>
              <p style={{ color: '#cccccc', marginTop: '10px' }}>
                View and execute compiled DARCY128 assembly code
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={executeNextInstruction}
                disabled={isRunning || currentLine >= compiledCode.length - 1}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isRunning || currentLine >= compiledCode.length - 1 ? '#666' : '#0066ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isRunning || currentLine >= compiledCode.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ⏭️ Next Step
              </button>
              <button
                onClick={runAllInstructions}
                disabled={isRunning}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isRunning ? '#666' : '#00ff00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ▶️ Run All
              </button>
              <button
                onClick={resetProgram}
                disabled={isRunning}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isRunning ? '#666' : '#ff6600',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
            {/* Code Panel */}
            <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '10px', border: '2px solid #00ffff', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#0a0a0a' }}>
                <h3 style={{ color: '#00ffff', margin: 0 }}>Compiled Assembly Code</h3>
              </div>
              <div style={{ padding: '20px', height: 'calc(100% - 80px)', overflowY: 'auto' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                  {compiledCode.map((instruction, index) => (
                    <div
                      key={instruction.id}
                      style={{
                        padding: '10px',
                        marginBottom: '5px',
                        backgroundColor: currentLine === index ? '#ff4444' : 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '5px',
                        border: currentLine === index ? '2px solid #ff0000' : '1px solid #333',
                        color: currentLine === index ? '#fff' : '#ccc',
                        fontWeight: currentLine === index ? 'bold' : 'normal'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#888', fontSize: '12px' }}>
                          Line {instruction.lineNumber}:
                        </span>
                        <span style={{ color: '#00ff00', fontSize: '12px' }}>
                          {instruction.hexCode}
                        </span>
                      </div>
                      <div style={{ marginTop: '5px', fontSize: '16px' }}>
                        {instruction.assembly}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CPU State Panel */}
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Registers */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
                <h3 style={{ color: '#00ff00', marginTop: 0 }}>Registers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  {cpuState?.registers.slice(0, 8).map((reg: any, index: number) => (
                    <div key={index} style={{ 
                      padding: '8px', 
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                      borderRadius: '5px',
                      border: '1px solid #333'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#00ff00', fontSize: '12px' }}>{reg.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>{reg.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Registers */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '2px solid #00ff00' }}>
                <h3 style={{ color: '#00ff00', marginTop: 0 }}>Special Registers</h3>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: '5px',
                    border: '1px solid #333',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#00ff00', fontSize: '12px' }}>PC (Program Counter)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>0x{cpuState?.pc?.toString(16).padStart(8, '0')}</div>
                  </div>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: '5px',
                    border: '1px solid #333',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#00ff00', fontSize: '12px' }}>HI (High)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>{cpuState?.hi}</div>
                  </div>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                    borderRadius: '5px',
                    border: '1px solid #333'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#00ff00', fontSize: '12px' }}>LO (Low)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>{cpuState?.lo}</div>
                  </div>
                </div>
              </div>

              {/* Execution History */}
              <div style={{ 
                backgroundColor: '#1a1a1a', 
                borderRadius: '10px', 
                border: '2px solid #00ff00',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #333',
                  backgroundColor: '#0a0a0a'
                }}>
                  <h3 style={{ color: '#00ff00', margin: 0 }}>Execution History</h3>
                </div>
                <div style={{ 
                  flex: 1,
                  padding: '15px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#00ff00',
                  backgroundColor: '#000'
                }}>
                  {executionHistory.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <span style={{ color: '#888' }}>[{new Date().toLocaleTimeString()}]</span> {entry}
                    </div>
                  ))}
                  {executionHistory.length === 0 && (
                    <div style={{ color: '#666', fontStyle: 'italic' }}>
                      No execution history yet. Run some instructions to see output here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
