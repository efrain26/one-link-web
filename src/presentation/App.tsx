import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import '../App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + TypeScript</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/presentation/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #646cff', borderRadius: '8px' }}>
        <h2>Arquitectura DDD + Clean Code</h2>
        <p style={{ fontSize: '0.9rem' }}>
          Este proyecto ahora usa:
        </p>
        <ul style={{ textAlign: 'left', fontSize: '0.85rem' }}>
          <li><strong>Domain Layer:</strong> Entities, Value Objects, Repository Interfaces</li>
          <li><strong>Application Layer:</strong> Use Cases, DTOs, Mappers</li>
          <li><strong>Infrastructure Layer:</strong> HTTP Client, Repository Implementations</li>
          <li><strong>Presentation Layer:</strong> React Components, Hooks, Pages</li>
        </ul>
      </div>
    </>
  );
}

export default App;
