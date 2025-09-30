import { createContext } from 'preact';
import { useContext, useMemo, useRef } from 'preact/hooks';
import { Darcy128CPU } from '@emulator/Darcy128CPU';
import { defaultMemory } from '@emulator/memory';

export const CPUContext = createContext<Darcy128CPU | null>(null);

export function useProvideCPU(): Darcy128CPU {
  const ref = useRef<Darcy128CPU | null>(null);
  if (ref.current === null) {
    ref.current = new Darcy128CPU(defaultMemory);
  }
  return ref.current;
}

export function useCPU(): Darcy128CPU {
  const cpu = useContext(CPUContext);
  if (!cpu) throw new Error('CPUContext not provided');
  return cpu;
}


