import React, { useState, useRef } from 'react';

function GrammarInput({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    nonterminals: '',
    terminals: '',
    start_symbol: '',
    productions: ''
  });

  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse the input
    const nonterminals = formData.nonterminals.split(',').map(s => s.trim());
    const terminals = formData.terminals.split(',').map(s => s.trim());
    const start_symbol = formData.start_symbol.trim();

    // Parse productions (format: "S: A B | a")
    const productions = {};
    const prodLines = formData.productions.split('\n').filter(line => line.trim());

    prodLines.forEach(line => {
      const [lhs, rhs] = line.split(':').map(s => s.trim());
      if (lhs && rhs) {
        const alternatives = rhs.split('|').map(alt => alt.trim().split(/\s+/));
        productions[lhs] = alternatives;
      }
    });

    const grammarData = {
      nonterminals,
      terminals,
      start_symbol,
      productions
    };

    onSubmit(grammarData);
  };

  const insertEpsilon = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.productions;
    const newText = text.substring(0, start) + 'ε' + text.substring(end);

    setFormData(prev => ({
      ...prev,
      productions: newText
    }));

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const loadExample = () => {
    setFormData({
      nonterminals: 'S, A, B',
      terminals: 'a, b',
      start_symbol: 'S',
      productions: `S: A B | a
A: a | ε
B: b`
    });
  };

  return (
    <div className="grammar-form">
      <h2>Enter Context-Free Grammar</h2>
      <p>Define your grammar using the fields below</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nonterminals">Nonterminals (comma-separated):</label>
          <input
            type="text"
            id="nonterminals"
            name="nonterminals"
            value={formData.nonterminals}
            onChange={handleChange}
            className="form-input"
            placeholder="S, A, B"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="terminals">Terminals (comma-separated):</label>
          <input
            type="text"
            id="terminals"
            name="terminals"
            value={formData.terminals}
            onChange={handleChange}
            className="form-input"
            placeholder="a, b, c"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="start_symbol">Start Symbol:</label>
          <input
            type="text"
            id="start_symbol"
            name="start_symbol"
            value={formData.start_symbol}
            onChange={handleChange}
            className="form-input"
            placeholder="S"
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="productions" style={{ marginBottom: 0 }}>Productions (one per line, use | for alternatives):</label>
            <button
              type="button"
              className="epsilon-btn"
              onClick={insertEpsilon}
              title="Insert epsilon (ε) symbol"
            >
              ε
            </button>
          </div>
          <textarea
            id="productions"
            name="productions"
            ref={textareaRef}
            value={formData.productions}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder={`S: A B | a
A: a | ε
B: b`}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? 'Simplifying...' : 'Simplify Grammar'}
          </button>
          <button type="button" onClick={loadExample} className="submit-btn" style={{ background: 'var(--secondary-color)' }}>
            Load Example
          </button>
        </div>
      </form>
    </div>
  );
}

export default GrammarInput;
