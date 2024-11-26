import React from 'react';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">営業パイプライン分析</h1>
      </header>
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;

