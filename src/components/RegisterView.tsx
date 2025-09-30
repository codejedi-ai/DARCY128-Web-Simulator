import React, { useEffect, useState } from 'react';
import Navbar from './navbar/Navbar';
import { Darcy128CPU } from '../emulator/Darcy128CPU';
import { Darcy128StateService } from '../services/Darcy128StateService';

export default function RegisterView() {
  const [cpu] = useState(() => new Darcy128CPU());
  const [stateService] = useState(() => new Darcy128StateService());
  const [cpuState, setCpuState] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const loaded = await stateService.loadState();
        if (loaded?.cpuState) {
          cpu.setState(loaded.cpuState);
          setCpuState(loaded.cpuState);
          return;
        }
      } catch {}
      setCpuState(cpu.getState());
    };
    init();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', overflowY: 'auto' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#00ffff', marginBottom: '20px' }}>Register View</h1>

          {!cpuState ? (
            <div style={{ color: '#888' }}>Loading CPU state...</div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>General Registers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {cpuState.registers.map((reg: any, idx: number) => (
                    <div key={idx} style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                      <div style={{ color: '#00ff00', fontWeight: 'bold' }}>{reg.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ccc', marginTop: '6px' }}>{reg.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>Special Registers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                    <div style={{ color: '#00ff00', fontWeight: 'bold' }}>PC</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ccc', marginTop: '6px' }}>0x{cpuState.pc.toString(16).padStart(8, '0')}</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                    <div style={{ color: '#00ff00', fontWeight: 'bold' }}>HI</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ccc', marginTop: '6px' }}>{cpuState.hi}</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                    <div style={{ color: '#00ff00', fontWeight: 'bold' }}>LO</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ccc', marginTop: '6px' }}>{cpuState.lo}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
