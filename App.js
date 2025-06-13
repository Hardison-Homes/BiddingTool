import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://ffqentlncmhtvpnyfpiz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcWVudGxuY21odHZwbnlmcGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MzY1ODYsImV4cCI6MjA2NTQxMjU4Nn0.u3mOH31sIgZFZiRfuqeiPyNQLfo-N8M7L6_oe2vOris");

export default function App() {
  const [address, setAddress] = useState('');
  const [items, setItems] = useState([]);
  const [projectLoaded, setProjectLoaded] = useState(false);

  async function loadProject(addr) {
    const { data } = await supabase.from('projects').select('*').eq('address', addr).single();
    if (data) {
      setItems(data.items);
      setProjectLoaded(true);
    } else {
      setItems([]);
      setProjectLoaded(true);
    }
  }

  async function saveProject() {
    await supabase.from('projects').upsert({ address, items });
  }

  function updateItem(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { name: '', price: 0, checked: false }]);
  }

  function removeItem(index) {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  }

  useEffect(() => {
    if (projectLoaded) saveProject();
  }, [items]);

  return (
    <div style={ padding: '1rem' }>
      {
        !projectLoaded ? (
          <div>
            <h2>Enter Project Address</h2>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
            />
            <button onClick={() => loadProject(address)}>Load Project</button>
          </div>
        ) : (
          <div>
            <h2>Project: {address}</h2>
            {
              items.map((item, i) => (
                <div key={i} style={ marginBottom: '10px' }>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => updateItem(i, 'checked', !item.checked)}
                  />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value))}
                    placeholder="Price"
                  />
                  <button onClick={() => removeItem(i)}>Remove</button>
                </div>
              ))
            }
            <button onClick={addItem}>Add Item</button>
          </div>
        )
      }
    </div>
  );
}
