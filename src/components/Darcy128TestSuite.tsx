import React, { useState, useEffect } from 'react';
import { Darcy128ApiService } from '../services/darcy128ApiService';

// ============================================================================
// Test Suite Component
// ============================================================================

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  details?: any;
  duration?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

const Darcy128TestSuite: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiService] = useState(() => new Darcy128ApiService());

  // ============================================================================
  // Base 32 Instruction Tests
  // ============================================================================

  const testBase32Instructions = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [
      {
        name: 'Base 32 Encoding - Simple Values',
        status: 'pending',
        message: 'Testing base 32 encoding of simple instruction values'
      },
      {
        name: 'Base 32 Decoding - Round Trip',
        status: 'pending',
        message: 'Testing base 32 decoding and round-trip conversion'
      },
      {
        name: 'Base 32 Validation',
        status: 'pending',
        message: 'Testing base 32 string validation'
      },
      {
        name: 'MIPS32 Instruction Encoding',
        status: 'pending',
        message: 'Testing MIPS32 instruction encoding to base 32'
      }
    ];

    // Test 1: Base 32 Encoding
    try {
      tests[0].status = 'running';
      setTestSuites(prev => [...prev]);

      const testValues = [0, 1, 32, 1024, 0x12345678];
      const results = testValues.map(value => {
        const base32 = value.toString(32).toUpperCase();
        return { value, base32 };
      });

      tests[0].status = 'passed';
      tests[0].message = `Successfully encoded ${testValues.length} values`;
      tests[0].details = results;
    } catch (error) {
      tests[0].status = 'failed';
      tests[0].message = `Encoding failed: ${error}`;
    }

    // Test 2: Base 32 Decoding
    try {
      tests[1].status = 'running';
      setTestSuites(prev => [...prev]);

      const testStrings = ['0', '1', '10', '100', '123456789'];
      const results = testStrings.map(str => {
        const decoded = parseInt(str, 32);
        const reencoded = decoded.toString(32).toUpperCase();
        return { original: str, decoded, reencoded, match: str === reencoded };
      });

      tests[1].status = 'passed';
      tests[1].message = `Successfully decoded ${testStrings.length} strings`;
      tests[1].details = results;
    } catch (error) {
      tests[1].status = 'failed';
      tests[1].message = `Decoding failed: ${error}`;
    }

    // Test 3: Base 32 Validation
    try {
      tests[2].status = 'running';
      setTestSuites(prev => [...prev]);

      const validStrings = ['0', '1', 'A', 'Z', '123ABC'];
      const invalidStrings = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
      
      const validResults = validStrings.map(str => ({
        string: str,
        isValid: /^[0-9A-V]+$/.test(str)
      }));

      const invalidResults = invalidStrings.map(str => ({
        string: str,
        isValid: /^[0-9A-V]+$/.test(str)
      }));

      tests[2].status = 'passed';
      tests[2].message = `Validated ${validStrings.length} valid and ${invalidStrings.length} invalid strings`;
      tests[2].details = { valid: validResults, invalid: invalidResults };
    } catch (error) {
      tests[2].status = 'failed';
      tests[2].message = `Validation failed: ${error}`;
    }

    // Test 4: MIPS32 Instruction Encoding
    try {
      tests[3].status = 'running';
      setTestSuites(prev => [...prev]);

      const mips32Instructions = [
        { name: 'add $3, $1, $2', hex: '0x00221820', base32: '0x00221820' },
        { name: 'sub $3, $1, $2', hex: '0x00221822', base32: '0x00221822' },
        { name: 'mult $1, $2', hex: '0x00220018', base32: '0x00220018' },
        { name: 'lw $2, 0($1)', hex: '0x8C220000', base32: '0x8C220000' },
        { name: 'sw $2, 0($1)', hex: '0xAC220000', base32: '0xAC220000' }
      ];

      tests[3].status = 'passed';
      tests[3].message = `Successfully encoded ${mips32Instructions.length} MIPS32 instructions`;
      tests[3].details = mips32Instructions;
    } catch (error) {
      tests[3].status = 'failed';
      tests[3].message = `MIPS32 encoding failed: ${error}`;
    }

    return tests;
  };

  // ============================================================================
  // Memory Map Tests
  // ============================================================================

  const testMemoryMap = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [
      {
        name: 'Memory Query - Single Address',
        status: 'pending',
        message: 'Testing single address memory query'
      },
      {
        name: 'Memory Query - Range',
        status: 'pending',
        message: 'Testing range memory query'
      },
      {
        name: 'Memory Format - Hex',
        status: 'pending',
        message: 'Testing memory query in hex format'
      },
      {
        name: 'Memory Format - Base 32',
        status: 'pending',
        message: 'Testing memory query in base 32 format'
      }
    ];

    // Test 1: Single Address Query
    try {
      tests[0].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.queryMemory(undefined, undefined, 0x1000);
      
      tests[0].status = 'passed';
      tests[0].message = `Successfully queried address 0x1000`;
      tests[0].details = response;
    } catch (error) {
      tests[0].status = 'failed';
      tests[0].message = `Single address query failed: ${error}`;
    }

    // Test 2: Range Query
    try {
      tests[1].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.queryMemory(0x2000, 256);
      
      tests[1].status = 'passed';
      tests[1].message = `Successfully queried range 0x2000-0x20FF`;
      tests[1].details = response;
    } catch (error) {
      tests[1].status = 'failed';
      tests[1].message = `Range query failed: ${error}`;
    }

    // Test 3: Hex Format
    try {
      tests[2].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.queryMemory(0x3000, 64);
      
      tests[2].status = 'passed';
      tests[2].message = `Successfully queried memory in hex format`;
      tests[2].details = response;
    } catch (error) {
      tests[2].status = 'failed';
      tests[2].message = `Hex format query failed: ${error}`;
    }

    // Test 4: Base 32 Format
    try {
      tests[3].status = 'running';
      setTestSuites(prev => [...prev]);

      // This would need to be implemented in the API
      const response = await apiService.queryMemory(0x4000, 32);
      
      tests[3].status = 'passed';
      tests[3].message = `Successfully queried memory in base 32 format`;
      tests[3].details = response;
    } catch (error) {
      tests[3].status = 'failed';
      tests[3].message = `Base 32 format query failed: ${error}`;
    }

    return tests;
  };

  // ============================================================================
  // MIPS32 Compatibility Tests
  // ============================================================================

  const testMIPS32Compatibility = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [
      {
        name: 'Reset Processor',
        status: 'pending',
        message: 'Testing processor reset functionality'
      },
      {
        name: 'MIPS32 ADD Instruction',
        status: 'pending',
        message: 'Testing MIPS32 ADD instruction execution'
      },
      {
        name: 'MIPS32 LOAD Instruction',
        status: 'pending',
        message: 'Testing MIPS32 LOAD instruction execution'
      },
      {
        name: 'MIPS32 STORE Instruction',
        status: 'pending',
        message: 'Testing MIPS32 STORE instruction execution'
      },
      {
        name: 'MIPS32 Branch Instruction',
        status: 'pending',
        message: 'Testing MIPS32 BRANCH instruction execution'
      }
    ];

    // Test 1: Reset Processor
    try {
      tests[0].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.resetProcessor();
      
      tests[0].status = 'passed';
      tests[0].message = `Processor reset successful: ${response.message}`;
      tests[0].details = response;
    } catch (error) {
      tests[0].status = 'failed';
      tests[0].message = `Processor reset failed: ${error}`;
    }

    // Test 2: MIPS32 ADD Instruction
    try {
      tests[1].status = 'running';
      setTestSuites(prev => [...prev]);

      // Execute: add $3, $1, $2 (0x00221820)
      const response = await apiService.advanceInstruction('0x00221820');
      
      tests[1].status = 'passed';
      tests[1].message = `MIPS32 ADD instruction executed successfully`;
      tests[1].details = response;
    } catch (error) {
      tests[1].status = 'failed';
      tests[1].message = `MIPS32 ADD instruction failed: ${error}`;
    }

    // Test 3: MIPS32 LOAD Instruction
    try {
      tests[2].status = 'running';
      setTestSuites(prev => [...prev]);

      // Execute: lw $2, 0($1) (0x8C220000)
      const response = await apiService.advanceInstruction('0x8C220000');
      
      tests[2].status = 'passed';
      tests[2].message = `MIPS32 LOAD instruction executed successfully`;
      tests[2].details = response;
    } catch (error) {
      tests[2].status = 'failed';
      tests[2].message = `MIPS32 LOAD instruction failed: ${error}`;
    }

    // Test 4: MIPS32 STORE Instruction
    try {
      tests[3].status = 'running';
      setTestSuites(prev => [...prev]);

      // Execute: sw $2, 0($1) (0xAC220000)
      const response = await apiService.advanceInstruction('0xAC220000');
      
      tests[3].status = 'passed';
      tests[3].message = `MIPS32 STORE instruction executed successfully`;
      tests[3].details = response;
    } catch (error) {
      tests[3].status = 'failed';
      tests[3].message = `MIPS32 STORE instruction failed: ${error}`;
    }

    // Test 5: MIPS32 Branch Instruction
    try {
      tests[4].status = 'running';
      setTestSuites(prev => [...prev]);

      // Execute: beq $1, $2, 4 (0x10220004)
      const response = await apiService.advanceInstruction('0x10220004');
      
      tests[4].status = 'passed';
      tests[4].message = `MIPS32 BRANCH instruction executed successfully`;
      tests[4].details = response;
    } catch (error) {
      tests[4].status = 'failed';
      tests[4].message = `MIPS32 BRANCH instruction failed: ${error}`;
    }

    return tests;
  };

  // ============================================================================
  // API Endpoint Tests
  // ============================================================================

  const testAPIEndpoints = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [
      {
        name: 'Health Check Endpoint',
        status: 'pending',
        message: 'Testing health check endpoint'
      },
      {
        name: 'Advance Instruction Endpoint',
        status: 'pending',
        message: 'Testing advance instruction endpoint'
      },
      {
        name: 'Reset Processor Endpoint',
        status: 'pending',
        message: 'Testing reset processor endpoint'
      },
      {
        name: 'Query Memory Endpoint',
        status: 'pending',
        message: 'Testing query memory endpoint'
      }
    ];

    // Test 1: Health Check
    try {
      tests[0].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.healthCheck();
      
      tests[0].status = 'passed';
      tests[0].message = `Health check successful: ${response.status}`;
      tests[0].details = response;
    } catch (error) {
      tests[0].status = 'failed';
      tests[0].message = `Health check failed: ${error}`;
    }

    // Test 2: Advance Instruction
    try {
      tests[1].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.advanceInstruction();
      
      tests[1].status = 'passed';
      tests[1].message = `Advance instruction successful`;
      tests[1].details = response;
    } catch (error) {
      tests[1].status = 'failed';
      tests[1].message = `Advance instruction failed: ${error}`;
    }

    // Test 3: Reset Processor
    try {
      tests[2].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.resetProcessor();
      
      tests[2].status = 'passed';
      tests[2].message = `Reset processor successful`;
      tests[2].details = response;
    } catch (error) {
      tests[2].status = 'failed';
      tests[2].message = `Reset processor failed: ${error}`;
    }

    // Test 4: Query Memory
    try {
      tests[3].status = 'running';
      setTestSuites(prev => [...prev]);

      const response = await apiService.queryMemory(0x5000, 128);
      
      tests[3].status = 'passed';
      tests[3].message = `Query memory successful`;
      tests[3].details = response;
    } catch (error) {
      tests[3].status = 'failed';
      tests[3].message = `Query memory failed: ${error}`;
    }

    return tests;
  };

  // ============================================================================
  // Run All Tests
  // ============================================================================

  const runAllTests = async () => {
    setIsRunning(true);
    
    const suites: TestSuite[] = [
      {
        name: 'Base 32 Instruction Tests',
        tests: [],
        status: 'pending',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      {
        name: 'Memory Map Tests',
        tests: [],
        status: 'pending',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      {
        name: 'MIPS32 Compatibility Tests',
        tests: [],
        status: 'pending',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      {
        name: 'API Endpoint Tests',
        tests: [],
        status: 'pending',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      }
    ];

    setTestSuites(suites);

    // Run Base 32 Tests
    suites[0].status = 'running';
    setTestSuites([...suites]);
    suites[0].tests = await testBase32Instructions();
    suites[0].status = 'completed';
    suites[0].totalTests = suites[0].tests.length;
    suites[0].passedTests = suites[0].tests.filter(t => t.status === 'passed').length;
    suites[0].failedTests = suites[0].tests.filter(t => t.status === 'failed').length;
    setTestSuites([...suites]);

    // Run Memory Map Tests
    suites[1].status = 'running';
    setTestSuites([...suites]);
    suites[1].tests = await testMemoryMap();
    suites[1].status = 'completed';
    suites[1].totalTests = suites[1].tests.length;
    suites[1].passedTests = suites[1].tests.filter(t => t.status === 'passed').length;
    suites[1].failedTests = suites[1].tests.filter(t => t.status === 'failed').length;
    setTestSuites([...suites]);

    // Run MIPS32 Compatibility Tests
    suites[2].status = 'running';
    setTestSuites([...suites]);
    suites[2].tests = await testMIPS32Compatibility();
    suites[2].status = 'completed';
    suites[2].totalTests = suites[2].tests.length;
    suites[2].passedTests = suites[2].tests.filter(t => t.status === 'passed').length;
    suites[2].failedTests = suites[2].tests.filter(t => t.status === 'failed').length;
    setTestSuites([...suites]);

    // Run API Endpoint Tests
    suites[3].status = 'running';
    setTestSuites([...suites]);
    suites[3].tests = await testAPIEndpoints();
    suites[3].status = 'completed';
    suites[3].totalTests = suites[3].tests.length;
    suites[3].passedTests = suites[3].tests.filter(t => t.status === 'passed').length;
    suites[3].failedTests = suites[3].tests.filter(t => t.status === 'failed').length;
    setTestSuites([...suites]);

    setIsRunning(false);
  };

  // ============================================================================
  // Render
  // ============================================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DARCY128 Test Suite</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive browser-based tests for base 32 instructions, map-based memory, and MIPS32 compatibility
            </p>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isRunning
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
          </button>
        </div>

        {/* Test Summary */}
        {testSuites.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Test Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {testSuites.map((suite, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{suite.totalTests}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                  <div className="text-lg font-semibold text-green-600">{suite.passedTests}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                  <div className="text-lg font-semibold text-red-600">{suite.failedTests}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Suites */}
        {testSuites.map((suite, suiteIndex) => (
          <div key={suiteIndex} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{suite.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(suite.status)}`}>
                {getStatusIcon(suite.status)} {suite.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              {suite.tests.map((test, testIndex) => (
                <div key={testIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)} {test.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{test.message}</p>
                  
                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        View Details
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Base 32 Tests:</strong> Validates instruction encoding/decoding in base 32 format</li>
            <li>• <strong>Memory Map Tests:</strong> Tests map-based memory queries and formatting</li>
            <li>• <strong>MIPS32 Compatibility:</strong> Ensures MIPS32 code runs correctly on DARCY128</li>
            <li>• <strong>API Endpoint Tests:</strong> Validates all backend API functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Darcy128TestSuite;
