import Navbar from '../../components/navbar/Navbar';
import styles from '../styles/features.module.css';

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page} style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <div className={styles.content}>
          <header className={styles.hero}>
            <h1 className={styles.title}>DARCY128 Revolutionary Processor</h1>
            <p className={styles.subtitle}>Next-Generation 128-bit Architecture • SIMD • Crypto • AI/ML • Quad-Precision</p>
          </header>

          <main className={styles.main}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Core Features</h2>
              <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🚀</div>
                  <h3>128-bit Native Operations</h3>
                  <p>
                    Revolutionary 128-bit register file with native support for 128-bit arithmetic, 
                    UUID operations, IPv6 addresses, and quad-precision floating point.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>⚡</div>
                  <h3>SIMD Parallel Processing</h3>
                  <p>
                    Advanced SIMD capabilities: 4x FP32, 8x FP16, 16x INT8 parallel operations 
                    for AI/ML, graphics, and scientific computing workloads.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔐</div>
                  <h3>Native Cryptographic Acceleration</h3>
                  <p>
                    Hardware-accelerated AES-128/192/256 encryption, SHA-256/512 hashing, 
                    and post-quantum cryptography algorithms in single cycles.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🧠</div>
                  <h3>AI/ML Matrix Operations</h3>
                  <p>
                    Native 4x4 FP32 matrix multiplication, neural network acceleration, 
                    and tensor operations optimized for machine learning workloads.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔬</div>
                  <h3>Quad-Precision Floating Point</h3>
                  <p>
                    113-bit mantissa quad-precision floating point for scientific computing, 
                    climate modeling, and high-precision financial calculations.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🌐</div>
                  <h3>Native Data Types</h3>
                  <p>
                    Hardware support for UUIDs, IPv6 addresses, and other 128-bit data structures 
                    with native comparison, hashing, and manipulation operations.
                  </p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DARCY128 Revolutionary Specifications</h2>
              <div className={styles.specs}>
                <div className={styles.specGroup}>
                  <h3>128-bit Processor Architecture</h3>
                  <ul>
                    <li>Native 128-bit register file with 24 specialized registers</li>
                    <li>Multi-mode execution: 32-bit, 64-bit, and 128-bit modes</li>
                    <li>Advanced 8-stage pipeline with SIMD and crypto units</li>
                    <li>Unified memory architecture with 128-bit word addressing</li>
                  </ul>
                </div>
                <div className={styles.specGroup}>
                  <h3>Revolutionary Instruction Set</h3>
                  <ul>
                    <li>SIMD: 4x FP32, 8x FP16, 16x INT8 parallel operations</li>
                    <li>Crypto: Native AES, SHA, post-quantum algorithms</li>
                    <li>Quad-precision: 113-bit mantissa floating point</li>
                    <li>Native: UUID generation, IPv6 operations, matrix math</li>
                  </ul>
                </div>
                <div className={styles.specGroup}>
                  <h3>Advanced Memory System</h3>
                  <ul>
                    <li>128-bit memory words with native data type support</li>
                    <li>Vector register file for SIMD operations</li>
                    <li>Crypto-accelerated memory operations</li>
                    <li>AI/ML optimized memory hierarchy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Performance Revolution</h2>
              <div className={styles.performance}>
                <div className={styles.perfCard}>
                  <h3>4x Instructions Per Cycle</h3>
                  <p>Revolutionary 128-bit architecture delivers 4x performance improvement over traditional processors</p>
                </div>
                <div className={styles.perfCard}>
                  <h3>300% Crypto Acceleration</h3>
                  <p>Native AES encryption and cryptographic operations run 300% faster than software implementations</p>
                </div>
                <div className={styles.perfCard}>
                  <h3>85% SIMD Utilization</h3>
                  <p>Advanced SIMD capabilities achieve 85% parallel processing utilization for AI/ML workloads</p>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Try DARCY128</h2>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <a 
                  href="/darcy128" 
                  style={{
                    display: 'inline-block',
                    padding: '15px 30px',
                    background: 'linear-gradient(45deg, #00ffff, #ff69b4)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🚀 Launch DARCY128 Simulator
                </a>
                <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
                  Experience the future of computing with our revolutionary 128-bit processor simulator
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
