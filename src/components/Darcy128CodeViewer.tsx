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

  useEffect(() => {
    const init = async () => {
      try {
        const state = await stateService.loadState();
        if (state?.cpuState) {
          cpu.setState(state.cpuState);
          setCpuState(state.cpuState);
        } else {
          setCpuState(cpu.getState());
        }
      } catch {
        setCpuState(cpu.getState());
      }
    };
    init();
  }, []);

  useEffect(() => {
    const sample: CompiledInstruction[] = [
      { id: '1', type: 'lis', params: { rd: '1', immediate: '100' }, hexCode: '0x00000814', assembly: 'lis $1, 100', lineNumber: 1 },
      { id: '2', type: 'lis', params: { rd: '2', immediate: '200' }, hexCode: '0x00001014', assembly: 'lis $2, 200', lineNumber: 2 },
      { id: '3', type: 'add', params: { rd: '3', rs: '1', rt: '2' }, hexCode: '0x00221820', assembly: 'add $3, $1, $2', lineNumber: 3 },
      { id: '4', type: 'jr', params: { rs: '0' }, hexCode: '0x00000008', assembly: 'jr $0', lineNumber: 4 }
    ];
    setCompiledCode(sample);
  }, []);

  const addToHistory = (m: string) => setExecutionHistory(prev => [...prev, m]);

  const executeNextInstruction = async () => {
    if (currentLine >= compiledCode.length - 1) {
      addToHistory('Program execution completed');
      setIsRunning(false);
      return;
    }
    const idx = currentLine + 1;
    const inst = compiledCode[idx];
    setCurrentLine(idx);
    addToHistory(`Executing line ${idx + 1}: ${inst.assembly}`);
    try {
      const hexInstruction = new HexInstruction(inst.hexCode);
      cpu.executeInstruction(hexInstruction);
      const newState = cpu.getState();
      setCpuState(newState);
      addToHistory('Instruction executed successfully');
      await stateService.saveState(newState, executionHistory, {});
    } catch (e) {
      addToHistory(`Error: ${e}`);
    }
  };

  const runAllInstructions = async () => {
    setIsRunning(true);
    setCurrentLine(-1);
    for (let i = 0; i < compiledCode.length; i++) {
      await executeNextInstruction();
      await new Promise(r => setTimeout(r, 300));
    }
    setIsRunning(false);
  };

  const resetProgram = async () => {
    cpu.reset();
    const s = cpu.getState();
    setCpuState(s);
    setCurrentLine(-1);
    setExecutionHistory([]);
    addToHistory('Program reset');
    try { await stateService.saveState(s, [], {}); } catch {}
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', overflowY: 'auto' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ color: '#00ffff', fontSize: '32px', margin: 0 }}>MIPS Step</h1>
            <p style={{ color: '#cccccc', marginTop: '10px' }}>Execute compiled assembly step-by-step</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 220px)' }}>
            {/* Code Panel */}
            <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '10px', border: '2px solid #00ffff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #333', backgroundColor: '#0a0a0a' }}>
                <h3 style={{ color: '#00ffff', margin: 0 }}>Compiled Assembly Code</h3>
              </div>
              <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                  {compiledCode.map((instruction, index) => (
                    <div key={instruction.id} style={{ padding: '10px', marginBottom: '6px', backgroundColor: currentLine === index ? '#ff4444' : 'rgba(0,0,0,0.3)', borderRadius: '5px', border: currentLine === index ? '2px solid #ff0000' : '1px solid #333', color: currentLine === index ? '#fff' : '#ccc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#888', fontSize: '12px' }}>Line {instruction.lineNumber}:</span>
                        <span style={{ color: '#00ff00', fontSize: '12px' }}>{instruction.hexCode}</span>
                      </div>
                      <div style={{ marginTop: '4px', fontSize: '16px' }}>{instruction.assembly}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Controls bottom */}
              <div style={{ padding: '12px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={executeNextInstruction} disabled={isRunning || currentLine >= compiledCode.length - 1} style={{ padding: '10px 20px', backgroundColor: isRunning || currentLine >= compiledCode.length - 1 ? '#666' : '#0066ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: isRunning || currentLine >= compiledCode.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>⏭️ Next Step</button>
                <button onClick={runAllInstructions} disabled={isRunning} style={{ padding: '10px 20px', backgroundColor: isRunning ? '#666' : '#00ff00', color: '#fff', border: 'none', borderRadius: '5px', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>▶️ Run All</button>
                <button onClick={resetProgram} disabled={isRunning} style={{ padding: '10px 20px', backgroundColor: isRunning ? '#666' : '#ff6600', color: '#fff', border: 'none', borderRadius: '5px', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>🔄 Reset</button>
              </div>
            </div>

            {/* Right Panel - Execution History */}
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: '#1a1a1a', borderRadius: '10px', border: '2px solid #00ff00', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #333', backgroundColor: '#0a0a0a' }}>
                  <h3 style={{ color: '#00ff00', margin: 0 }}>Execution History</h3>
                </div>
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', color: '#00ff00', backgroundColor: '#000' }}>
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
