import React, { useState, useEffect } from 'react';

const CACHE_KEY = 'filtered_users_cache';
const CACHE_EXPIRE_MS = 5 * 60 * 1000; // 5 menit

const FilterSorter = ({ users }) => {
  const [filterKeyword, setFilterKeyword] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [useWorker, setUseWorker] = useState(false);
  const [result, setResult] = useState([]);
  const [duration, setDuration] = useState(null);
  const [useCache, setUseCache] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('Server');

  useEffect(() => {
    if (users.length === 0) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (useCache && cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      if (now - parsed.timestamp < CACHE_EXPIRE_MS) {
        setResult(parsed.data);
        setDuration(parsed.duration);
        setDataSource('Cache');
        return;
      }
    }
    processData();
  }, [users, filterKeyword, sortKey, useWorker]);

  const processData = () => {
    setLoading(true);
    setDataSource('Server');

    if (useWorker) {
      const worker = new Worker(new URL('../workers/sortFilterWorker.js', import.meta.url));
      worker.postMessage({ users, filterKeyword, sortKey });
      worker.onmessage = function (e) {
        const { result, duration } = e.data;
        setResult(result);
        setDuration(duration);
        setLoading(false);
        if (useCache) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: result,
            timestamp: Date.now(),
            duration
          }));
        }
        worker.terminate();
      };
    } else {
      const start = performance.now();
      let filtered = users;
      if (filterKeyword) {
        filtered = users.filter(user =>
          user.nama.toLowerCase().includes(filterKeyword.toLowerCase())
        );
      }
      if (sortKey === 'nama') {
        filtered.sort((a, b) => a.nama.localeCompare(b.nama));
      } else if (sortKey === 'umur') {
        filtered.sort((a, b) => a.umur - b.umur);
      }
      const end = performance.now();
      const duration = (end - start).toFixed(2);
      setResult(filtered);
      setDuration(duration);
      setLoading(false);
      if (useCache) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: filtered,
          timestamp: Date.now(),
          duration
        }));
      }
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    processData();
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', marginTop: '2rem' }}>
      <h2>Filter & Sort</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Filter Nama:</label>
        <input
          type="text"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Urutkan Berdasarkan:</label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="">-</option>
          <option value="nama">Nama</option>
          <option value="umur">Umur</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={useWorker}
            onChange={() => setUseWorker(!useWorker)}
          />
          Gunakan Web Worker
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={handleRefresh}>Segarkan Data</button>
      </div>

      <p>Waktu Proses: {duration ? `${duration} ms` : '-'}</p>
      <p>Sumber Data: {dataSource}</p>

      {loading ? (
        <p><em>Memproses data...</em></p>
      ) : (
        <>
          <h4>Hasil:</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {result.map((user) => (
              <div key={user.id} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: '#f9f9f9'
              }}>
                <strong>{user.nama}</strong>
                <p>Umur: {user.umur}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSorter;
