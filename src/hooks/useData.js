import { useState, useEffect } from 'react';
import { ref, onValue, set, get, update } from 'firebase/database';
import { db } from '../lib/firebase';

// Strip any fields containing large base64/attachment data from an object
function stripLargeData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    // Skip fields that look like base64 or JSON arrays of base64
    if (typeof val === 'string' && val.length > 50000) continue;
    result[key] = val;
  }
  return result;
}

function cleanEntityArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(stripLargeData);
}

export function useData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem('frame_app_cache');
    if (cached) {
      try { setData(JSON.parse(cached)); } catch (e) {}
    }

    const dataRef = ref(db, '/');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setError(null);
        try {
          const cacheData = { ...val };
          delete cacheData.attachments;
          localStorage.setItem('frame_app_cache', JSON.stringify(cacheData));
        } catch (e) { console.error("Cache error", e); }
      } else {
        const initialData = { 
          clients: [], tasks: [], invoices: [], offers: [],
          settings: { 
            companyName: "مكتب فريمي الهندسي",
            services: ['تصميم معماري', 'إشراف هندسي', 'رفع مساحي', 'استشارات هندسية', 'تقرير فني']
          } 
        };
        set(dataRef, initialData);
      }
    }, (error) => {
      console.error("Firebase fetch error:", error);
      setError(error);
    });

    return () => unsubscribe();
  }, []);

  const getAttachment = async (id) => {
    try {
      const snap = await get(ref(db, `attachments/${id}`));
      return snap.val();
    } catch (e) { return null; }
  };

  const updateData = async (entity, action, payload, id = null) => {
    try {
      if (entity === 'settings') {
        // Write only the settings node
        const newSettings = { ...(data?.settings || {}), ...payload };
        await update(ref(db, '/'), { settings: newSettings });
        return;
      }

      if (entity === 'bulk') {
        // Write each top-level key separately (never attachments)
        const updates = {};
        for (const key of Object.keys(payload)) {
          if (key === 'attachments') continue;
          updates[key] = payload[key];
        }
        await update(ref(db, '/'), updates);
        return;
      }

      // For arrays (clients, tasks, invoices, offers…)
      const current = data?.[entity] || [];
      const arr = Array.isArray(current) ? current : Object.values(current);
      
      let newArr;
      if (action === 'add') newArr = [...arr, payload];
      else if (action === 'update') newArr = arr.map(item => item.id === id ? { ...item, ...payload } : item);
      else if (action === 'delete') newArr = arr.filter(item => item.id !== id);
      else newArr = arr;

      // Always strip large attachment data before writing the list
      await update(ref(db, '/'), { [entity]: cleanEntityArray(newArr) });

      try {
        const cacheData = { ...data, [entity]: newArr };
        delete cacheData.attachments;
        localStorage.setItem('frame_app_cache', JSON.stringify(cacheData));
      } catch (e) { console.error("Cache error", e); }
    } catch (err) { console.error("Error updating Firebase:", err); }
  };

  return { data, isLoading: !error && !data, isError: error, updateData, getAttachment };
}
