import { Navbar } from '../../components/Navbar';
import { HackathonBody } from '../../components/HackathonBody';

export function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HackathonBody />
    </div>
  );
}