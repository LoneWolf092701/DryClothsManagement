import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, Wind } from 'lucide-react';

interface ClothesItem {
  id: string;
  name: string;
  quantity: number;
}

const STORAGE_KEY = 'laundry-drying-items';

const DEFAULT_CLOTHES_TYPES = [
  'T-Shirts',
  'Jeans',
  'Socks',
  'Underwear',
  'Towels',
  'Shirts',
  'Pants',
  'Bedsheets',
];

function App() {
  const [items, setItems] = useState<ClothesItem[]>([]);
  const [customType, setCustomType] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addClothesType = (name: string) => {
    if (!items.find(item => item.name.toLowerCase() === name.toLowerCase())) {
      setItems([...items, { id: Date.now().toString(), name, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const removeAll = () => {
    setItems([]);
  };

  const handleAddCustom = () => {
    if (customType.trim()) {
      addClothesType(customType.trim());
      setCustomType('');
    }
  };

  const availableTypes = DEFAULT_CLOTHES_TYPES.filter(
    type => !items.find(item => item.name.toLowerCase() === type.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Wind className="w-10 h-10 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Laundry Drying Manager</h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Quick Add</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => addClothesType(type)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Add custom clothes type..."
              className="flex-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCustom}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">Drying Items</h2>
              <button
                onClick={removeAll}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                All Taken
              </button>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-100">{item.name}</h3>
                    <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <span className="text-2xl font-bold text-gray-100 w-12 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ml-2"
                    >
                      Taken
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <Wind className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No items drying. Add some clothes above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
