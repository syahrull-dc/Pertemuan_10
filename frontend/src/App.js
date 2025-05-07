import React, { useState } from 'react';
import AsyncFetcher from './components/AsyncFetcher';
import FilterSorter from './components/FilterSorter';
import StreamingView from './components/StreamingView';
import './App.css';


function App() {
  const [data, setData] = useState([]);

  return (
    <div className="container">

      <h1>Tugas Web Lanjut - Pertemuan 10</h1>
      
      {/* A: Async Patterns */}
      <AsyncFetcher onFetched={setData} />

      {/* B–D: Filter & Sort + Caching + UI */}
      <FilterSorter users={data} />

      {/* E: Streaming Simulasi */}
      <StreamingView />
    </div>
  );
}

export default App;
