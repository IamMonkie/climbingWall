import { useMemo, useState } from 'react';

const colors = ['off', 'yellow', 'blue', 'purple', 'green', 'white'];
const colorMap = {
  off: '#222',
  yellow: '#FFD966',
  blue: '#4A90E2',
  purple: '#A86CEB',
  green: '#7ED321',
  white: '#F8F8F8',
};

const presets = [
  { id: 'warmup', name: 'Warmup Route', pattern: [0, 1, 2, 3, 4, 5] },
  { id: 'crux', name: 'Crux Sequence', pattern: [10, 17, 24, 31, 38] },
];

function App() {
  const [activePattern, setActivePattern] = useState(presets[0]);
  const [customPattern, setCustomPattern] = useState(Array(70).fill('off'));
  const [selectedPreset, setSelectedPreset] = useState(presets[0].id);

  const preview = useMemo(() => {
    return customPattern.map((value, index) => ({ index, value }));
  }, [customPattern]);

  const handleCellClick = (index) => {
    setCustomPattern((current) => {
      const nextColor = colors[(colors.indexOf(current[index]) + 1) % colors.length];
      const next = [...current];
      next[index] = nextColor;
      return next;
    });
  };

  const applyPreset = (preset) => {
    setSelectedPreset(preset.id);
    setActivePattern(preset);
    const nextColors = Array(70).fill('off');
    preset.pattern.forEach((position, idx) => {
      nextColors[position] = colors[(idx % (colors.length - 1)) + 1];
    });
    setCustomPattern(nextColors);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Climbing Wall LED Control</h1>
        <p>React + Vite MVP for Kilter Full Ride 7×10 board patterns.</p>
      </header>

      <section className="panel">
        <div className="preset-list">
          <h2>Preset Patterns</h2>
          {presets.map((preset) => (
            <button
              key={preset.id}
              className={preset.id === selectedPreset ? 'active' : ''}
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
          <button className="create-button" onClick={() => setSelectedPreset('custom')}>
            + Create Custom Pattern
          </button>
        </div>

        <div className="pattern-preview">
          <h2>Pattern Preview</h2>
          <div className="board-grid">
            {preview.map((cell) => (
              <button
                key={cell.index}
                className="board-cell"
                style={{ background: colorMap[cell.value] }}
                onClick={() => handleCellClick(cell.index)}
                aria-label={`Position ${cell.index + 1}, ${cell.value}`}
              />
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>Tap a position to cycle through color states. The app can later send this pattern to an ESP32 controller.</p>
      </footer>
    </div>
  );
}

export default App;
