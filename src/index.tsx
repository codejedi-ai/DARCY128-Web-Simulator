import { render } from 'preact';
import Router from './Router';
import { InstructionProvider } from './emulator/InstructionContext';

function AppRoot() {
  return (
    <InstructionProvider>
      <Router />
    </InstructionProvider>
  );
}

render(<AppRoot />, document.getElementById('app'));
