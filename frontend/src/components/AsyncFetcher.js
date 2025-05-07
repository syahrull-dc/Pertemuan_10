import React, { useState } from 'react';

const AsyncFetcher = ({ onFetched }) => {
  const [dataAll, setDataAll] = useState([]);
  const [dataAllSettled, setDataAllSettled] = useState([]);
  const [timeAll, setTimeAll] = useState(null);
  const [timeAllSettled, setTimeAllSettled] = useState(null);

  const fetchPages = (page) =>
    fetch(`http://localhost:5000/api/pengguna?page=${page}`).then(res => res.json());

  const handleFetchAll = async () => {
    const start = performance.now();
    try {
      const results = await Promise.all([
        fetchPages(1),
        fetchPages(2),
        fetchPages(3)
      ]);
      const combined = results.flat();
      setDataAll(combined);
      onFetched(combined); // Kirim data ke parent
    } catch (err) {
      console.error(err);
    }
    const end = performance.now();
    setTimeAll((end - start).toFixed(2));
  };

  const handleFetchAllSettled = async () => {
    const start = performance.now();
    const results = await Promise.allSettled([
      fetchPages(1),
      fetchPages(2),
      fetchPages(3)
    ]);
    const fulfilled = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .flat();
    setDataAllSettled(fulfilled);
    onFetched(fulfilled); // Kirim data ke parent
    const end = performance.now();
    setTimeAllSettled((end - start).toFixed(2));
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem' }}>
      <h2>Async Fetcher</h2>

      <button onClick={handleFetchAll}>Fetch dengan Promise.all()</button>
      <p>Waktu: {timeAll ? `${timeAll} ms` : '-'}</p>
      <p>Total Data: {dataAll.length}</p>

      <button onClick={handleFetchAllSettled}>Fetch dengan Promise.allSettled()</button>
      <p>Waktu: {timeAllSettled ? `${timeAllSettled} ms` : '-'}</p>
      <p>Total Data: {dataAllSettled.length}</p>
    </div>
  );
};

export default AsyncFetcher;
