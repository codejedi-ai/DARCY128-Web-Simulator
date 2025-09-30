import Navbar from '../../components/navbar/Navbar';
import styles from '../styles/features.module.css';

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page} style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <div className={styles.content}>
          <header className={styles.hero}>
            <h1 className={styles.title}>DARCY128 Features</h1>
            <p className={styles.subtitle}>MIPS32 Bit Emulator - Educational Processor Simulation</p>
          </header>

          <main className={styles.main}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Core Features</h2>
              <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>⚡</div>
                  <h3>MIPS32 Architecture</h3>
                  <p>
                    Complete 32-bit MIPS processor emulation with full instruction set support, 
                    register file, and pipeline architecture for educational purposes.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🌐</div>
                  <h3>Visual Processor Design</h3>
                  <p>
                    Interactive visualization of processor components, pipeline stages, 
                    and data flow for comprehensive understanding.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔧</div>
                  <h3>Step-by-Step Execution</h3>
                  <p>
                    Detailed MIPS32 instruction execution with real-time register updates, 
                    memory access visualization, and pipeline stage tracking.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🛡️</div>
                  <h3>Educational Tools</h3>
                  <p>
                    Comprehensive learning environment for understanding MIPS32 processor architecture 
                    and instruction set with interactive demos and visual debugging.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>⚙️</div>
                  <h3>Instruction Set Support</h3>
                  <p>
                    Full MIPS32 instruction set implementation including R-type, I-type, 
                    and J-type instructions with proper addressing modes.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📊</div>
                  <h3>Memory Management</h3>
                  <p>
                    Complete memory subsystem with instruction memory, data memory, 
                    and proper memory-mapped I/O for realistic emulation.
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>MIPS32 Specifications</h2>
              <div className={styles.specs}>
                <div className={styles.specGroup}>
                  <h3>Processor Architecture</h3>
                  <ul>
                    <li>32-bit MIPS R3000-compatible architecture</li>
                    <li>32 general-purpose registers ($0-$31)</li>
                    <li>5-stage pipeline: IF, ID, EX, MEM, WB</li>
                    <li>Harvard architecture (separate instruction/data memory)</li>
                  </ul>
                </div>
                <div className={styles.specGroup}>
                  <h3>Instruction Set</h3>
                  <ul>
                    <li>R-type: Arithmetic and logical operations</li>
                    <li>I-type: Immediate operations and branches</li>
                    <li>J-type: Jump instructions</li>
                    <li>Memory access: Load/Store instructions</li>
                  </ul>
                </div>
                <div className={styles.specGroup}>
                  <h3>Memory System</h3>
                  <ul>
                    <li>Instruction Memory: 4KB program storage</li>
                    <li>Data Memory: 4KB data storage</li>
                    <li>Register File: 32 x 32-bit registers</li>
                    <li>Memory-mapped I/O support</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Emulation Features</h2>
              <div className={styles.performance}>
                <div className={styles.perfCard}>
                  <h3>Step Execution</h3>
                  <p>Execute MIPS32 instructions one at a time with visual feedback</p>
                </div>
                <div className={styles.perfCard}>
                  <h3>Register Monitoring</h3>
                  <p>Real-time display of all 32 registers and their values</p>
                </div>
                <div className={styles.perfCard}>
                  <h3>Memory Visualization</h3>
                  <p>Interactive memory viewer for instruction and data memory</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
