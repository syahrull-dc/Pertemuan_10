// src/workers/sortFilterWorker.js
/* eslint-disable no-restricted-globals */
self.onmessage = function (e) {
    const { users, filterKeyword, sortKey } = e.data;
  
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
    self.postMessage({ result: filtered, duration: (end - start).toFixed(2) });
  };
  